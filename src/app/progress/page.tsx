'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ProgressCharts from '@/components/ProgressCharts';
import { progressData, workoutsData, goalsData } from '@/lib/data';
import { formatDate, formatNumber, calculateProgress, generateId } from '@/lib/utils';
import { TrendingUp, Calendar, Target, Activity, Flame, Clock, Award, BarChart3, Plus, Edit, Trash2, Scale, Ruler, Zap, Heart, Trophy, ChevronUp, ChevronDown, Minus } from 'lucide-react';

interface ProgressEntry {
  id: string;
  date: string;
  weight?: number;
  bodyFat?: number;
  muscleMass?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    biceps?: number;
    thighs?: number;
  };
  notes?: string;
}

interface ProgressFormData {
  date: string;
  weight: string;
  bodyFat: string;
  muscleMass: string;
  chest: string;
  waist: string;
  hips: string;
  biceps: string;
  thighs: string;
  notes: string;
}

export default function ProgressPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('3months');
  const [isAddingProgress, setIsAddingProgress] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ProgressEntry | null>(null);
  const [formData, setFormData] = useState<ProgressFormData>({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    bodyFat: '',
    muscleMass: '',
    chest: '',
    waist: '',
    hips: '',
    biceps: '',
    thighs: '',
    notes: ''
  });

  // Calculate progress statistics
  const progressStats = useMemo(() => {
    const sortedData = [...progressData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const latest = sortedData[sortedData.length - 1];
    const previous = sortedData[sortedData.length - 2];

    if (!latest || !previous) {
      return {
        weightChange: 0,
        bodyFatChange: 0,
        muscleMassChange: 0,
        totalEntries: sortedData.length,
        latestEntry: latest
      };
    }

    return {
      weightChange: latest.weight && previous.weight ? latest.weight - previous.weight : 0,
      bodyFatChange: latest.bodyFat && previous.bodyFat ? latest.bodyFat - previous.bodyFat : 0,
      muscleMassChange: latest.muscleMass && previous.muscleMass ? latest.muscleMass - previous.muscleMass : 0,
      totalEntries: sortedData.length,
      latestEntry: latest
    };
  }, []);

  // Calculate workout progress
  const workoutProgress = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const recentWorkouts = workoutsData.filter(workout => new Date(workout.date) >= thirtyDaysAgo);
    
    const totalWorkouts = recentWorkouts.length;
    const totalDuration = recentWorkouts.reduce((sum, workout) => sum + workout.duration, 0);
    const totalCalories = recentWorkouts.reduce((sum, workout) => sum + workout.caloriesBurned, 0);
    const avgDuration = totalWorkouts > 0 ? totalDuration / totalWorkouts : 0;

    return {
      totalWorkouts,
      totalDuration,
      totalCalories,
      avgDuration
    };
  }, []);

  // Calculate goal progress
  const goalProgress = useMemo(() => {
    const activeGoals = goalsData.filter(goal => goal.status === 'active');
    const completedGoals = goalsData.filter(goal => goal.status === 'completed');
    const totalGoals = goalsData.length;
    const completionRate = totalGoals > 0 ? (completedGoals.length / totalGoals) * 100 : 0;

    return {
      activeGoals: activeGoals.length,
      completedGoals: completedGoals.length,
      totalGoals,
      completionRate
    };
  }, []);

  const handleAddProgress = () => {
    const newEntry: ProgressEntry = {
      id: generateId(),
      date: formData.date,
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      bodyFat: formData.bodyFat ? parseFloat(formData.bodyFat) : undefined,
      muscleMass: formData.muscleMass ? parseFloat(formData.muscleMass) : undefined,
      measurements: {
        chest: formData.chest ? parseFloat(formData.chest) : undefined,
        waist: formData.waist ? parseFloat(formData.waist) : undefined,
        hips: formData.hips ? parseFloat(formData.hips) : undefined,
        biceps: formData.biceps ? parseFloat(formData.biceps) : undefined,
        thighs: formData.thighs ? parseFloat(formData.thighs) : undefined
      },
      notes: formData.notes || undefined
    };

    // In a real app, this would update the data store
    console.log('Adding progress entry:', newEntry);
    
    resetForm();
    setIsAddingProgress(false);
  };

  const handleEditProgress = () => {
    if (!editingEntry) return;

    const updatedEntry: ProgressEntry = {
      ...editingEntry,
      date: formData.date,
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      bodyFat: formData.bodyFat ? parseFloat(formData.bodyFat) : undefined,
      muscleMass: formData.muscleMass ? parseFloat(formData.muscleMass) : undefined,
      measurements: {
        chest: formData.chest ? parseFloat(formData.chest) : undefined,
        waist: formData.waist ? parseFloat(formData.waist) : undefined,
        hips: formData.hips ? parseFloat(formData.hips) : undefined,
        biceps: formData.biceps ? parseFloat(formData.biceps) : undefined,
        thighs: formData.thighs ? parseFloat(formData.thighs) : undefined
      },
      notes: formData.notes || undefined
    };

    // In a real app, this would update the data store
    console.log('Updating progress entry:', updatedEntry);
    
    resetForm();
    setEditingEntry(null);
  };

  const handleDeleteProgress = (entryId: string) => {
    // In a real app, this would delete from the data store
    console.log('Deleting progress entry:', entryId);
  };

  const openEditDialog = (entry: ProgressEntry) => {
    setEditingEntry(entry);
    setFormData({
      date: entry.date,
      weight: entry.weight?.toString() || '',
      bodyFat: entry.bodyFat?.toString() || '',
      muscleMass: entry.muscleMass?.toString() || '',
      chest: entry.measurements?.chest?.toString() || '',
      waist: entry.measurements?.waist?.toString() || '',
      hips: entry.measurements?.hips?.toString() || '',
      biceps: entry.measurements?.biceps?.toString() || '',
      thighs: entry.measurements?.thighs?.toString() || '',
      notes: entry.notes || ''
    });
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      weight: '',
      bodyFat: '',
      muscleMass: '',
      chest: '',
      waist: '',
      hips: '',
      biceps: '',
      thighs: '',
      notes: ''
    });
  };

  const getTrendIcon = (value: number) => {
    if (value > 0) return <ChevronUp className="h-4 w-4 text-green-500" />;
    if (value < 0) return <ChevronDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const formatChange = (value: number, unit: string) => {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}${unit}`;
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Progress Tracking</h1>
          <p className="text-muted-foreground">Monitor your fitness journey and achievements</p>
        </div>
        <Dialog open={isAddingProgress} onOpenChange={setIsAddingProgress}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Progress Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Progress Entry</DialogTitle>
              <DialogDescription>
                Record your latest measurements and progress
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="70.5"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bodyFat">Body Fat (%)</Label>
                <Input
                  id="bodyFat"
                  type="number"
                  step="0.1"
                  placeholder="15.2"
                  value={formData.bodyFat}
                  onChange={(e) => setFormData({ ...formData, bodyFat: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="muscleMass">Muscle Mass (kg)</Label>
                <Input
                  id="muscleMass"
                  type="number"
                  step="0.1"
                  placeholder="35.8"
                  value={formData.muscleMass}
                  onChange={(e) => setFormData({ ...formData, muscleMass: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="chest">Chest (cm)</Label>
                <Input
                  id="chest"
                  type="number"
                  step="0.1"
                  placeholder="95.5"
                  value={formData.chest}
                  onChange={(e) => setFormData({ ...formData, chest: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="waist">Waist (cm)</Label>
                <Input
                  id="waist"
                  type="number"
                  step="0.1"
                  placeholder="80.2"
                  value={formData.waist}
                  onChange={(e) => setFormData({ ...formData, waist: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hips">Hips (cm)</Label>
                <Input
                  id="hips"
                  type="number"
                  step="0.1"
                  placeholder="95.0"
                  value={formData.hips}
                  onChange={(e) => setFormData({ ...formData, hips: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="biceps">Biceps (cm)</Label>
                <Input
                  id="biceps"
                  type="number"
                  step="0.1"
                  placeholder="32.5"
                  value={formData.biceps}
                  onChange={(e) => setFormData({ ...formData, biceps: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="thighs">Thighs (cm)</Label>
                <Input
                  id="thighs"
                  type="number"
                  step="0.1"
                  placeholder="55.8"
                  value={formData.thighs}
                  onChange={(e) => setFormData({ ...formData, thighs: e.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  placeholder="Additional notes about your progress..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsAddingProgress(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddProgress}>
                Add Entry
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Progress Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weight Change</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold">
                {progressStats.latestEntry?.weight ? `${progressStats.latestEntry.weight}kg` : 'N/A'}
              </div>
              {getTrendIcon(progressStats.weightChange)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatChange(progressStats.weightChange, 'kg')} from last entry
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Body Fat</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold">
                {progressStats.latestEntry?.bodyFat ? `${progressStats.latestEntry.bodyFat}%` : 'N/A'}
              </div>
              {getTrendIcon(-progressStats.bodyFatChange)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatChange(progressStats.bodyFatChange, '%')} from last entry
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Muscle Mass</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold">
                {progressStats.latestEntry?.muscleMass ? `${progressStats.latestEntry.muscleMass}kg` : 'N/A'}
              </div>
              {getTrendIcon(progressStats.muscleMassChange)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatChange(progressStats.muscleMassChange, 'kg')} from last entry
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progressStats.totalEntries}</div>
            <p className="text-xs text-muted-foreground">
              Progress measurements recorded
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Workout & Goal Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Workout Progress (30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{workoutProgress.totalWorkouts}</div>
                <div className="text-sm text-muted-foreground">Total Workouts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{formatNumber(workoutProgress.totalCalories)}</div>
                <div className="text-sm text-muted-foreground">Calories Burned</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{Math.round(workoutProgress.totalDuration / 60)}h</div>
                <div className="text-sm text-muted-foreground">Total Duration</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{Math.round(workoutProgress.avgDuration)}</div>
                <div className="text-sm text-muted-foreground">Avg Duration (min)</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Goal Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Completion Rate</span>
                <span>{goalProgress.completionRate.toFixed(1)}%</span>
              </div>
              <Progress value={goalProgress.completionRate} className="h-2" />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-blue-600">{goalProgress.activeGoals}</div>
                <div className="text-xs text-muted-foreground">Active</div>
              </div>
              <div>
                <div className="text-xl font-bold text-green-600">{goalProgress.completedGoals}</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-600">{goalProgress.totalGoals}</div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Progress Charts
            </CardTitle>
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">Last Month</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <ProgressCharts timeframe={selectedTimeframe} />
        </CardContent>
      </Card>

      {/* Progress History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Progress History
          </CardTitle>
          <CardDescription>
            Your recorded measurements and progress entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {progressData.slice(0, 10).map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="font-medium">{formatDate(entry.date)}</div>
                    <div className="flex gap-2">
                      {entry.weight && (
                        <Badge variant="secondary" className="text-xs">
                          <Scale className="h-3 w-3 mr-1" />
                          {entry.weight}kg
                        </Badge>
                      )}
                      {entry.bodyFat && (
                        <Badge variant="secondary" className="text-xs">
                          <Zap className="h-3 w-3 mr-1" />
                          {entry.bodyFat}%
                        </Badge>
                      )}
                      {entry.muscleMass && (
                        <Badge variant="secondary" className="text-xs">
                          <Zap className="h-3 w-3 mr-1" />
                          {entry.muscleMass}kg
                        </Badge>
                      )}
                    </div>
                  </div>
                  {entry.notes && (
                    <p className="text-sm text-muted-foreground">{entry.notes}</p>
                  )}
                  {entry.measurements && (
                    <div className="flex gap-2 mt-2">
                      {entry.measurements.chest && (
                        <span className="text-xs text-muted-foreground">Chest: {entry.measurements.chest}cm</span>
                      )}
                      {entry.measurements.waist && (
                        <span className="text-xs text-muted-foreground">Waist: {entry.measurements.waist}cm</span>
                      )}
                      {entry.measurements.biceps && (
                        <span className="text-xs text-muted-foreground">Biceps: {entry.measurements.biceps}cm</span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Dialog open={editingEntry?.id === entry.id} onOpenChange={(open) => !open && setEditingEntry(null)}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(entry)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Edit Progress Entry</DialogTitle>
                        <DialogDescription>
                          Update your measurements and progress
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-date">Date</Label>
                          <Input
                            id="edit-date"
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-weight">Weight (kg)</Label>
                          <Input
                            id="edit-weight"
                            type="number"
                            step="0.1"
                            placeholder="70.5"
                            value={formData.weight}
                            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-bodyFat">Body Fat (%)</Label>
                          <Input
                            id="edit-bodyFat"
                            type="number"
                            step="0.1"
                            placeholder="15.2"
                            value={formData.bodyFat}
                            onChange={(e) => setFormData({ ...formData, bodyFat: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-muscleMass">Muscle Mass (kg)</Label>
                          <Input
                            id="edit-muscleMass"
                            type="number"
                            step="0.1"
                            placeholder="35.8"
                            value={formData.muscleMass}
                            onChange={(e) => setFormData({ ...formData, muscleMass: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-chest">Chest (cm)</Label>
                          <Input
                            id="edit-chest"
                            type="number"
                            step="0.1"
                            placeholder="95.5"
                            value={formData.chest}
                            onChange={(e) => setFormData({ ...formData, chest: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-waist">Waist (cm)</Label>
                          <Input
                            id="edit-waist"
                            type="number"
                            step="0.1"
                            placeholder="80.2"
                            value={formData.waist}
                            onChange={(e) => setFormData({ ...formData, waist: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-hips">Hips (cm)</Label>
                          <Input
                            id="edit-hips"
                            type="number"
                            step="0.1"
                            placeholder="95.0"
                            value={formData.hips}
                            onChange={(e) => setFormData({ ...formData, hips: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-biceps">Biceps (cm)</Label>
                          <Input
                            id="edit-biceps"
                            type="number"
                            step="0.1"
                            placeholder="32.5"
                            value={formData.biceps}
                            onChange={(e) => setFormData({ ...formData, biceps: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-thighs">Thighs (cm)</Label>
                          <Input
                            id="edit-thighs"
                            type="number"
                            step="0.1"
                            placeholder="55.8"
                            value={formData.thighs}
                            onChange={(e) => setFormData({ ...formData, thighs: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="edit-notes">Notes</Label>
                          <Input
                            id="edit-notes"
                            placeholder="Additional notes about your progress..."
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => setEditingEntry(null)}>
                          Cancel
                        </Button>
                        <Button onClick={handleEditProgress}>
                          Update Entry
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteProgress(entry.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}