import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { db } from '@/server/db/prisma';
import StatsClient from '@/components/pages/StatsClient';

async function getUser() {
  const session = await auth();
  if (!session?.user?.email) return null;

  return await db.user.findUnique({
    where: { email: session.user.email },
    include: {
      skills: true,
      characters: {
        include: { character: true }
      }
    }
  });
}

async function getStatsData() {
  const session = await auth();
  if (!session?.user?.email) return null;

  const user = await db.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) return null;

  // Obtener estadísticas de tareas
  const totalTasks = await db.task.count({
    where: { userId: user.id }
  });

  const completedTasks = await db.task.count({
    where: { 
      userId: user.id,
      completed: true 
    }
  });

  // Estadísticas por categoría
  const tasksByCategory = await db.task.groupBy({
    by: ['categoryId'],
    where: { userId: user.id },
    _count: {
      _all: true
    },
    _sum: {
      coinReward: true
    }
  });

  const completedTasksByCategory = await db.task.groupBy({
    by: ['categoryId'],
    where: { 
      userId: user.id,
      completed: true 
    },
    _count: {
      _all: true
    }
  });

  // Obtener nombres de categorías
  const categories = await db.taskCategory.findMany();

  // Estadísticas de challenges
  const totalUserChallenges = await db.userChallenge.count({
    where: { userId: user.id }
  });

  const completedChallenges = await db.userChallenge.count({
    where: { 
      userId: user.id,
      completed: true 
    }
  });

  // Estadísticas de compras
  const totalPurchases = await db.userReward.count({
    where: { userId: user.id }
  });

  // Calcular total gastado obteniendo las recompensas compradas
  const userRewards = await db.userReward.findMany({
    where: { userId: user.id },
    include: {
      reward: {
        select: { cost: true }
      }
    }
  });

  const totalSpent = userRewards.reduce((sum, userReward) => sum + userReward.reward.cost, 0);

  // Tareas completadas por día (últimos 30 días)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const tasksLast30Days = await db.task.findMany({
    where: {
      userId: user.id,
      completed: true,
      completedAt: {
        gte: thirtyDaysAgo
      }
    },
    select: {
      completedAt: true,
      coinReward: true,
      category: {
        select: {
          name: true,
          primarySkill: true
        }
      }
    },
    orderBy: {
      completedAt: 'desc'
    }
  });

  // Progreso de habilidades
  const skills = await db.userSkill.findMany({
    where: { userId: user.id },
    orderBy: { totalXP: 'desc' }
  });

  return {
    overview: {
      totalTasks,
      completedTasks,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      totalUserChallenges,
      completedChallenges,
      totalPurchases,
      totalSpent: totalSpent
    },
    tasksByCategory: tasksByCategory.map(stat => {
      const category = categories.find(c => c.id === stat.categoryId);
      const completed = completedTasksByCategory.find(c => c.categoryId === stat.categoryId);
      return {
        categoryName: category?.name || 'Unknown',
        categoryIcon: category?.icon || '📝',
        primarySkill: category?.primarySkill || 'discipline',
        total: stat._count._all,
        completed: completed?._count._all || 0,
        totalCoins: stat._sum.coinReward || 0,
        completionRate: stat._count._all > 0 ? Math.round(((completed?._count._all || 0) / stat._count._all) * 100) : 0
      };
    }),
    tasksLast30Days,
    skills: skills.map(skill => ({
      ...skill,
      xpToNextLevel: (skill.level * 200) - skill.currentXP
    }))
  };
}

export default async function StatsPage() {
  const user = await getUser();
  
  if (!user) {
    redirect('/login');
  }

  const statsData = await getStatsData();

  if (!statsData) {
    redirect('/login');
  }

  return (
    <StatsClient 
      user={user} 
      statsData={statsData}
    />
  );
}
