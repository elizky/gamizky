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
      <NeoDialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-display font-black text-gray-800 mb-4'>
            ✨ Agregar Nueva Tarea
          </DialogTitle>
        </DialogHeader>

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
                  <NeoSelectItem value='daily'>📅 Diaria</NeoSelectItem>
                  <NeoSelectItem value='weekly'>📆 Semanal</NeoSelectItem>
                  <NeoSelectItem value='monthly'>🗓️ Mensual</NeoSelectItem>
                  <NeoSelectItem value='x_per_week'>💪 X veces por semana</NeoSelectItem>
                  <NeoSelectItem value='x_per_month'>🎯 X veces por mes</NeoSelectItem>
                </NeoSelectContent>
              </Select>
            </div>

            {/* Campo condicional para target de recurrencia */}
            {(newTask.recurringType === 'x_per_week' ||
              newTask.recurringType === 'x_per_month') && (
              <div>
                <Label
                  htmlFor='recurringTarget'
                  className='text-sm font-display font-bold text-gray-800 mb-2'
                >
                  🎯 ¿Cuántas veces?
                </Label>
                <Input
                  id='recurringTarget'
                  type='number'
                  variant='neo'
                  min='1'
                  max='30'
                  placeholder='3'
                  value={newTask.recurringTarget}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      recurringTarget: parseInt(e.target.value) || 1,
                    })
                  }
                />
              </div>
            )}

            <div>
              <Label
                htmlFor='duration'
                className='text-sm font-display font-bold text-gray-800 mb-2'
              >
                ⏱️ Duración
              </Label>
              <Input
                id='duration'
                type='number'
                variant='neo'
                min='0'
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
          {error && <div className='text-red-600 text-sm bg-red-50 p-3 rounded-lg'>{error}</div>}

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
      </NeoDialogContent>
    </Dialog>
  );
}
