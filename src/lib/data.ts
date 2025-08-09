// Mock data for the fitness tracker application
import { generateId } from './utils';

// Exercise categories and types
export const exerciseCategories = [
  'Cardio',
  'Strength',
  'Flexibility',
  'Sports',
  'Yoga',
  'Pilates',
  'CrossFit',
  'Swimming',
  'Running',
  'Cycling'
] as const;

export type ExerciseCategory = typeof exerciseCategories[number];

// Sample exercises data
export const exercisesData = [
  // Cardio exercises
  {
    id: generateId(),
    name: 'Running',
    category: 'Cardio' as ExerciseCategory,
    description: 'Outdoor or treadmill running',
    muscleGroups: ['Legs', 'Core'],
    equipment: 'None',
    difficulty: 'Beginner',
    instructions: [
      'Start with a 5-minute warm-up walk',
      'Begin running at a comfortable pace',
      'Maintain steady breathing',
      'Cool down with a 5-minute walk'
    ]
  },
  {
    id: generateId(),
    name: 'Cycling',
    category: 'Cardio' as ExerciseCategory,
    description: 'Indoor or outdoor cycling',
    muscleGroups: ['Legs', 'Glutes'],
    equipment: 'Bicycle',
    difficulty: 'Beginner',
    instructions: [
      'Adjust bike seat to proper height',
      'Start with gentle pedaling',
      'Maintain steady rhythm',
      'Cool down gradually'
    ]
  },
  {
    id: generateId(),
    name: 'Jump Rope',
    category: 'Cardio' as ExerciseCategory,
    description: 'High-intensity cardio exercise',
    muscleGroups: ['Legs', 'Arms', 'Core'],
    equipment: 'Jump rope',
    difficulty: 'Intermediate',
    instructions: [
      'Hold rope handles at hip level',
      'Jump with both feet together',
      'Land softly on balls of feet',
      'Keep elbows close to body'
    ]
  },
  // Strength exercises
  {
    id: generateId(),
    name: 'Push-ups',
    category: 'Strength' as ExerciseCategory,
    description: 'Upper body bodyweight exercise',
    muscleGroups: ['Chest', 'Arms', 'Core'],
    equipment: 'None',
    difficulty: 'Beginner',
    instructions: [
      'Start in plank position',
      'Lower body until chest nearly touches floor',
      'Push back up to starting position',
      'Keep core engaged throughout'
    ]
  },
  {
    id: generateId(),
    name: 'Squats',
    category: 'Strength' as ExerciseCategory,
    description: 'Lower body compound exercise',
    muscleGroups: ['Legs', 'Glutes', 'Core'],
    equipment: 'None',
    difficulty: 'Beginner',
    instructions: [
      'Stand with feet shoulder-width apart',
      'Lower body as if sitting in chair',
      'Keep knees behind toes',
      'Return to standing position'
    ]
  },
  {
    id: generateId(),
    name: 'Deadlifts',
    category: 'Strength' as ExerciseCategory,
    description: 'Full body compound exercise',
    muscleGroups: ['Back', 'Legs', 'Core'],
    equipment: 'Barbell',
    difficulty: 'Advanced',
    instructions: [
      'Stand with feet hip-width apart',
      'Grip barbell with hands outside legs',
      'Lift by extending hips and knees',
      'Keep back straight throughout movement'
    ]
  },
  // Flexibility exercises
  {
    id: generateId(),
    name: 'Downward Dog',
    category: 'Flexibility' as ExerciseCategory,
    description: 'Classic yoga pose for flexibility',
    muscleGroups: ['Back', 'Legs', 'Arms'],
    equipment: 'Yoga mat',
    difficulty: 'Beginner',
    instructions: [
      'Start on hands and knees',
      'Tuck toes under and lift hips up',
      'Straighten legs and arms',
      'Hold position and breathe deeply'
    ]
  },
  {
    id: generateId(),
    name: 'Pigeon Pose',
    category: 'Flexibility' as ExerciseCategory,
    description: 'Hip opening stretch',
    muscleGroups: ['Hips', 'Glutes'],
    equipment: 'Yoga mat',
    difficulty: 'Intermediate',
    instructions: [
      'Start in downward dog',
      'Bring right knee forward',
      'Extend left leg back',
      'Lower hips toward floor'
    ]
  }
];

