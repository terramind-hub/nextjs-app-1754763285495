'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { userProfileData, workoutsData, goalsData, progressData } from '@/lib/data';
import { formatDate, formatNumber, calculateBMI, getBMICategory, isValidEmail, generateId } from '@/lib/utils';
import { User, Edit, Save, Camera, Mail, Phone, MapPin, Calendar, Target, Activity, TrendingUp, Award, Settings, Shield, Bell, Palette, Download, Upload, Trash2, Eye, EyeOff } from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  height: number; // cm
  weight: number; // kg
  activityLevel: string;
  fitnessGoals: string[];
  profileImage: string;
  joinDate: string;
  location: string;
  bio: string;
  preferences: {
    units: 'metric' | 'imperial';
    notifications: boolean;
    privacy: 'public' | 'friends' | 'private';
    theme: 'light' | 'dark' | 'auto';
  };
  achievements: string[];
  socialLinks: {
    instagram?: string;
    twitter?: string;
    strava?: string;
  };
}

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  height: string;
  weight: string;
  activityLevel: string;
  location: string;
  bio: string;
}

interface PreferencesData {
  units: 'metric' | 'imperial';
  notifications: boolean;
  privacy: 'public' | 'friends' | 'private';
  theme: 'light' | 'dark' | 'auto';
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(userProfileData);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState<ProfileFormData>({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    dateOfBirth: profile.dateOfBirth,
    gender: profile.gender,
    height: profile.height.toString(),
    weight: profile.weight.toString(),
    activityLevel: profile.activityLevel,
    location: profile.location,
    bio: profile.bio,
  });

  const [preferences, setPreferences] = useState<PreferencesData>(profile.preferences);

