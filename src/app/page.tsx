import { Metadata } from 'next'
import DashboardCards from '@/components/DashboardCards'
import ProgressCharts from '@/components/ProgressCharts'
import GoalTracker from '@/components/GoalTracker'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { workoutsData, getActiveGoals, getMostUsedExercise } from '@/lib/data'
import { formatDate, formatDuration } from '@/lib/utils'
import { Activity, TrendingUp, Target, Calendar, Dumbbell, Plus } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Fitness Tracker - Dashboard',
  description: 'Track your fitness journey with comprehensive workout logging, progress monitoring, and goal achievement.',
}

export default function HomePage() {
  const recentWorkouts = workoutsData.slice(0, 3)
  const activeGoals = getActiveGoals()
  const mostUsedExercise = getMostUsedExercise()

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
          <p className="text-muted-foreground">
            Here's an overview of your fitness journey
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/workouts">
              <Plus className="mr-2 h-4 w-4" />
              Log Workout
            </Link>
          </Button>
        </div>
      </div>

      {/* Dashboard Metrics */}
      <DashboardCards />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Workouts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Recent Workouts</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            {recentWorkouts.length > 0 ? (
              <>
                {recentWorkouts.map((workout) => (
                  <div
                    key={workout.id}
                    className="flex items-center justify-between space-x-4 rounded-lg border p-3"
                  >
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {workout.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(workout.date)} • {formatDuration(workout.duration)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {workout.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {workout.caloriesBurned} cal
                      </span>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/workouts">
                    View All Workouts
                  </Link>
                </Button>
              </>
            ) : (
              <div className="text-center py-6">
                <Dumbbell className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-semibold">No workouts yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Start your fitness journey by logging your first workout.
                </p>
                <Button className="mt-4" asChild>
                  <Link href="/workouts">
                    <Plus className="mr-2 h-4 w-4" />
                    Log First Workout
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Goals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Active Goals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            {activeGoals.length > 0 ? (
              <>
                {activeGoals.slice(0, 3).map((goal) => (
                  <div
                    key={goal.id}
                    className="flex items-center justify-between space-x-4 rounded-lg border p-3"
                  >
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {goal.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Target: {goal.targetValue} {goal.unit}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={goal.priority === 'high' ? 'destructive' : goal.priority === 'medium' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {goal.priority}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {Math.round((goal.currentValue / goal.targetValue) * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/goals">
                    View All Goals
                  </Link>
                </Button>
              </>
            ) : (
              <div className="text-center py-6">
                <Target className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-semibold">No active goals</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Set your first fitness goal to stay motivated.
                </p>
                <Button className="mt-4" asChild>
                  <Link href="/goals">
                    <Plus className="mr-2 h-4 w-4" />
                    Set First Goal
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Progress Charts Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Progress Overview
          </CardTitle>
          <CardDescription>
            Your fitness progress over the last 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProgressCharts timeRange="30d" />
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workoutsData.filter(w => {
                const workoutDate = new Date(w.date)
                const weekStart = new Date()
                weekStart.setDate(weekStart.getDate() - weekStart.getDay())
                return workoutDate >= weekStart
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              workouts completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorite Exercise</CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mostUsedExercise?.name || 'None'}
            </div>
            <p className="text-xs text-muted-foreground">
              most frequently used
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goal Progress</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeGoals.length > 0 
                ? Math.round(activeGoals.reduce((acc, goal) => acc + (goal.currentValue / goal.targetValue), 0) / activeGoals.length * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              average completion
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Goal Tracker Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Goal Tracker
          </CardTitle>
          <CardDescription>
            Monitor your fitness goals and achievements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GoalTracker showCreateButton={false} />
        </CardContent>
      </Card>
    </div>
  )
}