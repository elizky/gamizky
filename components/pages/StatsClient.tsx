'use client';

import { useState, useMemo } from 'react';

interface StatsData {
  overview: {
    totalTasks: number;
    completedTasks: number;
    completionRate: number;
    totalUserChallenges: number;
    completedChallenges: number;
    totalPurchases: number;
    totalSpent: number;
  };
  tasksByCategory: Array<{
    categoryName: string;
    categoryIcon: string;
    primarySkill: string;
    total: number;
    completed: number;
    totalCoins: number;
    completionRate: number;
  }>;
  tasksLast30Days: Array<{
    completedAt: Date | null;
    coinReward: number;
    category: {
      name: string;
      primarySkill: string;
    };
  }>;
  skills: Array<{
    id: string;
    skillType: string;
    level: number;
    currentXP: number;
    totalXP: number;
    xpToNextLevel: number;
  }>;
}

interface StatsClientProps {
  user: {
    id: string;
    name: string | null;
    level: number;
    totalXP: number;
    coins: number;
    streak: number;
    avatar: string;
  };
  statsData: StatsData;
}

// Componente de gráfico circular simple
const CircularProgress = ({ percentage, size = 120, strokeWidth = 8, color = '#3B82F6' }: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-in-out"
        />
      </svg>
      <span className="absolute text-xl font-bold text-gray-700">
        {percentage}%
      </span>
    </div>
  );
};

// Componente de barra de progreso
const ProgressBar = ({ value, max, color = '#3B82F6', height = 8, showLabel = true }: {
  value: number;
  max: number;
  color?: string;
  height?: number;
  showLabel?: boolean;
}) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;

  return (
    <div className="w-full">
      <div className={`w-full bg-gray-200 rounded-full`} style={{ height }}>
        <div
          className="rounded-full transition-all duration-500 ease-in-out"
          style={{
            width: `${Math.min(percentage, 100)}%`,
            height,
            backgroundColor: color
          }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{value}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  );
};

// Componente de gráfico de líneas simple
const LineChart = ({ data, height = 200 }: {
  data: Array<{ date: string; value: number }>;
  height?: number;
}) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const width = 600;
  const padding = 40;

  const points = data.map((d, i) => {
    const x = padding + (i * (width - padding * 2)) / (data.length - 1);
    const y = height - padding - ((d.value / maxValue) * (height - padding * 2));
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full overflow-x-auto">
      <svg width={width} height={height} className="min-w-full">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((percent, i) => (
          <line
            key={i}
            x1={padding}
            y1={height - padding - (percent * (height - padding * 2))}
            x2={width - padding}
            y2={height - padding - (percent * (height - padding * 2))}
            stroke="#E5E7EB"
            strokeWidth="1"
          />
        ))}
        
        {/* Line */}
        <polyline
          fill="none"
          stroke="#3B82F6"
          strokeWidth="3"
          points={points}
          className="transition-all duration-500"
        />
        
        {/* Points */}
        {data.map((d, i) => {
          const x = padding + (i * (width - padding * 2)) / (data.length - 1);
          const y = height - padding - ((d.value / maxValue) * (height - padding * 2));
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="4"
              fill="#3B82F6"
              className="transition-all duration-500"
            />
          );
        })}
      </svg>
    </div>
  );
};