// Sample workout data
export const workoutsData = [
  {
    id: generateId(),
    name: 'Morning Cardio',
    date: '2024-01-15',
    duration: 30,
    exercises: [
      {
        exerciseId: exercisesData[0].id,
        category: 'Cardio',
        sets: 1,
        reps: null,
        weight: null,
        duration: 20,
        distance: 3.2,
        calories: 250
      },
      {
        exerciseId: exercisesData[2].id,
        category: 'Cardio',
        sets: 3,
        reps: 50,
        weight: null,
        duration: 10,
        distance: null,
        calories: 120
      }
    ],
    caloriesBurned: 370,
    totalCalories: 370,
    notes: 'Great morning workout, felt energized'
  },
  {
    id: generateId(),
    name: 'Strength Training',
    date: '2024-01-14',
    duration: 45,
    exercises: [
      {
        exerciseId: exercisesData[3].id,
        category: 'Strength',
        sets: 3,
        reps: 15,
        weight: null,
        duration: null,
        distance: null,
        calories: 80
      },
      {
        exerciseId: exercisesData[4].id,
        category: 'Strength',
        sets: 3,
        reps: 12,
        weight: null,
        duration: null,
        distance: null,
        calories: 90
      },
      {
        exerciseId: exercisesData[5].id,
        category: 'Strength',
        sets: 3,
        reps: 8,
        weight: 135,
        duration: null,
        distance: null,
        calories: 150
      }
    ],
    caloriesBurned: 320,
    totalCalories: 320,
    notes: 'Increased weight on deadlifts'
  },
  {
    id: generateId(),
    name: 'Yoga Flow',
    date: '2024-01-13',
    duration: 60,
    exercises: [
      {
        exerciseId: exercisesData[6].id,
        category: 'Flexibility',
        sets: 1,
        reps: null,
        weight: null,
        duration: 30,
        distance: null,
        calories: 100
      },
      {
        exerciseId: exercisesData[7].id,
        category: 'Flexibility',
        sets: 1,
        reps: null,
        weight: null,
        duration: 30,
        distance: null,
        calories: 80
      }
    ],
    caloriesBurned: 180,
    totalCalories: 180,
    notes: 'Relaxing evening session'
  }
];

// Sample goals data
export const goalsData = [
  {
    id: generateId(),
    title: 'Run 5K',
    description: 'Complete a 5K run without stopping',
    category: 'Cardio' as ExerciseCategory,
    targetValue: 5,
    currentValue: 3.2,
    unit: 'km',
    targetDate: '2024-03-01',
    createdDate: '2024-01-01',
    status: 'active',
    isCompleted: false,
    priority: 'High'
  },
  {
    id: generateId(),
    title: 'Lose 10 pounds',
    description: 'Reach target weight through consistent exercise',
    category: 'Strength' as ExerciseCategory,
    targetValue: 10,
    currentValue: 4,
    unit: 'lbs',
    targetDate: '2024-04-01',
    createdDate: '2024-01-01',
    status: 'active',
    isCompleted: false,
    priority: 'High'
  },
  {
    id: generateId(),
    title: 'Workout 4x per week',
    description: 'Maintain consistent workout schedule',
    category: 'Strength' as ExerciseCategory,
    targetValue: 16,
    currentValue: 12,
    unit: 'workouts',
    targetDate: '2024-02-01',
    createdDate: '2024-01-01',
    status: 'active',
    isCompleted: false,
    priority: 'Medium'
  },
  {
    id: generateId(),
    title: 'Improve flexibility',
    description: 'Touch toes without bending knees',
    category: 'Flexibility' as ExerciseCategory,
    targetValue: 1,
    currentValue: 0.7,
    unit: 'achievement',
    targetDate: '2024-06-01',
    createdDate: '2024-01-01',
    status: 'active',
    isCompleted: false,
    priority: 'Low'
  }
];

// Sample progress data - now as an array for charts
export const progressData = [
  {
    id: generateId(),
    date: '2024-01-01',
    weight: 180,
    bodyFat: 18.5,
    muscle: 35.2,
    muscleMass: 35.2,
    measurements: {
      chest: 95,
      waist: 82,
      hips: 96,
      biceps: 32,
      thighs: 55
    },
    notes: 'Starting measurements'
  },
  {
    id: generateId(),
    date: '2024-01-08',
    weight: 179,
    bodyFat: 18.2,
    muscle: 35.4,
    muscleMass: 35.4,
    measurements: {
      chest: 95.5,
      waist: 81.5,
      hips: 96,
      biceps: 32.2,
      thighs: 55.2
    },
    notes: 'Good progress this week'
  },
  {
    id: generateId(),
    date: '2024-01-15',
    weight: 178,
    bodyFat: 17.8,
    muscle: 35.8,
    muscleMass: 35.8,
    measurements: {
      chest: 96,
      waist: 81,
      hips: 95.5,
      biceps: 32.5,
      thighs: 55.5
    },
    notes: 'Feeling stronger'
  },
  {
    id: generateId(),
    date: '2024-01-22',
    weight: 176,
    bodyFat: 17.5,
    muscle: 36.2,
    muscleMass: 36.2,
    measurements: {
      chest: 96.5,
      waist: 80.5,
      hips: 95,
      biceps: 33,
      thighs: 56
    },
    notes: 'Great results'
  },
  {
    id: generateId(),
    date: '2024-01-29',
    weight: 175,
    bodyFat: 17.2,
    muscle: 36.5,
    muscleMass: 36.5,
    measurements: {
      chest: 97,
      waist: 80,
      hips: 94.5,
      biceps: 33.2,
      thighs: 56.2
    },
    notes: 'Excellent progress'
  }
];

