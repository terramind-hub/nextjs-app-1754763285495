// Core fitness tracking types and interfaces

// User and Profile Types
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  height?: number; // in cm
  weight?: number; // in kg
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
  fitnessGoals: string[];
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  units: 'metric' | 'imperial';
  theme: 'light' | 'dark' | 'system';
  notifications: {
    workoutReminders: boolean;
    goalDeadlines: boolean;
    achievements: boolean;
    weeklyReports: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private';
    shareWorkouts: boolean;
    shareProgress: boolean;
  };
}

// Exercise Types
export interface Exercise {
  id: string;
  name: string;
  description: string;
  category: ExerciseCategory;
  muscleGroups: string[];
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string[];
  tips?: string[];
  imageUrl?: string;
  videoUrl?: string;
  metValue?: number; // Metabolic equivalent for calorie calculation
  isCustom?: boolean;
  createdBy?: string;
  createdAt?: string;
}

export type ExerciseCategory = 
  | 'strength'
  | 'cardio'
  | 'flexibility'
  | 'balance'
  | 'sports'
  | 'functional'
  | 'rehabilitation'
  | 'yoga'
  | 'pilates'
  | 'martial_arts';

export interface ExerciseSet {
  id: string;
  exerciseId: string;
  reps?: number;
  weight?: number; // in kg
  duration?: number; // in seconds
  distance?: number; // in meters
  restTime?: number; // in seconds
  notes?: string;
  completed: boolean;
}

