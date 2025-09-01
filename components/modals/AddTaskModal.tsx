'use client';

import { useState, useCallback } from 'react';
import { createTask } from '../../actions';
import type { PrismaTask, PrismaTaskCategory } from "@/lib/types";
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

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
  onTaskCreated 
}: AddTaskModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    categories: [{ categoryId: '', points: 50 }] as Array<{ categoryId: string; points: number }>,
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    skillRewards: {} as Record<string, number>,
    estimatedDuration: 0,
    recurring: true,
    recurringType: 'daily' as 'daily' | 'weekly' | 'monthly',
  });

  const addTask = useCallback(async () => {
    if (!newTask.title.trim() || !newTask.categories.some((cat) => cat.categoryId)) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const skillRewards: Record<string, number> = {};
      const coinReward = 25; // Moneda base por tarea

      // Construir skillRewards basado en todas las categorías seleccionadas
      newTask.categories.forEach((cat) => {
        if (cat.categoryId) {
          const category = categories.find((c) => c.id === cat.categoryId);
          if (category) {
            // Si ya existe la habilidad, sumar los puntos
            if (skillRewards[category.primarySkill]) {
              skillRewards[category.primarySkill] += cat.points;
            } else {
              skillRewards[category.primarySkill] = cat.points;
            }
          }
        }
      });

      const result = await createTask({
        ...newTask,
        skillRewards,
        coinReward,
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
          categories: [{ categoryId: '', points: 50 }],
          difficulty: 'medium',
          skillRewards: {},
          estimatedDuration: 0,
          recurring: true,
          recurringType: 'daily',
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
  }, [newTask, categories, onTaskCreated, onOpenChange]);

  const resetForm = () => {
    setNewTask({
      title: '',
      description: '',
      categories: [{ categoryId: '', points: 50 }],
      difficulty: 'medium',
      skillRewards: {},
      estimatedDuration: 0,
      recurring: true,
      recurringType: 'daily',
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
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Agregar Nueva Tarea</DialogTitle>
        </DialogHeader>

        <div className='space-y-4'>
          {/* Título */}
          <div>
            <Label htmlFor="title" className='block text-sm font-medium mb-2'>Título *</Label>
            <Input
              id="title"
              type='text'
              placeholder='Ej: Hacer ejercicio 30 minutos'
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
          </div>

          {/* Descripción */}
          <div>
            <Label htmlFor="description" className='block text-sm font-medium mb-2'>
              Descripción
            </Label>
            <Input
              id="description"
              type='text'
              placeholder='Descripción opcional de la tarea'
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
          </div>

          {/* Categorías y Puntos */}
          <div className='space-y-3'>
            {newTask.categories.map((cat, index) => (
              <div key={index} className='grid grid-cols-2 gap-4'>
                <div>
                  <Label className='block text-sm font-medium mb-1'>
                    Categoría {index + 1} *
                  </Label>
                  <Select
                    value={cat.categoryId}
                    onValueChange={(categoryId) => {
                      setNewTask((prev) => ({
                        ...prev,
                        categories: prev.categories.map((c, i) =>
                          i === index ? { ...c, categoryId } : c
                        ),
                      }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.icon} {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className='flex gap-2'>
                  <div className='flex-1'>
                    <Label className='block text-sm font-medium mb-1'>
                      Puntos
                    </Label>
                    <Input
                      type='number'
                      min='0'
                      placeholder='50'
                      value={cat.points}
                      onChange={(e) => {
                        setNewTask((prev) => ({
                          ...prev,
                          categories: prev.categories.map((c, i) =>
                            i === index ? { ...c, points: parseInt(e.target.value) || 0 } : c
                          ),
                        }));
                      }}
                    />
                  </div>

                  {/* Botón para remover categoría (solo si hay más de una) */}
                  {newTask.categories.length > 1 && (
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => {
                        setNewTask((prev) => ({
                          ...prev,
                          categories: prev.categories.filter((_, i) => i !== index),
                        }));
                      }}
                      className='mt-6 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50'
                      title='Remover categoría'
                    >
                      ✕
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {/* Botón para agregar más categorías */}
            <div className='text-center'>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setNewTask((prev) => ({
                    ...prev,
                    categories: [...prev.categories, { categoryId: '', points: 50 }],
                  }));
                }}
                className='text-blue-600 hover:text-blue-700'
              >
                + agregar categoría
              </Button>
            </div>
          </div>

          {/* Dificultad */}
          <div>
            <Label htmlFor="difficulty" className='block text-sm font-medium mb-2'>Dificultad</Label>
            <Select
              value={newTask.difficulty}
              onValueChange={(value) =>
                setNewTask({
                  ...newTask,
                  difficulty: value as 'easy' | 'medium' | 'hard',
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='easy'>🟢 Fácil</SelectItem>
                <SelectItem value='medium'>🟡 Medio</SelectItem>
                <SelectItem value='hard'>🔴 Difícil</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Recurrencia y Duración */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label htmlFor="recurringType" className='block text-sm font-medium mb-2'>
                Recurrencia
              </Label>
              <Select
                value={newTask.recurringType}
                onValueChange={(value) =>
                  setNewTask({
                    ...newTask,
                    recurringType: value as 'daily' | 'weekly' | 'monthly',
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='daily'>📅 Diaria</SelectItem>
                  <SelectItem value='weekly'>📆 Semanal</SelectItem>
                  <SelectItem value='monthly'>🗓️ Mensual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="duration" className='block text-sm font-medium mb-2'>Duración</Label>
              <Input
                id="duration"
                type='number'
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

          {/* Error message */}
          {error && (
            <div className='text-red-600 text-sm bg-red-50 p-3 rounded-lg'>
              {error}
            </div>
          )}

          {/* Botones de acción */}
          <div className='flex gap-3 pt-4 border-t'>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className='flex-1'
            >
              Cancelar
            </Button>
            <Button
              onClick={addTask}
              disabled={
                !newTask.title.trim() ||
                !newTask.categories.some((cat) => cat.categoryId) ||
                isSubmitting
              }
              className='flex-1'
            >
              {isSubmitting ? 'Creando...' : 'Crear Tarea'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
