'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import WorkoutForm from '@/components/WorkoutForm';
import { workoutsData, exerciseCategories, difficultyLevels } from '@/lib/data';
import { formatDate, formatDuration, formatDateTime, calculateCalories } from '@/lib/utils';
import { Plus, Calendar, Clock, Flame, Target, Filter, Search, Edit, Trash2, Play, MoreVertical, TrendingUp } from 'lucide-react';

interface Workout {
  id: string;
  name: string;
  date: string;
  duration: number;
  exercises: Array<{
    id: string;
    name: string;
    category: string;
    sets?: number;
    reps?: number;
    weight?: number;
    duration?: number;
    distance?: number;
    calories?: number;
  }>;
  totalCalories: number;
  notes?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>(workoutsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);

  // Filter workouts based on search and filters
  const filteredWorkouts = useMemo(() => {
    return workouts.filter(workout => {
      const matchesSearch = workout.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           workout.exercises.some(ex => ex.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || 
                             workout.exercises.some(ex => ex.category === selectedCategory);
      
      const matchesDifficulty = selectedDifficulty === 'all' || workout.difficulty === selectedDifficulty;
      
      let matchesDate = true;
      if (dateFilter !== 'all') {
        const workoutDate = new Date(workout.date);
        const now = new Date();
        
        switch (dateFilter) {
          case 'today':
            matchesDate = workoutDate.toDateString() === now.toDateString();
            break;
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            matchesDate = workoutDate >= weekAgo;
            break;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            matchesDate = workoutDate >= monthAgo;
            break;
        }
      }
      
      return matchesSearch && matchesCategory && matchesDifficulty && matchesDate;
    });
  }, [workouts, searchTerm, selectedCategory, selectedDifficulty, dateFilter]);

  // Calculate workout statistics
  const workoutStats = useMemo(() => {
    const totalWorkouts = workouts.length;
    const totalDuration = workouts.reduce((sum, workout) => sum + workout.duration, 0);
    const totalCalories = workouts.reduce((sum, workout) => sum + workout.totalCalories, 0);
    const avgDuration = totalWorkouts > 0 ? totalDuration / totalWorkouts : 0;
    
    return {
      totalWorkouts,
      totalDuration,
      totalCalories,
      avgDuration
    };
  }, [workouts]);

  const handleCreateWorkout = (workoutData: any) => {
    const newWorkout: Workout = {
      id: Date.now().toString(),
      name: workoutData.name,
      date: new Date().toISOString(),
      duration: workoutData.duration || 0,
      exercises: workoutData.exercises || [],
      totalCalories: workoutData.totalCalories || 0,
      notes: workoutData.notes,
      difficulty: workoutData.difficulty || 'beginner'
    };
    
    setWorkouts(prev => [newWorkout, ...prev]);
    setIsCreateDialogOpen(false);
  };

  const handleEditWorkout = (workoutData: any) => {
    if (!editingWorkout) return;
    
    const updatedWorkout: Workout = {
      ...editingWorkout,
      name: workoutData.name,
      duration: workoutData.duration || editingWorkout.duration,
      exercises: workoutData.exercises || editingWorkout.exercises,
      totalCalories: workoutData.totalCalories || editingWorkout.totalCalories,
      notes: workoutData.notes,
      difficulty: workoutData.difficulty || editingWorkout.difficulty
    };
    
    setWorkouts(prev => prev.map(w => w.id === editingWorkout.id ? updatedWorkout : w));
    setEditingWorkout(null);
  };

  const handleDeleteWorkout = (workoutId: string) => {
    setWorkouts(prev => prev.filter(w => w.id !== workoutId));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workouts</h1>
          <p className="text-muted-foreground">Track and manage your workout sessions</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Workout
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Workout</DialogTitle>
              <DialogDescription>
                Plan and log your workout session
              </DialogDescription>
            </DialogHeader>
            <WorkoutForm onSave={handleCreateWorkout} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workoutStats.totalWorkouts}</div>
            <p className="text-xs text-muted-foreground">
              Sessions completed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDuration(workoutStats.totalDuration)}</div>
            <p className="text-xs text-muted-foreground">
              Time exercising
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calories Burned</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workoutStats.totalCalories.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total calories
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDuration(workoutStats.avgDuration)}</div>
            <p className="text-xs text-muted-foreground">
              Per workout
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search workouts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {exerciseCategories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Difficulty</label>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="All difficulties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  {difficultyLevels.map(level => (
                    <SelectItem key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workouts List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Workout History ({filteredWorkouts.length})
          </h2>
        </div>
        
        {filteredWorkouts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No workouts found</h3>
              <p className="text-muted-foreground text-center mb-4">
                {workouts.length === 0 
                  ? "Start your fitness journey by creating your first workout!"
                  : "Try adjusting your filters to see more workouts."
                }
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Workout
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredWorkouts.map((workout) => (
              <Card key={workout.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        {workout.name}
                        <Badge className={getDifficultyColor(workout.difficulty)}>
                          {workout.difficulty}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(workout.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatDuration(workout.duration)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Flame className="h-4 w-4" />
                          {workout.totalCalories} cal
                        </span>
                      </CardDescription>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingWorkout(workout)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteWorkout(workout.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium mb-2">Exercises ({workout.exercises.length})</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {workout.exercises.map((exercise, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                            <span className="font-medium text-sm">{exercise.name}</span>
                            <div className="text-xs text-muted-foreground">
                              {exercise.sets && exercise.reps && (
                                <span>{exercise.sets}×{exercise.reps}</span>
                              )}
                              {exercise.weight && (
                                <span className="ml-1">@ {exercise.weight}kg</span>
                              )}
                              {exercise.duration && (
                                <span>{formatDuration(exercise.duration)}</span>
                              )}
                              {exercise.distance && (
                                <span>{exercise.distance}km</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {workout.notes && (
                      <div>
                        <h4 className="font-medium mb-1">Notes</h4>
                        <p className="text-sm text-muted-foreground">{workout.notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Edit Workout Dialog */}
      <Dialog open={!!editingWorkout} onOpenChange={() => setEditingWorkout(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Workout</DialogTitle>
            <DialogDescription>
              Update your workout details
            </DialogDescription>
          </DialogHeader>
          {editingWorkout && (
            <WorkoutForm 
              initialData={editingWorkout}
              onSave={handleEditWorkout}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}