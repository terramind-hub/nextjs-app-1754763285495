'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { exerciseCategories, exercisesData, workoutTemplates, difficultyLevels } from '@/lib/data';
import { generateId, formatDuration, calculateCalories } from '@/lib/utils';
import { Plus, Clock, Flame, Target, Save, X, Search } from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  category: string;
  duration: number;
  sets?: number;
  reps?: number;
  weight?: number;
  distance?: number;
  calories: number;
  notes?: string;
}

interface WorkoutFormData {
  name: string;
  date: string;
  duration: number;
  exercises: Exercise[];
  notes: string;
  difficulty: string;
  totalCalories: number;
}

interface WorkoutFormProps {
  onSave?: (workout: WorkoutFormData) => void;
  initialData?: Partial<WorkoutFormData>;
  isEditing?: boolean;
}

export default function WorkoutForm({ onSave, initialData, isEditing = false }: WorkoutFormProps) {
  const [workout, setWorkout] = useState<WorkoutFormData>({
    name: initialData?.name || '',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    duration: initialData?.duration || 0,
    exercises: initialData?.exercises || [],
    notes: initialData?.notes || '',
    difficulty: initialData?.difficulty || 'moderate',
    totalCalories: initialData?.totalCalories || 0,
  });

  const [isAddExerciseOpen, setIsAddExerciseOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [newExercise, setNewExercise] = useState<Partial<Exercise>>({
    name: '',
    category: '',
    duration: 0,
    sets: 1,
    reps: 10,
    weight: 0,
    distance: 0,
    notes: '',
  });

  // Filter exercises based on category and search term
  const filteredExercises = exercisesData.filter(exercise => {
    const matchesCategory = !selectedCategory || exercise.category === selectedCategory;
    const matchesSearch = !searchTerm || exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate total workout metrics
  const updateWorkoutMetrics = (exercises: Exercise[]) => {
    const totalDuration = exercises.reduce((sum, ex) => sum + ex.duration, 0);
    const totalCalories = exercises.reduce((sum, ex) => sum + ex.calories, 0);
    
    setWorkout(prev => ({
      ...prev,
      duration: totalDuration,
      totalCalories,
    }));
  };

  // Add exercise from library
  const addExerciseFromLibrary = (libraryExercise: any) => {
    const exercise: Exercise = {
      id: generateId(),
      name: libraryExercise.name,
      category: libraryExercise.category,
      duration: 30, // Default duration
      sets: libraryExercise.category === 'strength' ? 3 : undefined,
      reps: libraryExercise.category === 'strength' ? 10 : undefined,
      weight: libraryExercise.category === 'strength' ? 0 : undefined,
      distance: libraryExercise.category === 'cardio' ? 0 : undefined,
      calories: calculateCalories(libraryExercise.category, 30, 70), // Default weight 70kg
      notes: '',
    };

    const updatedExercises = [...workout.exercises, exercise];
    setWorkout(prev => ({ ...prev, exercises: updatedExercises }));
    updateWorkoutMetrics(updatedExercises);
    setIsAddExerciseOpen(false);
  };

  // Add custom exercise
  const addCustomExercise = () => {
    if (!newExercise.name || !newExercise.category) return;

    const exercise: Exercise = {
      id: generateId(),
      name: newExercise.name,
      category: newExercise.category,
      duration: newExercise.duration || 30,
      sets: newExercise.category === 'strength' ? newExercise.sets : undefined,
      reps: newExercise.category === 'strength' ? newExercise.reps : undefined,
      weight: newExercise.category === 'strength' ? newExercise.weight : undefined,
      distance: newExercise.category === 'cardio' ? newExercise.distance : undefined,
      calories: calculateCalories(newExercise.category, newExercise.duration || 30, 70),
      notes: newExercise.notes || '',
    };

    const updatedExercises = [...workout.exercises, exercise];
    setWorkout(prev => ({ ...prev, exercises: updatedExercises }));
    updateWorkoutMetrics(updatedExercises);
    
    // Reset form
    setNewExercise({
      name: '',
      category: '',
      duration: 0,
      sets: 1,
      reps: 10,
      weight: 0,
      distance: 0,
      notes: '',
    });
    setIsAddExerciseOpen(false);
  };

  // Update exercise
  const updateExercise = (exerciseId: string, updates: Partial<Exercise>) => {
    const updatedExercises = workout.exercises.map(ex => {
      if (ex.id === exerciseId) {
        const updated = { ...ex, ...updates };
        // Recalculate calories if duration changed
        if (updates.duration !== undefined) {
          updated.calories = calculateCalories(ex.category, updates.duration, 70);
        }
        return updated;
      }
      return ex;
    });
    
    setWorkout(prev => ({ ...prev, exercises: updatedExercises }));
    updateWorkoutMetrics(updatedExercises);
  };

  // Remove exercise
  const removeExercise = (exerciseId: string) => {
    const updatedExercises = workout.exercises.filter(ex => ex.id !== exerciseId);
    setWorkout(prev => ({ ...prev, exercises: updatedExercises }));
    updateWorkoutMetrics(updatedExercises);
  };

  // Load workout template
  const loadTemplate = (template: any) => {
    const templateExercises = template.exercises.map((ex: any) => ({
      ...ex,
      id: generateId(),
      calories: calculateCalories(ex.category, ex.duration, 70),
    }));

    setWorkout(prev => ({
      ...prev,
      name: template.name,
      exercises: templateExercises,
      difficulty: template.difficulty,
    }));
    updateWorkoutMetrics(templateExercises);
  };

  // Save workout
  const handleSave = () => {
    if (!workout.name.trim()) {
      alert('Please enter a workout name');
      return;
    }

    if (workout.exercises.length === 0) {
      alert('Please add at least one exercise');
      return;
    }

    onSave?.(workout);
  };

  return (
    <div className="space-y-6">
      {/* Workout Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Workout' : 'Create New Workout'}</CardTitle>
          <CardDescription>
            {isEditing ? 'Update your workout details' : 'Plan and track your fitness session'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="workout-name">Workout Name</Label>
              <Input
                id="workout-name"
                value={workout.name}
                onChange={(e) => setWorkout(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Morning Cardio, Upper Body Strength"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workout-date">Date</Label>
              <Input
                id="workout-date"
                type="date"
                value={workout.date}
                onChange={(e) => setWorkout(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <Select value={workout.difficulty} onValueChange={(value) => setWorkout(prev => ({ ...prev, difficulty: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {difficultyLevels.map(level => (
                    <SelectItem key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Workout Templates</Label>
              <Select onValueChange={(value) => {
                const template = workoutTemplates.find(t => t.id === value);
                if (template) loadTemplate(template);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Load template (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {workoutTemplates.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="workout-notes">Notes</Label>
            <Textarea
              id="workout-notes"
              value={workout.notes}
              onChange={(e) => setWorkout(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Add any notes about your workout..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Workout Summary */}
      {workout.exercises.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Workout Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-sm font-medium">Duration</span>
                </div>
                <p className="text-2xl font-bold">{formatDuration(workout.duration)}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Flame className="h-5 w-5 text-orange-500 mr-2" />
                  <span className="text-sm font-medium">Calories</span>
                </div>
                <p className="text-2xl font-bold">{workout.totalCalories}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Target className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm font-medium">Exercises</span>
                </div>
                <p className="text-2xl font-bold">{workout.exercises.length}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Badge variant="outline" className="text-sm">
                    {workout.difficulty.charAt(0).toUpperCase() + workout.difficulty.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Exercises */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Exercises</CardTitle>
              <CardDescription>Add and configure exercises for your workout</CardDescription>
            </div>
            <Dialog open={isAddExerciseOpen} onOpenChange={setIsAddExerciseOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Exercise
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add Exercise</DialogTitle>
                  <DialogDescription>
                    Choose from the exercise library or create a custom exercise
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Search and Filter */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Search Exercises</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search exercises..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Filter by Category</Label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="All categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All categories</SelectItem>
                          {exerciseCategories.map(category => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Exercise Library */}
                  <div>
                    <h4 className="font-semibold mb-3">Exercise Library</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                      {filteredExercises.map(exercise => (
                        <div
                          key={exercise.id}
                          className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => addExerciseFromLibrary(exercise)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium">{exercise.name}</h5>
                              <p className="text-sm text-gray-600">{exercise.category}</p>
                            </div>
                            <Badge variant="outline">{exercise.difficulty}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Custom Exercise Form */}
                  <div className="border-t pt-6">
                    <h4 className="font-semibold mb-3">Create Custom Exercise</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Exercise Name</Label>
                        <Input
                          value={newExercise.name}
                          onChange={(e) => setNewExercise(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter exercise name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select value={newExercise.category} onValueChange={(value) => setNewExercise(prev => ({ ...prev, category: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {exerciseCategories.map(category => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Duration (minutes)</Label>
                        <Input
                          type="number"
                          value={newExercise.duration}
                          onChange={(e) => setNewExercise(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                          placeholder="30"
                        />
                      </div>
                      {newExercise.category === 'strength' && (
                        <>
                          <div className="space-y-2">
                            <Label>Sets</Label>
                            <Input
                              type="number"
                              value={newExercise.sets}
                              onChange={(e) => setNewExercise(prev => ({ ...prev, sets: parseInt(e.target.value) || 1 }))}
                              placeholder="3"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Reps</Label>
                            <Input
                              type="number"
                              value={newExercise.reps}
                              onChange={(e) => setNewExercise(prev => ({ ...prev, reps: parseInt(e.target.value) || 10 }))}
                              placeholder="10"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Weight (kg)</Label>
                            <Input
                              type="number"
                              value={newExercise.weight}
                              onChange={(e) => setNewExercise(prev => ({ ...prev, weight: parseInt(e.target.value) || 0 }))}
                              placeholder="0"
                            />
                          </div>
                        </>
                      )}
                      {newExercise.category === 'cardio' && (
                        <div className="space-y-2">
                          <Label>Distance (km)</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={newExercise.distance}
                            onChange={(e) => setNewExercise(prev => ({ ...prev, distance: parseFloat(e.target.value) || 0 }))}
                            placeholder="5.0"
                          />
                        </div>
                      )}
                    </div>
                    <div className="mt-4">
                      <Button onClick={addCustomExercise} disabled={!newExercise.name || !newExercise.category}>
                        Add Custom Exercise
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {workout.exercises.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No exercises added yet. Click "Add Exercise" to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {workout.exercises.map((exercise, index) => (
                <div key={exercise.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{exercise.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {exercise.category}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExercise(exercise.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Duration (min)</Label>
                      <Input
                        type="number"
                        value={exercise.duration}
                        onChange={(e) => updateExercise(exercise.id, { duration: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    {exercise.category === 'strength' && (
                      <>
                        <div className="space-y-2">
                          <Label>Sets</Label>
                          <Input
                            type="number"
                            value={exercise.sets || 0}
                            onChange={(e) => updateExercise(exercise.id, { sets: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Reps</Label>
                          <Input
                            type="number"
                            value={exercise.reps || 0}
                            onChange={(e) => updateExercise(exercise.id, { reps: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Weight (kg)</Label>
                          <Input
                            type="number"
                            value={exercise.weight || 0}
                            onChange={(e) => updateExercise(exercise.id, { weight: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                      </>
                    )}
                    {exercise.category === 'cardio' && (
                      <div className="space-y-2">
                        <Label>Distance (km)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={exercise.distance || 0}
                          onChange={(e) => updateExercise(exercise.id, { distance: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                    <span>Estimated calories: {exercise.calories}</span>
                    <span>Duration: {formatDuration(exercise.duration)}</span>
                  </div>

                  {exercise.notes && (
                    <div className="mt-3">
                      <Label>Notes</Label>
                      <Textarea
                        value={exercise.notes}
                        onChange={(e) => updateExercise(exercise.id, { notes: e.target.value })}
                        placeholder="Exercise notes..."
                        rows={2}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          {isEditing ? 'Update Workout' : 'Save Workout'}
        </Button>
      </div>
    </div>
  );
}