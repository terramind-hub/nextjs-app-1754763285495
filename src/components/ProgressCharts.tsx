'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { progressData, workoutsData, goalsData } from '@/lib/data';
import { formatDate, formatNumber, getWeekStart, getMonthStart } from '@/lib/utils';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar, Target, Activity, Flame, Clock, Award, BarChart3 } from 'lucide-react';

interface ProgressChartsProps {
  className?: string;
}

interface ChartDataPoint {
  date: string;
  weight?: number;
  bodyFat?: number;
  muscle?: number;
  workouts?: number;
  calories?: number;
  duration?: number;
  [key: string]: any;
}

interface WorkoutTypeData {
  name: string;
  value: number;
  color: string;
}

export default function ProgressCharts({ className }: ProgressChartsProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedMetric, setSelectedMetric] = useState<'weight' | 'bodyFat' | 'muscle'>('weight');

  // Process progress data for charts
  const chartData = useMemo(() => {
    const now = new Date();
    let startDate: Date;

    switch (timeRange) {
      case 'week':
        startDate = getWeekStart(now);
        break;
      case 'month':
        startDate = getMonthStart(now);
        break;
      case 'quarter':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
        break;
      default:
        startDate = getMonthStart(now);
    }

    // Filter progress data by time range
    const filteredProgress = progressData.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= startDate && entryDate <= now;
    });

    // Sort by date
    return filteredProgress.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [timeRange]);

  // Process workout data for activity charts
  const workoutChartData = useMemo(() => {
    const now = new Date();
    let startDate: Date;

    switch (timeRange) {
      case 'week':
        startDate = getWeekStart(now);
        break;
      case 'month':
        startDate = getMonthStart(now);
        break;
      case 'quarter':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
        break;
      default:
        startDate = getMonthStart(now);
    }

    // Group workouts by date
    const workoutsByDate: { [key: string]: { count: number; calories: number; duration: number } } = {};

    workoutsData.forEach(workout => {
      const workoutDate = new Date(workout.date);
      if (workoutDate >= startDate && workoutDate <= now) {
        const dateKey = formatDate(workoutDate);
        if (!workoutsByDate[dateKey]) {
          workoutsByDate[dateKey] = { count: 0, calories: 0, duration: 0 };
        }
        workoutsByDate[dateKey].count += 1;
        workoutsByDate[dateKey].calories += workout.caloriesBurned;
        workoutsByDate[dateKey].duration += workout.duration;
      }
    });

    // Convert to array and sort
    return Object.entries(workoutsByDate)
      .map(([date, data]) => ({
        date,
        workouts: data.count,
        calories: data.calories,
        duration: Math.round(data.duration / 60) // Convert to minutes
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [timeRange]);

  // Process workout type distribution
  const workoutTypeData = useMemo(() => {
    const typeCount: { [key: string]: number } = {};
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

    workoutsData.forEach(workout => {
      workout.exercises.forEach(exercise => {
        typeCount[exercise.category] = (typeCount[exercise.category] || 0) + 1;
      });
    });

    return Object.entries(typeCount)
      .map(([name, value], index) => ({
        name,
        value,
        color: colors[index % colors.length]
      }))
      .sort((a, b) => b.value - a.value);
  }, []);

  // Calculate progress statistics
  const progressStats = useMemo(() => {
    if (chartData.length < 2) return null;

    const latest = chartData[chartData.length - 1];
    const previous = chartData[chartData.length - 2];

    const weightChange = latest.weight - previous.weight;
    const bodyFatChange = latest.bodyFat - previous.bodyFat;
    const muscleChange = latest.muscle - previous.muscle;

    return {
      weight: {
        current: latest.weight,
        change: weightChange,
        trend: weightChange > 0 ? 'up' : weightChange < 0 ? 'down' : 'stable'
      },
      bodyFat: {
        current: latest.bodyFat,
        change: bodyFatChange,
        trend: bodyFatChange > 0 ? 'up' : bodyFatChange < 0 ? 'down' : 'stable'
      },
      muscle: {
        current: latest.muscle,
        change: muscleChange,
        trend: muscleChange > 0 ? 'up' : muscleChange < 0 ? 'down' : 'stable'
      }
    };
  }, [chartData]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default:
        return <TrendingUp className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatChange = (change: number, unit: string = '') => {
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}${unit}`;
  };

  return (
    <div className={className}>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">Last 3 Months</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Progress Statistics Cards */}
      {progressStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weight</CardTitle>
              {getTrendIcon(progressStats.weight.trend)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progressStats.weight.current} kg</div>
              <p className="text-xs text-muted-foreground">
                {formatChange(progressStats.weight.change, ' kg')} from last entry
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Body Fat</CardTitle>
              {getTrendIcon(progressStats.bodyFat.trend)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progressStats.bodyFat.current}%</div>
              <p className="text-xs text-muted-foreground">
                {formatChange(progressStats.bodyFat.change, '%')} from last entry
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Muscle Mass</CardTitle>
              {getTrendIcon(progressStats.muscle.trend)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progressStats.muscle.current} kg</div>
              <p className="text-xs text-muted-foreground">
                {formatChange(progressStats.muscle.change, ' kg')} from last entry
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="body-metrics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="body-metrics">Body Metrics</TabsTrigger>
          <TabsTrigger value="workout-activity">Workout Activity</TabsTrigger>
          <TabsTrigger value="workout-types">Workout Types</TabsTrigger>
        </TabsList>

        {/* Body Metrics Tab */}
        <TabsContent value="body-metrics" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Body Composition Progress
                  </CardTitle>
                  <CardDescription>
                    Track your weight, body fat, and muscle mass over time
                  </CardDescription>
                </div>
                <Select value={selectedMetric} onValueChange={(value: any) => setSelectedMetric(value)}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weight">Weight</SelectItem>
                    <SelectItem value="bodyFat">Body Fat</SelectItem>
                    <SelectItem value="muscle">Muscle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => formatDate(new Date(value))}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      labelFormatter={(value) => formatDate(new Date(value))}
                      formatter={(value: any, name: string) => [
                        `${value}${name === 'bodyFat' ? '%' : ' kg'}`,
                        name === 'bodyFat' ? 'Body Fat' : name === 'muscle' ? 'Muscle Mass' : 'Weight'
                      ]}
                    />
                    <Legend />
                    {selectedMetric === 'weight' && (
                      <Line 
                        type="monotone" 
                        dataKey="weight" 
                        stroke="#8884d8" 
                        strokeWidth={2}
                        dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                        name="Weight (kg)"
                      />
                    )}
                    {selectedMetric === 'bodyFat' && (
                      <Line 
                        type="monotone" 
                        dataKey="bodyFat" 
                        stroke="#ff7c7c" 
                        strokeWidth={2}
                        dot={{ fill: '#ff7c7c', strokeWidth: 2, r: 4 }}
                        name="Body Fat (%)"
                      />
                    )}
                    {selectedMetric === 'muscle' && (
                      <Line 
                        type="monotone" 
                        dataKey="muscle" 
                        stroke="#82ca9d" 
                        strokeWidth={2}
                        dot={{ fill: '#82ca9d', strokeWidth: 2, r: 4 }}
                        name="Muscle Mass (kg)"
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workout Activity Tab */}
        <TabsContent value="workout-activity" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Workout Frequency
                </CardTitle>
                <CardDescription>
                  Number of workouts completed over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={workoutChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => formatDate(new Date(value))}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip 
                        labelFormatter={(value) => formatDate(new Date(value))}
                        formatter={(value: any) => [value, 'Workouts']}
                      />
                      <Bar dataKey="workouts" fill="#8884d8" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5" />
                  Calories Burned
                </CardTitle>
                <CardDescription>
                  Daily calories burned through workouts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={workoutChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => formatDate(new Date(value))}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip 
                        labelFormatter={(value) => formatDate(new Date(value))}
                        formatter={(value: any) => [formatNumber(value), 'Calories']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="calories" 
                        stroke="#ff7c7c" 
                        fill="#ff7c7c" 
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Workout Duration
              </CardTitle>
              <CardDescription>
                Time spent working out each day (in minutes)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={workoutChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => formatDate(new Date(value))}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      labelFormatter={(value) => formatDate(new Date(value))}
                      formatter={(value: any) => [`${value} min`, 'Duration']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="duration" 
                      stroke="#82ca9d" 
                      strokeWidth={2}
                      dot={{ fill: '#82ca9d', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workout Types Tab */}
        <TabsContent value="workout-types" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Exercise Distribution
                </CardTitle>
                <CardDescription>
                  Breakdown of exercise types in your workouts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={workoutTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {workoutTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => [value, 'Exercises']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Exercise Type Summary
                </CardTitle>
                <CardDescription>
                  Detailed breakdown of your exercise preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workoutTypeData.map((type, index) => (
                    <div key={type.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: type.color }}
                        />
                        <span className="font-medium">{type.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {type.value} exercises
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {((type.value / workoutTypeData.reduce((sum, t) => sum + t.value, 0)) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}