'use client';

import { useState, useMemo } from 'react';
import { PREDEFINED_ACTIVITIES, type ActivityDefinition } from '@/lib/activities';
import { SKILL_DEFINITIONS } from '@/lib/constants';
import { calculateTaskRewards } from '@/lib/gamification';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, NeoTabsList, NeoTabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Clock, Star, Zap } from 'lucide-react';

interface ActivitySuggestionsProps {
  onSelectActivity: (activity: ActivityDefinition) => void;
  selectedCategorySkill?: string;
}

export default function ActivitySuggestions({
  onSelectActivity,
  selectedCategorySkill,
}: ActivitySuggestionsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<string>('all');

  // Filtrar actividades basadas en búsqueda y categoría seleccionada
  const filteredActivities = useMemo(() => {
    let activities = PREDEFINED_ACTIVITIES;

    // Filtrar por habilidad de categoría seleccionada si existe
    if (selectedCategorySkill) {
      activities = activities.filter((activity) => activity.skill === selectedCategorySkill);
    }

    // Filtrar por habilidad seleccionada en tabs
    if (selectedSkill !== 'all') {
      activities = activities.filter((activity) => activity.skill === selectedSkill);
    }

    // Filtrar por búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      activities = activities.filter(
        (activity) =>
          activity.name.toLowerCase().includes(query) ||
          activity.description.toLowerCase().includes(query) ||
          activity.subcategory.toLowerCase().includes(query)
      );
    }

    return activities;
  }, [searchQuery, selectedSkill, selectedCategorySkill]);

  // Agrupar actividades por habilidad
  const activitiesBySkill = useMemo(() => {
    const grouped: Record<string, ActivityDefinition[]> = {};

    filteredActivities.forEach((activity) => {
      if (!grouped[activity.skill]) {
        grouped[activity.skill] = [];
      }
      grouped[activity.skill].push(activity);
    });

    return grouped;
  }, [filteredActivities]);

  // Calcular recompensas para una actividad
  const getActivityRewards = (activity: ActivityDefinition) => {
    return calculateTaskRewards(activity.difficulty, activity.estimatedDuration, activity.skill);
  };

  // Obtener color de dificultad
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'hard':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Obtener emoji de dificultad
  const getDifficultyEmoji = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '🟢';
      case 'medium':
        return '🟡';
      case 'hard':
        return '🔴';
      default:
        return '⚪';
    }
  };

  return (
    <div className='space-y-4'>
      {/* Barra de búsqueda */}
      <div className='relative'>
        <Input
          placeholder='Buscar actividades...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='pl-10'
        />
      </div>

      {/* Tabs por habilidad */}
      <Tabs value={selectedSkill} onValueChange={setSelectedSkill}>
        <NeoTabsList className='grid w-full grid-cols-6'>
          <NeoTabsTrigger value='all'>Todas</NeoTabsTrigger>
          {Object.entries(SKILL_DEFINITIONS).map(([skillKey, skillDef]) => (
            <NeoTabsTrigger key={skillKey} value={skillKey} className='flex items-center gap-1'>
              <span>{skillDef.icon}</span>
              <span className='hidden sm:inline'>{skillDef.name}</span>
            </NeoTabsTrigger>
          ))}
        </NeoTabsList>

        {/* Contenido de actividades */}
        <div className='mt-4'>
          {selectedSkill === 'all' ? (
            // Mostrar todas las habilidades
            Object.entries(activitiesBySkill).map(([skillKey, activities]) => {
              const skillDef = SKILL_DEFINITIONS[skillKey as keyof typeof SKILL_DEFINITIONS];
              return (
                <div key={skillKey} className='mb-6'>
                  <div className='flex items-center gap-2 mb-3'>
                    <span className='text-2xl'>{skillDef.icon}</span>
                    <h3 className='text-lg font-semibold'>{skillDef.name}</h3>
                    <Badge variant='secondary'>{activities.length} actividades</Badge>
                  </div>
                  <div className='grid gap-3 md:grid-cols-2'>
                    {activities.map((activity) => {
                      const rewards = getActivityRewards(activity);
                      return (
                        <Card
                          key={activity.id}
                          className='cursor-pointer hover:shadow-md transition-shadow'
                        >
                          <CardHeader className='pb-2'>
                            <div className='flex items-start justify-between'>
                              <div className='flex-1'>
                                <CardTitle className='text-sm font-medium line-clamp-2'>
                                  {activity.name}
                                </CardTitle>
                                <CardDescription className='text-xs mt-1'>
                                  {activity.description}
                                </CardDescription>
                              </div>
                              <div className='flex flex-col items-end gap-1 ml-2'>
                                <Badge
                                  variant='outline'
                                  className={`text-xs ${getDifficultyColor(
                                    activity.difficulty
                                  )} text-white`}
                                >
                                  {getDifficultyEmoji(activity.difficulty)} {activity.difficulty}
                                </Badge>
                                {activity.isRecurring && (
                                  <Badge variant='secondary' className='text-xs'>
                                    🔄 {activity.recurringType}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className='pt-0'>
                            <div className='flex items-center justify-between text-xs text-gray-600 mb-2'>
                              <div className='flex items-center gap-1'>
                                <Clock className='h-3 w-3' />
                                {activity.estimatedDuration} min
                              </div>
                              <div className='flex items-center gap-1'>
                                <Zap className='h-3 w-3' />
                                {rewards.totalXP} XP
                              </div>
                              <div className='flex items-center gap-1'>
                                <Star className='h-3 w-3' />
                                {rewards.coinReward} coins
                              </div>
                            </div>
                            <div className='flex items-center justify-between'>
                              <Badge variant='outline' className='text-xs'>
                                {activity.subcategory}
                              </Badge>
                              <Button
                                size='sm'
                                onClick={() => onSelectActivity(activity)}
                                className='text-xs'
                              >
                                Usar
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            })
          ) : (
            // Mostrar solo la habilidad seleccionada
            <div>
              {activitiesBySkill[selectedSkill]?.length > 0 ? (
                <div className='grid gap-3 md:grid-cols-2'>
                  {activitiesBySkill[selectedSkill].map((activity) => {
                    const rewards = getActivityRewards(activity);
                    return (
                      <Card
                        key={activity.id}
                        className='cursor-pointer hover:shadow-md transition-shadow'
                      >
                        <CardHeader className='pb-2'>
                          <div className='flex items-start justify-between'>
                            <div className='flex-1'>
                              <CardTitle className='text-sm font-medium line-clamp-2'>
                                {activity.name}
                              </CardTitle>
                              <CardDescription className='text-xs mt-1'>
                                {activity.description}
                              </CardDescription>
                            </div>
                            <div className='flex flex-col items-end gap-1 ml-2'>
                              <Badge
                                variant='outline'
                                className={`text-xs ${getDifficultyColor(
                                  activity.difficulty
                                )} text-white`}
                              >
                                {getDifficultyEmoji(activity.difficulty)} {activity.difficulty}
                              </Badge>
                              {activity.isRecurring && (
                                <Badge variant='secondary' className='text-xs'>
                                  🔄 {activity.recurringType}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className='pt-0'>
                          <div className='flex items-center justify-between text-xs text-gray-600 mb-2'>
                            <div className='flex items-center gap-1'>
                              <Clock className='h-3 w-3' />
                              {activity.estimatedDuration} min
                            </div>
                            <div className='flex items-center gap-1'>
                              <Zap className='h-3 w-3' />
                              {rewards.totalXP} XP
                            </div>
                            <div className='flex items-center gap-1'>
                              <Star className='h-3 w-3' />
                              {rewards.coinReward} coins
                            </div>
                          </div>
                          <div className='flex items-center justify-between'>
                            <Badge variant='outline' className='text-xs'>
                              {activity.subcategory}
                            </Badge>
                            <Button
                              size='sm'
                              onClick={() => onSelectActivity(activity)}
                              className='text-xs'
                            >
                              Usar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className='text-center py-8 text-gray-500'>
                  <p>No se encontraron actividades para esta habilidad.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </Tabs>

      {filteredActivities.length === 0 && searchQuery && (
        <div className='text-center py-8 text-gray-500'>
          <p>No se encontraron actividades que coincidan con &quot;{searchQuery}&quot;.</p>
        </div>
      )}
    </div>
  );
}
