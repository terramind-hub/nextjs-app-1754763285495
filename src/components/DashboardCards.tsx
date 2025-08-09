'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { dashboardMetrics, getActiveGoals, getTotalCaloriesBurned, getAverageWorkoutDuration, getWorkoutFrequency } from '@/lib/data';
import { formatNumber, formatDuration } from '@/lib/utils';
import { Activity, Target, Flame, Clock, TrendingUp, Calendar } from 'lucide-react';

export default function DashboardCards() {
  const metrics = dashboardMetrics;
  const activeGoals = getActiveGoals();
  const totalCalories = getTotalCaloriesBurned();
  const avgDuration = getAverageWorkoutDuration();
  const workoutFreq = getWorkoutFrequency();

  const cards = [
    {
      title: 'Total Workouts',
      value: formatNumber(metrics.totalWorkouts),
      description: 'Completed this month',
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Calories Burned',
      value: formatNumber(totalCalories),
      description: 'Total calories this week',
      icon: Flame,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Average Duration',
      value: formatDuration(avgDuration),
      description: 'Per workout session',
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Workout Frequency',
      value: `${workoutFreq}/week`,
      description: 'Current weekly average',
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Current Streak',
      value: `${metrics.currentStreak} days`,
      description: 'Keep it up!',
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Active Goals',
      value: formatNumber(activeGoals.length),
      description: 'Goals in progress',
      icon: Target,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Goals Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-red-600" />
              Active Goals Progress
            </CardTitle>
            <CardDescription>
              Track your fitness goals and achievements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeGoals.slice(0, 3).map((goal) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{goal.title}</span>
                    <Badge variant="outline" className="text-xs">
                      {goal.category}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {goal.currentValue}/{goal.targetValue} {goal.unit}
                  </span>
                </div>
                <Progress 
                  value={(goal.currentValue / goal.targetValue) * 100} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground">
                  {Math.round((goal.currentValue / goal.targetValue) * 100)}% complete
                </p>
              </div>
            ))}
            {activeGoals.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No active goals. Set some goals to track your progress!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Weekly Summary
            </CardTitle>
            <CardDescription>
              Your fitness activity this week
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Workouts</p>
                <p className="text-2xl font-bold text-blue-600">{metrics.weeklyWorkouts}</p>
                <p className="text-xs text-muted-foreground">This week</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Total Time</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatDuration(metrics.weeklyDuration)}
                </p>
                <p className="text-xs text-muted-foreground">Exercise time</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Weekly Goal Progress</span>
                <span>{Math.round((metrics.weeklyWorkouts / 5) * 100)}%</span>
              </div>
              <Progress value={(metrics.weeklyWorkouts / 5) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Target: 5 workouts per week
              </p>
            </div>

            <div className="pt-2 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Personal Best</span>
                <Badge variant="secondary" className="text-xs">
                  {metrics.personalBest}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}