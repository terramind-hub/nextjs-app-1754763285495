'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { exerciseCategories, exercisesData, muscleGroups, difficultyLevels, equipmentList } from '@/lib/data';
import { cn, capitalize } from '@/lib/utils';
import { Search, Filter, Plus, Clock, Target, Dumbbell, Heart, Zap, Info } from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  category: string;
  muscleGroups: string[];
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  instructions: string[];
  tips: string[];
  duration?: number;
  sets?: number;
  reps?: number;
  calories?: number;
}

interface ExerciseLibraryProps {
  onAddExercise?: (exercise: Exercise) => void;
  selectedCategory?: string;
}

export default function ExerciseLibrary({ onAddExercise, selectedCategory }: ExerciseLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState(selectedCategory || 'all');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedEquipment, setSelectedEquipment] = useState('all');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  // Filter exercises based on search and filters
  const filteredExercises = useMemo(() => {
    return exercisesData.filter((exercise) => {
      const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategoryFilter === 'all' || exercise.category === selectedCategoryFilter;
      
      const matchesMuscleGroup = selectedMuscleGroup === 'all' || 
                                exercise.muscleGroups.some(mg => mg.toLowerCase() === selectedMuscleGroup.toLowerCase());
      
      const matchesDifficulty = selectedDifficulty === 'all' || exercise.difficulty === selectedDifficulty;
      
      const matchesEquipment = selectedEquipment === 'all' || 
                              exercise.equipment.some(eq => eq.toLowerCase() === selectedEquipment.toLowerCase());

      return matchesSearch && matchesCategory && matchesMuscleGroup && matchesDifficulty && matchesEquipment;
    });
  }, [searchTerm, selectedCategoryFilter, selectedMuscleGroup, selectedDifficulty, selectedEquipment]);

  // Group exercises by category for display
  const exercisesByCategory = useMemo(() => {
    const grouped: Record<string, Exercise[]> = {};
    
    filteredExercises.forEach((exercise) => {
      if (!grouped[exercise.category]) {
        grouped[exercise.category] = [];
      }
      grouped[exercise.category].push(exercise);
    });
    
    return grouped;
  }, [filteredExercises]);

  const handleExerciseClick = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setIsDetailDialogOpen(true);
  };

  const handleAddExercise = (exercise: Exercise) => {
    if (onAddExercise) {
      onAddExercise(exercise);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'strength':
        return <Dumbbell className="h-4 w-4" />;
      case 'cardio':
        return <Heart className="h-4 w-4" />;
      case 'flexibility':
        return <Zap className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Exercise Library
          </CardTitle>
          <CardDescription>
            Browse and search through our comprehensive exercise database
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category-filter">Category</Label>
              <Select value={selectedCategoryFilter} onValueChange={setSelectedCategoryFilter}>
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

            <div className="space-y-2">
              <Label htmlFor="muscle-filter">Muscle Group</Label>
              <Select value={selectedMuscleGroup} onValueChange={setSelectedMuscleGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="All Muscle Groups" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Muscle Groups</SelectItem>
                  {muscleGroups.map((muscle) => (
                    <SelectItem key={muscle} value={muscle}>
                      {capitalize(muscle)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty-filter">Difficulty</Label>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="All Difficulties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  {difficultyLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {capitalize(level)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="equipment-filter">Equipment</Label>
              <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
                <SelectTrigger>
                  <SelectValue placeholder="All Equipment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Equipment</SelectItem>
                  {equipmentList.map((equipment) => (
                    <SelectItem key={equipment} value={equipment}>
                      {capitalize(equipment)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-600">
            Showing {filteredExercises.length} exercise{filteredExercises.length !== 1 ? 's' : ''}
          </div>
        </CardContent>
      </Card>

      {/* Exercise Grid */}
      <div className="space-y-6">
        {Object.entries(exercisesByCategory).map(([category, exercises]) => (
          <div key={category} className="space-y-4">
            <div className="flex items-center gap-2">
              {getCategoryIcon(category)}
              <h3 className="text-lg font-semibold capitalize">{category}</h3>
              <Badge variant="secondary">{exercises.length}</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {exercises.map((exercise) => (
                <Card key={exercise.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">{exercise.name}</CardTitle>
                      <Badge className={cn('text-xs', getDifficultyColor(exercise.difficulty))}>
                        {capitalize(exercise.difficulty)}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm line-clamp-2">
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

                    {/* Exercise Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      {exercise.duration && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {exercise.duration}min
                        </div>
                      )}
                      {exercise.sets && exercise.reps && (
                        <div className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          {exercise.sets}×{exercise.reps}
                        </div>
                      )}
                      {exercise.calories && (
                        <div className="flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          {exercise.calories} cal
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExerciseClick(exercise)}
                        className="flex-1"
                      >
                        <Info className="h-3 w-3 mr-1" />
                        Details
                      </Button>
                      {onAddExercise && (
                        <Button
                          size="sm"
                          onClick={() => handleAddExercise(exercise)}
                          className="flex-1"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredExercises.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No exercises found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or filters to find exercises.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategoryFilter('all');
                setSelectedMuscleGroup('all');
                setSelectedDifficulty('all');
                setSelectedEquipment('all');
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Exercise Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedExercise && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  {selectedExercise.name}
                  <Badge className={cn('text-xs', getDifficultyColor(selectedExercise.difficulty))}>
                    {capitalize(selectedExercise.difficulty)}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  {selectedExercise.description}
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="instructions">Instructions</TabsTrigger>
                  <TabsTrigger value="tips">Tips</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Category</Label>
                      <div className="flex items-center gap-2 mt-1">
                        {getCategoryIcon(selectedExercise.category)}
                        <span className="capitalize">{selectedExercise.category}</span>
                      </div>
                    </div>
                    
                    {selectedExercise.duration && (
                      <div>
                        <Label className="text-sm font-medium">Duration</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-4 w-4" />
                          <span>{selectedExercise.duration} minutes</span>
                        </div>
                      </div>
                    )}
                    
                    {selectedExercise.sets && selectedExercise.reps && (
                      <div>
                        <Label className="text-sm font-medium">Sets & Reps</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Target className="h-4 w-4" />
                          <span>{selectedExercise.sets} sets × {selectedExercise.reps} reps</span>
                        </div>
                      </div>
                    )}
                    
                    {selectedExercise.calories && (
                      <div>
                        <Label className="text-sm font-medium">Calories</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Zap className="h-4 w-4" />
                          <span>{selectedExercise.calories} cal</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Muscle Groups</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedExercise.muscleGroups.map((muscle) => (
                        <Badge key={muscle} variant="outline">
                          {capitalize(muscle)}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Equipment</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedExercise.equipment.map((equipment) => (
                        <Badge key={equipment} variant="secondary">
                          {capitalize(equipment)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="instructions" className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Step-by-step Instructions</Label>
                    <ol className="space-y-3">
                      {selectedExercise.instructions.map((instruction, index) => (
                        <li key={index} className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </span>
                          <span className="text-sm">{instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </TabsContent>

                <TabsContent value="tips" className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Tips & Safety</Label>
                    <ul className="space-y-2">
                      {selectedExercise.tips.map((tip, index) => (
                        <li key={index} className="flex gap-3">
                          <span className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2"></span>
                          <span className="text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>

              {onAddExercise && (
                <div className="flex justify-end pt-4 border-t">
                  <Button onClick={() => handleAddExercise(selectedExercise)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Workout
                  </Button>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}