  // Calculate profile statistics
  const profileStats = useMemo(() => {
    const totalWorkouts = workoutsData.length;
    const totalGoals = goalsData.length;
    const completedGoals = goalsData.filter(goal => goal.status === 'completed').length;
    const currentWeight = progressData
      .filter(entry => entry.type === 'weight')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.value || profile.weight;
    
    const bmi = calculateBMI(profile.height, currentWeight);
    const bmiCategory = getBMICategory(bmi);
    
    const memberSince = new Date(profile.joinDate);
    const now = new Date();
    const membershipDays = Math.floor((now.getTime() - memberSince.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      totalWorkouts,
      totalGoals,
      completedGoals,
      goalCompletionRate: totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0,
      currentWeight,
      bmi: Math.round(bmi * 10) / 10,
      bmiCategory,
      membershipDays,
    };
  }, [profile, workoutsData, goalsData, progressData]);

  const handleSaveProfile = () => {
    const updatedProfile: UserProfile = {
      ...profile,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      height: parseFloat(formData.height),
      weight: parseFloat(formData.weight),
      activityLevel: formData.activityLevel,
      location: formData.location,
      bio: formData.bio,
    };
    
    setProfile(updatedProfile);
    setIsEditing(false);
  };

  const handleSavePreferences = () => {
    const updatedProfile: UserProfile = {
      ...profile,
      preferences,
    };
    
    setProfile(updatedProfile);
  };

  const handleCancelEdit = () => {
    setFormData({
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      dateOfBirth: profile.dateOfBirth,
      gender: profile.gender,
      height: profile.height.toString(),
      weight: profile.weight.toString(),
      activityLevel: profile.activityLevel,
      location: profile.location,
      bio: profile.bio,
    });
    setIsEditing(false);
  };

  const getActivityLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'sedentary': return 'bg-gray-500';
      case 'lightly active': return 'bg-blue-500';
      case 'moderately active': return 'bg-green-500';
      case 'very active': return 'bg-orange-500';
      case 'extremely active': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getBMIColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'underweight': return 'text-blue-600';
      case 'normal weight': return 'text-green-600';
      case 'overweight': return 'text-orange-600';
      case 'obese': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const activityLevels = [
    'Sedentary',
    'Lightly Active',
    'Moderately Active',
    'Very Active',
    'Extremely Active'
  ];

  const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Profile Header */}
        <div className="lg:w-1/3">
          <Card>
            <CardHeader className="text-center">
              <div className="relative mx-auto w-32 h-32 mb-4">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                  {profile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              <CardTitle className="text-2xl">{profile.name}</CardTitle>
              <CardDescription className="flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" />
                {profile.email}
              </CardDescription>
              {profile.location && (
                <CardDescription className="flex items-center justify-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {profile.location}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{profileStats.totalWorkouts}</div>
                  <div className="text-sm text-muted-foreground">Workouts</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{profileStats.completedGoals}</div>
                  <div className="text-sm text-muted-foreground">Goals Achieved</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Goal Completion</span>
                  <span>{profileStats.goalCompletionRate}%</span>
                </div>
                <Progress value={profileStats.goalCompletionRate} className="h-2" />
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  Member for {profileStats.membershipDays} days
                </div>
              </div>

              {profile.achievements.length > 0 && (
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Recent Achievements
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {profile.achievements.slice(0, 3).map((achievement, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {achievement}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Profile Content */}
        <div className="lg:w-2/3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Health Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Health Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{profile.height} cm</div>
                      <div className="text-sm text-muted-foreground">Height</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{profileStats.currentWeight} kg</div>
                      <div className="text-sm text-muted-foreground">Weight</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${getBMIColor(profileStats.bmiCategory)}`}>
                        {profileStats.bmi}
                      </div>
                      <div className="text-sm text-muted-foreground">BMI</div>
                    </div>
                    <div className="text-center">
                      <Badge className={getActivityLevelColor(profile.activityLevel)}>
                        {profile.activityLevel}
                      </Badge>
                      <div className="text-sm text-muted-foreground mt-1">Activity Level</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Fitness Goals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Fitness Goals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.fitnessGoals.map((goal, index) => (
                      <Badge key={index} variant="outline">
                        {goal}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Bio */}
              {profile.bio && (
                <Card>
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{profile.bio}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details and profile information</CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} variant="outline">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={handleSaveProfile} size="sm">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button onClick={handleCancelEdit} variant="outline" size="sm">
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value) => setFormData({ ...formData, gender: value })}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {genderOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        value={formData.height}
                        onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="activityLevel">Activity Level</Label>
                      <Select
                        value={formData.activityLevel}
                        onValueChange={(value) => setFormData({ ...formData, activityLevel: value })}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {activityLevels.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      disabled={!isEditing}
                      rows={3}
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Preferences
                  </CardTitle>
                  <CardDescription>Customize your app experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Units</Label>
                      <p className="text-sm text-muted-foreground">Choose your preferred measurement system</p>
                    </div>
                    <Select
                      value={preferences.units}
                      onValueChange={(value: 'metric' | 'imperial') => {
                        setPreferences({ ...preferences, units: value });
                        handleSavePreferences();
                      }}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="metric">Metric</SelectItem>
                        <SelectItem value="imperial">Imperial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Theme</Label>
                      <p className="text-sm text-muted-foreground">Choose your preferred color theme</p>
                    </div>
                    <Select
                      value={preferences.theme}
                      onValueChange={(value: 'light' | 'dark' | 'auto') => {
                        setPreferences({ ...preferences, theme: value });
                        handleSavePreferences();
                      }}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="auto">Auto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive workout reminders and updates</p>
                    </div>
                    <Button
                      variant={preferences.notifications ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setPreferences({ ...preferences, notifications: !preferences.notifications });
                        handleSavePreferences();
                      }}
                    >
                      <Bell className="w-4 h-4 mr-2" />
                      {preferences.notifications ? 'On' : 'Off'}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Privacy</Label>
                      <p className="text-sm text-muted-foreground">Control who can see your profile</p>
                    </div>
                    <Select
                      value={preferences.privacy}
                      onValueChange={(value: 'public' | 'friends' | 'private') => {
                        setPreferences({ ...preferences, privacy: value });
                        handleSavePreferences();
                      }}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="friends">Friends</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Data Management</CardTitle>
                  <CardDescription>Export or delete your data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Export Data</Label>
                      <p className="text-sm text-muted-foreground">Download all your fitness data</p>
                    </div>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Import Data</Label>
                      <p className="text-sm text-muted-foreground">Import data from other fitness apps</p>
                    </div>
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Import
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>Manage your account security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter current password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="Enter new password"
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm new password"
                      />
                    </div>
                    <Button>Update Password</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">Danger Zone</CardTitle>
                  <CardDescription>Irreversible actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                    <div>
                      <Label className="text-base text-red-600">Delete Account</Label>
                      <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Account
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Are you absolutely sure?</DialogTitle>
                          <DialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove all your data from our servers.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline">Cancel</Button>
                          <Button variant="destructive">Delete Account</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}