// User profile data
export const userProfileData = {
  id: generateId(),
  name: 'John Doe',
  email: 'john.doe@example.com',
  age: 28,
  height: 175, // cm
  weight: 175, // lbs
  fitnessLevel: 'Intermediate',
  goals: ['Weight Loss', 'Strength Building'],
  preferences: {
    units: 'metric',
    notifications: true,
    privacy: 'public'
  },
  stats: {
    totalWorkouts: 15,
    totalCaloriesBurned: 5800,
    averageWorkoutDuration: 42,
    longestStreak: 7,
    currentStreak: 3
  },
  achievements: [
    {
      id: generateId(),
      title: 'First Workout',
      description: 'Completed your first workout',
      earnedDate: '2024-01-01',
      icon: '🏃'
    },
    {
      id: generateId(),
      title: 'Week Warrior',
      description: 'Worked out 7 days in a row',
      earnedDate: '2024-01-15',
      icon: '🔥'
    },
    {
      id: generateId(),
      title: 'Calorie Crusher',
      description: 'Burned 1000+ calories in a week',
      earnedDate: '2024-01-08',
      icon: '⚡'
    }
  ]
};

// Dashboard metrics
export const dashboardMetrics = {
  todayWorkouts: 1,
  weeklyWorkouts: 4,
  monthlyWorkouts: 15,
  totalCalories: 5800,
  weeklyCalories: 1200,
  currentStreak: 3,
  longestStreak: 7,
  completedGoals: 0,
  activeGoals: 4,
  favoriteExercise: 'Running',
  averageWorkoutDuration: 42
};

// Equipment list
export const equipmentList = [
  'None',
  'Dumbbells',
  'Barbell',
  'Resistance Bands',
  'Yoga Mat',
  'Jump Rope',
  'Kettlebell',
  'Pull-up Bar',
  'Bicycle',
  'Treadmill',
  'Foam Roller',
  'Medicine Ball',
  'Stability Ball',
  'Cable Machine',
  'Bench'
];

// Muscle groups
export const muscleGroups = [
  'Chest',
  'Back',
  'Shoulders',
  'Arms',
  'Core',
  'Legs',
  'Glutes',
  'Calves',
  'Forearms',
  'Neck'
];

// Difficulty levels
export const difficultyLevels = [
  'Beginner',
  'Intermediate',
  'Advanced',
  'Expert'
];

// Workout templates
export const workoutTemplates = [
  {
    id: generateId(),
    name: 'Full Body Beginner',
    description: 'Complete full body workout for beginners',
    duration: 30,
    exercises: [
      { exerciseId: exercisesData[3].id, sets: 2, reps: 10 },
      { exerciseId: exercisesData[4].id, sets: 2, reps: 12 },
      { exerciseId: exercisesData[6].id, sets: 1, duration: 15 }
    ]
  },
  {
    id: generateId(),
    name: 'Cardio Blast',
    description: 'High-intensity cardio workout',
    duration: 25,
    exercises: [
      { exerciseId: exercisesData[0].id, sets: 1, duration: 15 },
      { exerciseId: exercisesData[2].id, sets: 3, reps: 30 }
    ]
  },
  {
    id: generateId(),
    name: 'Strength Builder',
    description: 'Focus on building strength',
    duration: 45,
    exercises: [
      { exerciseId: exercisesData[3].id, sets: 3, reps: 12 },
      { exerciseId: exercisesData[4].id, sets: 3, reps: 15 },
      { exerciseId: exercisesData[5].id, sets: 3, reps: 8 }
    ]
  }
];

// Helper functions for data manipulation
export const getExercisesByCategory = (category: ExerciseCategory) => {
  return exercisesData.filter(exercise => exercise.category === category);
};

export const getWorkoutsByDateRange = (startDate: Date, endDate: Date) => {
  return workoutsData.filter(workout => 
    new Date(workout.date) >= startDate && new Date(workout.date) <= endDate
  );
};

export const getActiveGoals = () => {
  return goalsData.filter(goal => !goal.isCompleted);
};

export const getCompletedGoals = () => {
  return goalsData.filter(goal => goal.isCompleted);
};

export const getTotalCaloriesBurned = () => {
  return workoutsData.reduce((total, workout) => total + (workout.caloriesBurned || workout.totalCalories || 0), 0);
};

export const getAverageWorkoutDuration = () => {
  if (workoutsData.length === 0) return 0;
  const totalDuration = workoutsData.reduce((total, workout) => total + workout.duration, 0);
  return Math.round(totalDuration / workoutsData.length);
};

export const getWorkoutFrequency = () => {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const recentWorkouts = getWorkoutsByDateRange(oneWeekAgo, now);
  return recentWorkouts.length;
};

export const getMostUsedExercise = () => {
  const exerciseCount: { [key: string]: number } = {};
  
  workoutsData.forEach(workout => {
    workout.exercises.forEach(exercise => {
      exerciseCount[exercise.exerciseId] = (exerciseCount[exercise.exerciseId] || 0) + 1;
    });
  });
  
  const mostUsedId = Object.keys(exerciseCount).reduce((a, b) => 
    exerciseCount[a] > exerciseCount[b] ? a : b, ''
  );
  
  return exercisesData.find(exercise => exercise.id === mostUsedId)?.name || 'None';
};