export default function StatsClient({ user, statsData }: StatsClientProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'activity'>('overview');

  // Preparar datos para el gráfico de actividad de los últimos 7 días
  const last7DaysActivity = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayTasks = statsData.tasksLast30Days.filter(task => {
        if (!task.completedAt) return false;
        const taskDate = new Date(task.completedAt);
        return taskDate.toDateString() === date.toDateString();
      });
      
      days.push({
        date: date.toLocaleDateString('es-ES', { weekday: 'short' }),
        value: dayTasks.length,
        coins: dayTasks.reduce((sum, task) => sum + task.coinReward, 0)
      });
    }
    return days;
  }, [statsData.tasksLast30Days]);

  const getSkillColor = (skillType: string) => {
    const colors = {
      physical: '#EF4444',
      wisdom: '#3B82F6',
      mental: '#8B5CF6',
      social: '#10B981',
      creativity: '#F59E0B',
      discipline: '#6B7280'
    };
    return colors[skillType as keyof typeof colors] || '#6B7280';
  };

  const getSkillIcon = (skillType: string) => {
    const icons = {
      physical: '💪',
      wisdom: '📚',
      mental: '🧠',
      social: '👥',
      creativity: '🎨',
      discipline: '🎯'
    };
    return icons[skillType as keyof typeof icons] || '📈';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">📊 Estadísticas</h1>
          <p className="text-gray-600">
            Analiza tu progreso y rendimiento en detalle
          </p>
        </div>

        {/* Tabs */}
        <div className="flex mb-6 bg-white rounded-lg p-1 shadow">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-3 px-6 rounded-md font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            📈 Resumen General
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`flex-1 py-3 px-6 rounded-md font-medium transition-colors ${
              activeTab === 'skills'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            🎯 Habilidades
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`flex-1 py-3 px-6 rounded-md font-medium transition-colors ${
              activeTab === 'activity'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            📅 Actividad
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPIs principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className="mb-4">
                  <CircularProgress 
                    percentage={statsData.overview.completionRate} 
                    color="#10B981"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Tasa de Completitud</h3>
                <p className="text-gray-600 text-sm">
                  {statsData.overview.completedTasks} de {statsData.overview.totalTasks} tareas
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">🏆</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {statsData.overview.completedChallenges}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Challenges Completados</h3>
                <p className="text-gray-600 text-sm">
                  {statsData.overview.totalUserChallenges} challenges activos
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">🪙</span>
                  <span className="text-2xl font-bold text-yellow-600">
                    {user.coins.toLocaleString()}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Monedas Actuales</h3>
                <p className="text-gray-600 text-sm">
                  {statsData.overview.totalSpent.toLocaleString()} gastadas
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">⭐</span>
                  <span className="text-2xl font-bold text-purple-600">
                    {user.level}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Nivel Actual</h3>
                <p className="text-gray-600 text-sm">
                  {user.totalXP.toLocaleString()} XP total
                </p>
              </div>
            </div>

            {/* Estadísticas por categoría */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">📊 Rendimiento por Categoría</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {statsData.tasksByCategory.map((category, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{category.categoryIcon}</span>
                        <span className="font-medium text-gray-800">{category.categoryName}</span>
                      </div>
                      <span className="text-sm font-medium text-blue-600">
                        {category.completionRate}%
                      </span>
                    </div>
                    <ProgressBar 
                      value={category.completed}
                      max={category.total}
                      color={getSkillColor(category.primarySkill)}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>{category.totalCoins} 🪙 ganadas</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">🎯 Progreso de Habilidades</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {statsData.skills.map((skill) => (
                <div key={skill.id} className="p-6 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{getSkillIcon(skill.skillType)}</span>
                      <div>
                        <h3 className="font-semibold text-gray-800 capitalize">
                          {skill.skillType === 'physical' ? 'Físico' :
                           skill.skillType === 'wisdom' ? 'Sabiduría' :
                           skill.skillType === 'mental' ? 'Mental' :
                           skill.skillType === 'social' ? 'Social' :
                           skill.skillType === 'creativity' ? 'Creatividad' :
                           'Disciplina'}
                        </h3>
                        <p className="text-sm text-gray-600">Nivel {skill.level}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-800">{skill.totalXP}</div>
                      <div className="text-xs text-gray-500">XP Total</div>
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progreso al siguiente nivel</span>
                      <span>{skill.currentXP} / {skill.level * 200}</span>
                    </div>
                    <ProgressBar 
                      value={skill.currentXP}
                      max={skill.level * 200}
                      color={getSkillColor(skill.skillType)}
                      showLabel={false}
                    />
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    {skill.xpToNextLevel} XP para nivel {skill.level + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="space-y-6">
            {/* Gráfico de actividad de los últimos 7 días */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">📅 Actividad de los Últimos 7 Días</h2>
              <LineChart data={last7DaysActivity} />
              
              <div className="grid grid-cols-7 gap-2 mt-4">
                {last7DaysActivity.map((day, index) => (
                  <div key={index} className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-xs text-gray-600 mb-1">{day.date}</div>
                    <div className="font-semibold text-blue-600">{day.value}</div>
                    <div className="text-xs text-yellow-600">{day.coins}🪙</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actividad reciente */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">🕐 Actividad Reciente</h2>
              <div className="space-y-3">
                {statsData.tasksLast30Days.slice(0, 10).map((task, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-green-500">✅</span>
                      <div>
                        <div className="font-medium text-gray-800">{task.category.name}</div>
                        <div className="text-sm text-gray-600">
                          {task.completedAt ? new Date(task.completedAt).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'Fecha no disponible'}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-yellow-600">
                      +{task.coinReward} 🪙
                    </div>
                  </div>
                ))}
                
                {statsData.tasksLast30Days.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No hay actividad reciente. ¡Empieza completando algunas tareas!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
