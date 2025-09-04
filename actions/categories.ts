'use server';

import { db } from '@/server/db/prisma';
import { revalidatePath } from 'next/cache';

export async function getCategories() {
  try {
    const categories = await db.taskCategory.findMany({
      orderBy: { name: 'asc' },
    });

    return { success: true, data: categories };
  } catch (error) {
    console.error('Error fetching task categories:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch task categories',
    };
  }
}

export async function createCategory(data: {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}) {
  try {
    if (!data.name || !data.name.trim()) {
      throw new Error('Category name is required');
    }

    const category = await db.taskCategory.create({
      data: {
        name: data.name.trim(),
        description: data.description?.trim() || '',
        color: data.color || 'bg-gray-500',
        icon: data.icon || '📁',
        primarySkill: 'mental', // Default skill (Mental/El Monje)
        subcategories: [],
      },
    });

    revalidatePath('/categories');
    revalidatePath('/tasks');

    return { success: true, data: category };
  } catch (error) {
    console.error('Error creating category:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create category',
    };
  }
}

export async function updateCategory(
  id: string,
  data: {
    name?: string;
    description?: string;
    color?: string;
    icon?: string;
  }
) {
  try {
    if (data.name && !data.name.trim()) {
      throw new Error('Category name cannot be empty');
    }

    const updateData: {
      name?: string;
      description?: string;
      color?: string;
      icon?: string;
    } = {};
    
    if (data.name !== undefined) updateData.name = data.name.trim();
    if (data.description !== undefined) updateData.description = data.description?.trim() || '';
    if (data.color !== undefined) updateData.color = data.color;
    if (data.icon !== undefined) updateData.icon = data.icon;

    const category = await db.taskCategory.update({
      where: { id },
      data: updateData,
    });

    revalidatePath('/categories');
    revalidatePath('/tasks');

    return { success: true, data: category };
  } catch (error) {
    console.error('Error updating category:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update category',
    };
  }
}

export async function deleteCategory(id: string) {
  try {
    // Verificar si hay tareas usando esta categoría
    const tasksWithCategory = await db.task.findFirst({
      where: { categoryId: id },
    });

    if (tasksWithCategory) {
      throw new Error('Cannot delete category that has associated tasks');
    }

    await db.taskCategory.delete({
      where: { id },
    });

    revalidatePath('/categories');
    revalidatePath('/tasks');

    return { success: true };
  } catch (error) {
    console.error('Error deleting category:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete category',
    };
  }
}