// Workout Types
export interface Workout {
  id: string;
  name: string;
  description?: string;
  category: WorkoutCategory;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  exercises: WorkoutExercise[];
  duration: number; // in minutes
  caloriesBurned?: number;
  date: string;
  startTime?: string;
  endTime?: string;
  notes?: string;
  isTemplate?: boolean;
  templateId?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export type WorkoutCategory = 
  | 'strength_training'
  | 'cardio'
  | 'hiit'
  | 'yoga'
  | 'pilates'
  | 'stretching'
  | 'sports'
  | 'functional'
  | 'rehabilitation'
  | 'mixed';

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  exercise: Exercise;
  sets: ExerciseSet[];
  order: number;
  restBetweenSets?: number; // in seconds
  notes?: string;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  description?: string;
  category: WorkoutCategory;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  exercises: TemplateExercise[];
  estimatedDuration: number; // in minutes
  targetMuscleGroups: string[];
  equipment: string[];
  isPublic: boolean;
  createdBy: string;
  usageCount: number;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateExercise {
  exerciseId: string;
  exercise: Exercise;
  sets: number;
  reps?: number;
  weight?: number;
  duration?: number;
  distance?: number;
  restTime?: number;
  order: number;
  notes?: string;
}

// Goal Types
export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: GoalCategory;
  type: GoalType;
  targetValue: number;
  currentValue: number;
  unit: string;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  startDate: string;
  targetDate: string;
  completedDate?: string;
  milestones: GoalMilestone[];
  reminders: GoalReminder[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export type GoalCategory = 
  | 'weight_loss'
  | 'weight_gain'
  | 'muscle_gain'
  | 'endurance'
  | 'strength'
  | 'flexibility'
  | 'general_fitness'
  | 'sport_specific'
  | 'rehabilitation'
  | 'lifestyle';

export type GoalType = 
  | 'target_weight'
  | 'body_fat_percentage'
  | 'muscle_mass'
  | 'workout_frequency'
  | 'exercise_duration'
  | 'distance_covered'
  | 'calories_burned'
  | 'strength_milestone'
  | 'flexibility_milestone'
  | 'custom_metric';

export interface GoalMilestone {
  id: string;
  title: string;
  targetValue: number;
  targetDate: string;
  completed: boolean;
  completedDate?: string;
  reward?: string;
}

export interface GoalReminder {
  id: string;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  time: string;
  message: string;
  enabled: boolean;
}

// Progress Tracking Types
export interface ProgressEntry {
  id: string;
  userId: string;
  date: string;
  weight?: number; // in kg
  bodyFatPercentage?: number;
  muscleMass?: number; // in kg
  measurements: BodyMeasurements;
  photos?: ProgressPhoto[];
  notes?: string;
  createdAt: string;
}

export interface BodyMeasurements {
  chest?: number; // in cm
  waist?: number;
  hips?: number;
  biceps?: number;
  thighs?: number;
  neck?: number;
  shoulders?: number;
  forearms?: number;
  calves?: number;
}

export interface ProgressPhoto {
  id: string;
  url: string;
  type: 'front' | 'side' | 'back' | 'custom';
  description?: string;
  uploadedAt: string;
}

export interface WorkoutProgress {
  exerciseId: string;
  exerciseName: string;
  progressType: 'weight' | 'reps' | 'duration' | 'distance';
  data: ProgressDataPoint[];
}

export interface ProgressDataPoint {
  date: string;
  value: number;
  unit: string;
  workoutId?: string;
}

// Nutrition Types (for future expansion)
export interface NutritionEntry {
  id: string;
  userId: string;
  date: string;
  meals: Meal[];
  totalCalories: number;
  macros: MacroNutrients;
  water: number; // in ml
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Meal {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: FoodItem[];
  totalCalories: number;
  time?: string;
}

export interface FoodItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  macros: MacroNutrients;
}

export interface MacroNutrients {
  protein: number; // in grams
  carbohydrates: number; // in grams
  fat: number; // in grams
  fiber?: number; // in grams
  sugar?: number; // in grams
}

// Dashboard and Analytics Types
export interface DashboardMetrics {
  totalWorkouts: number;
  totalDuration: number; // in minutes
  totalCaloriesBurned: number;
  averageWorkoutDuration: number; // in minutes
  workoutFrequency: number; // workouts per week
  activeGoals: number;
  completedGoals: number;
  currentStreak: number; // days
  longestStreak: number; // days
  favoriteExercise: string;
  strongestLift?: {
    exercise: string;
    weight: number;
    unit: string;
  };
  personalRecords: PersonalRecord[];
}

export interface PersonalRecord {
  id: string;
  exerciseId: string;
  exerciseName: string;
  type: 'weight' | 'reps' | 'duration' | 'distance';
  value: number;
  unit: string;
  date: string;
  workoutId: string;
}

export interface WorkoutStats {
  totalWorkouts: number;
  totalDuration: number;
  totalCalories: number;
  averageDuration: number;
  workoutsByCategory: Record<WorkoutCategory, number>;
  workoutsByDifficulty: Record<string, number>;
  mostActiveDay: string;
  currentStreak: number;
  longestStreak: number;
}

export interface ExerciseStats {
  totalExercises: number;
  exercisesByCategory: Record<ExerciseCategory, number>;
  exercisesByMuscleGroup: Record<string, number>;
  exercisesByEquipment: Record<string, number>;
  mostUsedExercise: {
    id: string;
    name: string;
    usageCount: number;
  };
  averageWorkoutDuration: number;
  totalCaloriesBurned: number;
}

// Chart and Visualization Types
export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
  color?: string;
}

export interface WorkoutChartData {
  date: string;
  workouts: number;
  duration: number;
  calories: number;
}

export interface ProgressChartData {
  date: string;
  weight?: number;
  bodyFat?: number;
  muscleMass?: number;
  [key: string]: any;
}

// Form and Input Types
export interface WorkoutFormData {
  name: string;
  description: string;
  category: WorkoutCategory;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  exercises: WorkoutExerciseInput[];
  date: string;
  startTime: string;
  notes: string;
}

export interface WorkoutExerciseInput {
  exerciseId: string;
  sets: ExerciseSetInput[];
  restBetweenSets: number;
  notes: string;
}

export interface ExerciseSetInput {
  reps?: number;
  weight?: number;
  duration?: number;
  distance?: number;
  restTime?: number;
  notes?: string;
}

export interface GoalFormData {
  title: string;
  description: string;
  category: GoalCategory;
  type: GoalType;
  targetValue: number;
  unit: string;
  priority: 'low' | 'medium' | 'high';
  targetDate: string;
  milestones: GoalMilestoneInput[];
}

export interface GoalMilestoneInput {
  title: string;
  targetValue: number;
  targetDate: string;
  reward?: string;
}

export interface ProgressFormData {
  date: string;
  weight?: number;
  bodyFatPercentage?: number;
  muscleMass?: number;
  measurements: Partial<BodyMeasurements>;
  notes?: string;
}

// Filter and Search Types
export interface WorkoutFilters {
  category?: WorkoutCategory;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  dateRange?: {
    start: string;
    end: string;
  };
  duration?: {
    min: number;
    max: number;
  };
  search?: string;
}

export interface ExerciseFilters {
  category?: ExerciseCategory;
  muscleGroup?: string;
  equipment?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  search?: string;
}

export interface GoalFilters {
  status?: 'active' | 'completed' | 'paused' | 'cancelled';
  category?: GoalCategory;
  priority?: 'low' | 'medium' | 'high';
  search?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Equipment and Muscle Group Constants
export const EQUIPMENT_LIST = [
  'bodyweight',
  'dumbbells',
  'barbell',
  'kettlebell',
  'resistance_bands',
  'pull_up_bar',
  'bench',
  'squat_rack',
  'cable_machine',
  'treadmill',
  'stationary_bike',
  'rowing_machine',
  'elliptical',
  'medicine_ball',
  'foam_roller',
  'yoga_mat',
  'stability_ball',
  'suspension_trainer',
  'battle_ropes',
  'plyometric_box'
] as const;

export const MUSCLE_GROUPS = [
  'chest',
  'back',
  'shoulders',
  'biceps',
  'triceps',
  'forearms',
  'core',
  'abs',
  'obliques',
  'quadriceps',
  'hamstrings',
  'glutes',
  'calves',
  'hip_flexors',
  'full_body',
  'cardio'
] as const;

export const DIFFICULTY_LEVELS = ['beginner', 'intermediate', 'advanced'] as const;

export const GOAL_PRIORITIES = ['low', 'medium', 'high'] as const;

export const GOAL_STATUSES = ['active', 'completed', 'paused', 'cancelled'] as const;

export const ACTIVITY_LEVELS = [
  'sedentary',
  'lightly_active',
  'moderately_active',
  'very_active',
  'extremely_active'
] as const;

// Type guards and utility types
export type Equipment = typeof EQUIPMENT_LIST[number];
export type MuscleGroup = typeof MUSCLE_GROUPS[number];
export type DifficultyLevel = typeof DIFFICULTY_LEVELS[number];
export type GoalPriority = typeof GOAL_PRIORITIES[number];
export type GoalStatus = typeof GOAL_STATUSES[number];
export type ActivityLevel = typeof ACTIVITY_LEVELS[number];

// Helper type for creating partial updates
export type PartialUpdate<T> = Partial<T> & { id: string };

// Helper type for form validation
export type FormErrors<T> = Partial<Record<keyof T, string>>;

// Helper type for sorting options
export interface SortOption<T> {
  key: keyof T;
  direction: 'asc' | 'desc';
  label: string;
}