'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { deleteTask, completeTask, uncompleteTask } from '../../actions';
import type { PrismaUserWithExtras, PrismaTask, PrismaTaskCategory } from '@/lib/types';

// Helper function to convert user with skills array to PrismaUserWithExtras format
function convertUserFormat(user: {
  skills?: Array<{
    skillType: string;
    level: number;
    currentXP: number;
    totalXP: number;
    xpToNextLevel: number;
  }>;
  [key: string]: unknown;
}): PrismaUserWithExtras {
  const skills = {
    physical: { level: 1, currentXP: 0, totalXP: 0, xpToNextLevel: 200 },
    wisdom: { level: 1, currentXP: 0, totalXP: 0, xpToNextLevel: 200 },
    mental: { level: 1, currentXP: 0, totalXP: 0, xpToNextLevel: 200 },
    social: { level: 1, currentXP: 0, totalXP: 0, xpToNextLevel: 200 },
    creativity: { level: 1, currentXP: 0, totalXP: 0, xpToNextLevel: 200 },
    discipline: { level: 1, currentXP: 0, totalXP: 0, xpToNextLevel: 200 },
  };

  // Map skills from array to object format
  if (user.skills && Array.isArray(user.skills)) {
    user.skills.forEach((skill) => {
      if (skill.skillType in skills) {
        skills[skill.skillType as keyof typeof skills] = {
          level: skill.level,
          currentXP: skill.currentXP,
          totalXP: skill.totalXP,
          xpToNextLevel: skill.xpToNextLevel,
        };
      }
    });
  }

  return {
    ...user,
    skills,
  } as PrismaUserWithExtras;
}

import Header from './Home/Header';
import { StatsCard, CompletedTasksCard, TasksList } from '../dashboard';
import { AddTaskModal, EditCompletedTasksModal } from '../modals';

interface HomeClientProps {
  user: PrismaUserWithExtras;
  tasks: PrismaTask[];
  categories: PrismaTaskCategory[];
}

export default function HomeClient({
  user: initialUser,
  tasks: initialTasks,
  categories,
}: HomeClientProps) {
  const router = useRouter();
  const [user, setUser] = useState<PrismaUserWithExtras>(initialUser);
  const [tasks, setTasks] = useState<PrismaTask[]>(initialTasks);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showEditTasksModal, setShowEditTasksModal] = useState(false);
  const [rewardNotification, setRewardNotification] = useState<string | null>(null);

  const toggleTask = useCallback(
    async (taskId: string) => {
      try {
        const task = tasks.find((t) => t.id === taskId);
        if (!task) return;

        if (task.completed) {
          // Desmarcar tarea
          const result = await uncompleteTask(taskId);
          if (result.success) {
            setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, completed: false } : t)));

            // Actualizar usuario dinámicamente
            if (result.user) {
              setUser(convertUserFormat(result.user));
            }

            // Mostrar notificación de recompensas revertidas
            if (result.rewards) {
              setRewardNotification(`${result.rewards.xp} XP, ${result.rewards.coins} monedas revertidas`);
              setTimeout(() => setRewardNotification(null), 3000);
            }

            router.refresh();
          }
        } else {
          // Completar tarea
          const result = await completeTask(taskId);
          if (result.success) {
            setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, completed: true } : t)));

            // Actualizar usuario dinámicamente si se devolvió información actualizada
            if (result.user) {
              setUser(convertUserFormat(result.user));
            }

            // Mostrar notificación de recompensas
            if (result.rewards) {
              setRewardNotification(`¡+${result.rewards.xp} XP, +${result.rewards.coins} monedas!`);
              setTimeout(() => setRewardNotification(null), 3000);
            }

            router.refresh();
          }
        }
      } catch (error) {
        console.error('Error toggling task:', error);
      }
    },
    [tasks, router]
  );

  const removeTask = useCallback(
    async (taskId: string) => {
      try {
        const result = await deleteTask(taskId);
        if (result.success) {
          setTasks((prev) => prev.filter((t) => t.id !== taskId));
          router.refresh();
        }
      } catch (error) {
        console.error('Error removing task:', error);
      }
    },
    [router]
  );

  const handleTaskCreated = useCallback(
    (task: PrismaTask) => {
      setTasks((prev) => [task, ...prev]);
      router.refresh();
    },
    [router]
  );

  // Separar tareas completadas y pendientes
  const { completedTasks, pendingTasks } = useMemo(() => {
    const completed = tasks.filter((task) => task.completed);
    const pending = tasks.filter((task) => !task.completed);
    return { completedTasks: completed, pendingTasks: pending };
  }, [tasks]);

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* <NotificationManager /> */}
      <Header user={user} />

      {/* Notificación de recompensas */}
      {rewardNotification && (
        <div className='fixed top-20 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-pulse'>
          {rewardNotification}
        </div>
      )}

      <div className='container mx-auto px-4 py-8'>
        <div className='grid lg:grid-cols-3 gap-8'>
          {/* Panel principal de tareas */}
          <div className='lg:col-span-2'>
            <TasksList
              pendingTasks={pendingTasks}
              onAddTaskClick={() => setShowAddTaskModal(true)}
              onTaskClick={toggleTask}
            />
          </div>

          {/* Panel lateral con stats y tareas completadas */}
          <div className='space-y-6'>
            <StatsCard
              completedTasks={completedTasks.length}
              pendingTasks={pendingTasks.length}
              streak={user.streak}
            />

            <CompletedTasksCard
              completedTasks={completedTasks}
              onEditClick={() => setShowEditTasksModal(true)}
            />
          </div>
        </div>
      </div>

      {/* Modales componentizados */}
      <AddTaskModal
        open={showAddTaskModal}
        onOpenChange={setShowAddTaskModal}
        categories={categories}
        onTaskCreated={handleTaskCreated}
      />

      <EditCompletedTasksModal
        open={showEditTasksModal}
        onOpenChange={setShowEditTasksModal}
        completedTasks={completedTasks}
        onToggleTask={toggleTask}
        onRemoveTask={removeTask}
      />
    </div>
  );
}
