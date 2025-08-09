'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ExerciseLibrary from '@/components/ExerciseLibrary';
import { exercisesData, exerciseCategories, muscleGroups, difficultyLevels, equipmentList, workoutsData } from '@/lib/data';
import { cn, capitalize, formatNumber } from '@/lib/utils';
import { Search, Filter, Plus, Dumbbell, Heart, Zap, Target, Clock, Flame, TrendingUp, BookOpen, Star, Users, BarChart3 } from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  category: string;
  description: string;
  instructions: string[];
  muscleGroups: string[];
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  calories: number;
  image?: string;
}

interface ExerciseStats {
  totalExercises: number;
  categories: number;
  popularExercise: string;
  avgDuration: number;
  totalCalories: number;
}

export default function ExercisesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedEquipment, setSelectedEquipment] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'difficulty' | 'duration' | 'calories' | 'popularity'>('name');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  // Filter and sort exercises
  const filteredAndSortedExercises = useMemo(() => {
    let filtered = exercisesData.filter((exercise) => {
      const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
      const matchesMuscleGroup = selectedMuscleGroup === 'all' || 
                                exercise.muscleGroups.includes(selectedMuscleGroup);
      const matchesDifficulty = selectedDifficulty === 'all' || exercise.difficulty === selectedDifficulty;
      const matchesEquipment = selectedEquipment === 'all' || 
                              exercise.equipment.includes(selectedEquipment) ||
                              (selectedEquipment === 'bodyweight' && exercise.equipment.length === 0);

      return matchesSearch && matchesCategory && matchesMuscleGroup && matchesDifficulty && matchesEquipment;
    });

    // Sort exercises
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'difficulty':
          const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        case 'duration':
          return a.duration - b.duration;
        case 'calories':
          return b.calories - a.calories;
        case 'popularity':
          // Calculate popularity based on workout usage
          const aUsage = workoutsData.reduce((count, workout) => 
            count + workout.exercises.filter(ex => ex.exerciseId === a.id).length, 0);
          const bUsage = workoutsData.reduce((count, workout) => 
            count + workout.exercises.filter(ex => ex.exerciseId === b.id).length, 0);
          return bUsage - aUsage;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, selectedMuscleGroup, selectedDifficulty, selectedEquipment, sortBy]);

  // Calculate exercise statistics
  const exerciseStats: ExerciseStats = useMemo(() => {
    const totalExercises = exercisesData.length;
    const categories = exerciseCategories.length;
    
    // Find most popular exercise
    const exerciseUsage = exercisesData.map(exercise => ({
      exercise,
      usage: workoutsData.reduce((count, workout) => 
        count + workout.exercises.filter(ex => ex.exerciseId === exercise.id).length, 0)
    }));
    const popularExercise = exerciseUsage.reduce((prev, current) => 
      current.usage > prev.usage ? current : prev).exercise.name;

    const avgDuration = Math.round(exercisesData.reduce((sum, ex) => sum + ex.duration, 0) / totalExercises);
    const totalCalories = exercisesData.reduce((sum, ex) => sum + ex.calories, 0);

    return {
      totalExercises,
      categories,
      popularExercise,
      avgDuration,
      totalCalories
    };
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'strength':
        return Dumbbell;
      case 'cardio':
        return Heart;
      case 'flexibility':
        return Zap;
      default:
        return Target;
    }
  };

  const handleExerciseClick = (exercise: Exercise) => {
    setSelectedExercise(exercise);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedMuscleGroup('all');
    setSelectedDifficulty('all');
    setSelectedEquipment('all');
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Exercise Library</h1>
            <p className="text-muted-foreground">
              Discover and learn new exercises to enhance your fitness routine
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <BookOpen className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Exercises</p>
                  <p className="text-2xl font-bold">{exerciseStats.totalExercises}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Categories</p>
                  <p className="text-2xl font-bold">{exerciseStats.categories}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Most Popular</p>
                  <p className="text-lg font-bold truncate">{exerciseStats.popularExercise}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Duration</p>
                  <p className="text-2xl font-bold">{exerciseStats.avgDuration}m</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Flame className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Calories</p>
                  <p className="text-2xl font-bold">{formatNumber(exerciseStats.totalCalories)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </CardTitle>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {exerciseCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Muscle Group</label>
              <Select value={selectedMuscleGroup} onValueChange={setSelectedMuscleGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="All Muscles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Muscles</SelectItem>
                  {muscleGroups.map((muscle) => (
                    <SelectItem key={muscle} value={muscle}>
                      {capitalize(muscle)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Difficulty</label>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {difficultyLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {capitalize(level)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Equipment</label>
              <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
                <SelectTrigger>
                  <SelectValue placeholder="All Equipment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Equipment</SelectItem>
                  <SelectItem value="bodyweight">Bodyweight</SelectItem>
                  {equipmentList.map((equipment) => (
                    <SelectItem key={equipment} value={equipment}>
                      {capitalize(equipment)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Sort By</label>
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="difficulty">Difficulty</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                  <SelectItem value="calories">Calories</SelectItem>
                  <SelectItem value="popularity">Popularity</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Badge variant="secondary" className="text-sm">
                {filteredAndSortedExercises.length} exercises
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exercise Grid/List */}
      <div className={cn(
        "grid gap-6",
        viewMode === 'grid' 
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
          : "grid-cols-1"
      )}>
        {filteredAndSortedExercises.map((exercise) => {
          const Icon = getCategoryIcon(exercise.category);
          const exerciseUsage = workoutsData.reduce((count, workout) => 
            count + workout.exercises.filter(ex => ex.exerciseId === exercise.id).length, 0);

          return (
            <Card 
              key={exercise.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleExerciseClick(exercise)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{exercise.name}</CardTitle>
                  </div>
                  <Badge className={getDifficultyColor(exercise.difficulty)}>
                    {capitalize(exercise.difficulty)}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {exercise.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Muscle Groups */}
                <div className="flex flex-wrap gap-1">
                  {exercise.muscleGroups.slice(0, 3).map((muscle) => (
                    <Badge key={muscle} variant="outline" className="text-xs">
                      {capitalize(muscle)}
                    </Badge>
                  ))}
                  {exercise.muscleGroups.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{exercise.muscleGroups.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span>{exercise.duration}m</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Flame className="h-3 w-3 text-muted-foreground" />
                    <span>{exercise.calories}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    <span>{exerciseUsage}</span>
                  </div>
                </div>

                {/* Equipment */}
                {exercise.equipment.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    Equipment: {exercise.equipment.join(', ')}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* No Results */}
      {filteredAndSortedExercises.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No exercises found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search terms
            </p>
            <Button onClick={clearFilters}>Clear Filters</Button>
          </CardContent>
        </Card>
      )}

      {/* Exercise Detail Dialog */}
      <Dialog open={!!selectedExercise} onOpenChange={() => setSelectedExercise(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedExercise && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="text-2xl">{selectedExercise.name}</DialogTitle>
                    <DialogDescription className="mt-2">
                      {selectedExercise.description}
                    </DialogDescription>
                  </div>
                  <Badge className={getDifficultyColor(selectedExercise.difficulty)}>
                    {capitalize(selectedExercise.difficulty)}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <Clock className="h-5 w-5 mx-auto mb-1 text-primary" />
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-semibold">{selectedExercise.duration} min</p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <Flame className="h-5 w-5 mx-auto mb-1 text-primary" />
                    <p className="text-sm text-muted-foreground">Calories</p>
                    <p className="font-semibold">{selectedExercise.calories}</p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <Target className="h-5 w-5 mx-auto mb-1 text-primary" />
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-semibold">{capitalize(selectedExercise.category)}</p>
                  </div>
                </div>

                {/* Muscle Groups */}
                <div>
                  <h4 className="font-semibold mb-2">Target Muscles</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedExercise.muscleGroups.map((muscle) => (
                      <Badge key={muscle} variant="secondary">
                        {capitalize(muscle)}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Equipment */}
                {selectedExercise.equipment.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Required Equipment</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedExercise.equipment.map((equipment) => (
                        <Badge key={equipment} variant="outline">
                          {capitalize(equipment)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Instructions */}
                <div>
                  <h4 className="font-semibold mb-2">Instructions</h4>
                  <ol className="space-y-2">
                    {selectedExercise.instructions.map((instruction, index) => (
                      <li key={index} className="flex space-x-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <span className="text-sm">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}