'use client';

import { useState, useCallback, useMemo } from 'react';
import { createTask } from '../../actions';
import type { PrismaTask, PrismaTaskCategory } from '@/lib/types';
import { calculateTaskRewards, formatXPBreakdown } from '@/lib/gamification';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Select,
  NeoSelectContent,
  NeoSelectItem,
  NeoSelectTrigger,
  SelectValue,
} from '../ui/select';
import { Label } from '../ui/label';
import { Dialog, NeoDialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Tabs, TabsContent, NeoTabsList, NeoTabsTrigger } from '../ui/tabs';
import ActivitySuggestions from '../ActivitySuggestions';
import type { ActivityDefinition } from '@/lib/activities';

interface AddTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: PrismaTaskCategory[];
  onTaskCreated: (task: PrismaTask) => void;
}

export default function AddTaskModal({
  open,
  onOpenChange,
  categories,
  onTaskCreated,
}: AddTaskModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'manual' | 'suggestions'>('suggestions');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    categoryId: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    estimatedDuration: 0,
    recurring: true,
    recurringType: 'daily' as 'daily' | 'weekly' | 'monthly' | 'x_per_week' | 'x_per_month',
    recurringTarget: 1,
  });

  // Calculate automatic rewards based on difficulty and duration
  const calculatedRewards = useMemo(() => {
    if (!newTask.categoryId) {
      return null;
    }

    const primaryCategory = categories.find((c) => c.id === newTask.categoryId);
    if (!primaryCategory) return null;

    return calculateTaskRewards(
      newTask.difficulty,
      newTask.estimatedDuration,
      primaryCategory.primarySkill
    );
  }, [newTask.difficulty, newTask.estimatedDuration, newTask.categoryId, categories]);

  // Handle activity selection from suggestions
  const handleActivitySelect = useCallback(
    (activity: ActivityDefinition) => {
      // Find the category that matches the activity's skill
      const matchingCategory = categories.find((cat) => cat.primarySkill === activity.skill);

      if (matchingCategory) {
        setNewTask((prev) => ({
          ...prev,
          title: activity.name,
          description: activity.description,
          categoryId: matchingCategory.id,
          difficulty: activity.difficulty,
          estimatedDuration: activity.estimatedDuration,
          recurring: activity.isRecurring || false,
          recurringType: activity.recurringType || 'daily',
        }));

        // Switch to manual tab to show the filled form
        setActiveTab('manual');
      }
    },
    [categories]
  );

  const addTask = useCallback(async () => {
    if (!newTask.title.trim() || !newTask.categoryId || !calculatedRewards) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const result = await createTask({
        title: newTask.title,
        description: newTask.description,
        categories: [{ categoryId: newTask.categoryId, points: 0 }], // Mantener compatibilidad con backend
        difficulty: newTask.difficulty,
        skillRewards: calculatedRewards.skillRewards,
        coinReward: calculatedRewards.coinReward,
        estimatedDuration: newTask.estimatedDuration,
        recurring: newTask.recurring,
        recurringType: newTask.recurringType,
        recurringTarget: newTask.recurringTarget,
      });

      if (result.success) {
        const task = result.data;
        if (task) {
          onTaskCreated(task as PrismaTask);
        }

        // Resetear el formulario
        setNewTask({
          title: '',
          description: '',
          categoryId: '',
          difficulty: 'medium',
          estimatedDuration: 0,
          recurring: true,
          recurringType: 'daily',
          recurringTarget: 1,
        });

        onOpenChange(false);
      } else {
        setError(result.error || 'Error al crear la tarea');
      }
    } catch (error) {
      console.error('Error adding task:', error);
      setError('Error inesperado al crear la tarea');
    } finally {
      setIsSubmitting(false);
    }
  }, [newTask, calculatedRewards, onTaskCreated, onOpenChange]);

  const resetForm = () => {
    setNewTask({
      title: '',
      description: '',
      categoryId: '',
      difficulty: 'medium',
      estimatedDuration: 0,
      recurring: true,
      recurringType: 'daily',
      recurringTarget: 1,
    });
    setError(null);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <NeoDialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-display font-black text-gray-800 mb-4'>
            ✨ Agregar Nueva Tarea
          </DialogTitle>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as 'manual' | 'suggestions')}
        >
          <NeoTabsList className='grid w-full grid-cols-2'>
            <NeoTabsTrigger value='suggestions'>🎯 Sugerencias</NeoTabsTrigger>
            <NeoTabsTrigger value='manual'>✏️ Manual</NeoTabsTrigger>
          </NeoTabsList>

          <TabsContent value='suggestions' className='mt-4'>
            <ActivitySuggestions
              onSelectActivity={handleActivitySelect}
              selectedCategorySkill={
                categories.find((c) => c.id === newTask.categoryId)?.primarySkill
              }
            />
          </TabsContent>

          <TabsContent value='manual' className='mt-4'>
            <div className='space-y-4'>
              {/* Título */}
              <div>
                <Label
                  htmlFor='title'
                  className='block text-sm font-display font-bold text-gray-800 mb-2'
                >
                  📝 Título *
                </Label>
                <Input
                  id='title'
                  type='text'
                  variant='neo'
                  placeholder='Ej: Hacer ejercicio 30 minutos'
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </div>

              {/* Descripción */}
              <div>
                <Label
                  htmlFor='description'
                  className='block text-sm font-display font-bold text-gray-800 mb-2'
                >
                  📄 Descripción
                </Label>
                <Input
                  id='description'
                  type='text'
                  variant='neo'
                  placeholder='Descripción opcional de la tarea'
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
              </div>

              {/* Categoría */}
              <div>
                <Label className='block text-sm font-display font-bold text-gray-800 mb-2'>
                  🏷️ Categoría *
                </Label>
                <Select
                  value={newTask.categoryId}
                  onValueChange={(categoryId) => {
                    setNewTask((prev) => ({
                      ...prev,
                      categoryId,
                    }));
                  }}
                >
                  <NeoSelectTrigger>
                    <SelectValue placeholder='Seleccionar categoría' />
                  </NeoSelectTrigger>
                  <NeoSelectContent>
                    {categories.map((cat) => (
                      <NeoSelectItem key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </NeoSelectItem>
                    ))}
                  </NeoSelectContent>
                </Select>
              </div>

              {/* Dificultad */}
              <div>
                <Label
                  htmlFor='difficulty'
                  className='block text-sm font-display font-bold text-gray-800 mb-2'
                >
                  🎯 Dificultad
                </Label>
                <Select
                  value={newTask.difficulty}
                  onValueChange={(value) =>
                    setNewTask({
                      ...newTask,
                      difficulty: value as 'easy' | 'medium' | 'hard',
                    })
                  }
                >
                  <NeoSelectTrigger>
                    <SelectValue />
                  </NeoSelectTrigger>
                  <NeoSelectContent>
                    <NeoSelectItem value='easy'>🟢 Fácil</NeoSelectItem>
                    <NeoSelectItem value='medium'>🟡 Medio</NeoSelectItem>
                    <NeoSelectItem value='hard'>🔴 Difícil</NeoSelectItem>
                  </NeoSelectContent>
                </Select>
              </div>

              {/* Recurrencia y Duración */}
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label
                    htmlFor='recurringType'
                    className='block text-sm font-display font-bold text-gray-800 mb-2'
                  >
                    🔄 Recurrencia
                  </Label>
                  <Select
                    value={newTask.recurringType}
                    onValueChange={(value) =>
                      setNewTask({
                        ...newTask,
                        recurringType: value as
                          | 'daily'
                          | 'weekly'
                          | 'monthly'
                          | 'x_per_week'
                          | 'x_per_month',
                      })
                    }
                  >
                    <NeoSelectTrigger>
                      <SelectValue />
                    </NeoSelectTrigger>
                    <NeoSelectContent>
                      <NeoSelectItem value='daily'>📅 Diario</NeoSelectItem>
                      <NeoSelectItem value='weekly'>📆 Semanal</NeoSelectItem>
                      <NeoSelectItem value='monthly'>🗓️ Mensual</NeoSelectItem>
                      <NeoSelectItem value='x_per_week'>📊 X por semana</NeoSelectItem>
                      <NeoSelectItem value='x_per_month'>📈 X por mes</NeoSelectItem>
                    </NeoSelectContent>
                  </Select>
                </div>

                <div>
                  <Label
                    htmlFor='estimatedDuration'
                    className='block text-sm font-display font-bold text-gray-800 mb-2'
                  >
                    ⏱️ Duración (min)
                  </Label>
                  <Input
                    id='estimatedDuration'
                    type='number'
                    variant='neo'
                    placeholder='30'
                    value={newTask.estimatedDuration}
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        estimatedDuration: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>

              {/* Recompensas automáticas calculadas */}
              {calculatedRewards && (
                <div className='bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border-2 border-purple-200'>
                  <h4 className='font-display font-bold text-gray-800 mb-2 flex items-center gap-2'>
                    ✨ Recompensas Automáticas
                  </h4>
                  <div className='grid grid-cols-2 gap-3 text-sm'>
                    <div className='bg-white p-2 rounded border'>
                      <span className='font-medium text-purple-600'>🪙 Monedas:</span>
                      <span className='ml-1 font-bold'>{calculatedRewards.coinReward}</span>
                    </div>
                    <div className='bg-white p-2 rounded border'>
                      <span className='font-medium text-blue-600'>⚡ XP Total:</span>
                      <span className='ml-1 font-bold'>{calculatedRewards.totalXP}</span>
                    </div>
                  </div>
                  <div className='mt-2 text-xs text-gray-600'>
                    {formatXPBreakdown(calculatedRewards)}
                  </div>
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className='text-red-600 text-sm bg-red-50 p-3 rounded-lg'>{error}</div>
              )}

              {/* Botones de acción */}
              <div className='flex gap-3 pt-4 border-t-2 border-gray-300'>
                <Button
                  variant='neo-outline'
                  onClick={() => onOpenChange(false)}
                  className='flex-1 font-display font-bold'
                >
                  ❌ Cancelar
                </Button>
                <Button
                  variant='neo-success'
                  onClick={addTask}
                  disabled={!newTask.title.trim() || !newTask.categoryId || isSubmitting}
                  className='flex-1 font-display font-bold'
                >
                  {isSubmitting ? '🔄 Creando...' : '✨ Crear Tarea'}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </NeoDialogContent>
    </Dialog>
  );
}
