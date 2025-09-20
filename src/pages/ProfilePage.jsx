import React, { useState, useEffect } from "react";
import { User } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User as UserIcon,
  MapPin,
  Star,
  Trophy,
  Flame,
  Linkedin,
  Instagram,
  Twitter,
  Github,
  Save,
  Award,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";

const avatarOptions = [
  "😊", "🚀", "🎯", "🌟", "🎨", "📚", "🔥", "⚡", "🏆", "💎",
  "🦄", "🎪", "🎭", "🎸", "🎲", "🎳", "🎱", "🎮", "🎯", "🎪"
];

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    nickname: "",
    avatar: "😊",
    full_name: "",
    city: "",
    pin_code: "",
    linkedin_url: "",
    instagram_url: "",
    twitter_url: "",
    github_url: ""
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState('');
  const [saveMessageType, setSaveMessageType] = useState(''); // 'success' or 'error'

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
      setFormData({
        nickname: user.nickname || "",
        avatar: user.avatar || "😊",
        full_name: user.full_name || "",
        city: user.city || "",
        pin_code: user.pin_code || "",
        linkedin_url: user.linkedin_url || "",
        instagram_url: user.instagram_url || "",
        twitter_url: user.twitter_url || "",
        github_url: user.github_url || ""
      });
    } catch (error) {
      console.log("User not logged in");
    }
    setIsLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!formData.nickname.trim()) return;

    setIsSaving(true);
    setSaveMessage('');

    try {
      console.log('Saving profile data:', formData);
      const result = await User.updateMyUserData(formData);

      if (result) {
        // Update the current user state with the returned data
        setCurrentUser(result);

        // Update form data to reflect any server-side changes
        setFormData({
          nickname: result.nickname || "",
          avatar: result.avatar || "😊",
          full_name: result.full_name || "",
          city: result.city || "",
          pin_code: result.pin_code || "",
          linkedin_url: result.linkedin_url || "",
          instagram_url: result.instagram_url || "",
          twitter_url: result.twitter_url || "",
          github_url: result.github_url || ""
        });

        setSaveMessage('Profile saved successfully!');
        setSaveMessageType('success');

        // Clear message after 3 seconds
        setTimeout(() => {
          setSaveMessage('');
        }, 3000);
      } else {
        throw new Error('Failed to save profile');
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      setSaveMessage('Failed to save profile. Please try again.');
      setSaveMessageType('error');

      // Clear message after 5 seconds
      setTimeout(() => {
        setSaveMessage('');
      }, 5000);
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          My Profile
        </h1>
        <p className="text-gray-600 text-lg">
          Customize your profile and track your progress
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stats Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-xl border-purple-100">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">{currentUser?.avatar || "😊"}</span>
              </div>
              <CardTitle className="text-xl">{currentUser?.nickname || "Anonymous"}</CardTitle>
              {currentUser?.city && (
                <p className="text-gray-500 flex items-center justify-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {currentUser.city}
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <Star className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-purple-800">{currentUser?.points || 0}</div>
                  <div className="text-xs text-purple-600">Points</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <Flame className="w-6 h-6 text-orange-600 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-orange-800">{currentUser?.current_streak || 0}</div>
                  <div className="text-xs text-orange-600">Day Streak</div>
                </div>
              </div>
              
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <Trophy className="w-6 h-6 text-green-600 mx-auto mb-1" />
                <div className="text-lg font-bold text-green-800">Beginner</div>
                <div className="text-xs text-green-600">Current Level</div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress to next level</span>
                  <span className="text-purple-600">75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full" style={{width: '75%'}}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Profile Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="shadow-xl border-purple-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="w-6 h-6 text-purple-600" />
                Edit Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Selection */}
              <div className="space-y-3">
                <Label>Choose Avatar</Label>
                <div className="grid grid-cols-10 gap-2">
                  {avatarOptions.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleInputChange('avatar', emoji)}
                      className={`w-10 h-10 text-xl rounded-lg border-2 transition-all ${
                        formData.avatar === emoji 
                          ? 'border-purple-400 bg-purple-50' 
                          : 'border-gray-200 hover:border-purple-200'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nickname">Nickname *</Label>
                  <Input
                    id="nickname"
                    value={formData.nickname}
                    onChange={(e) => handleInputChange('nickname', e.target.value)}
                    placeholder="Your display name"
                    className="border-gray-200 focus:border-purple-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    placeholder="Your full name"
                    className="border-gray-200 focus:border-purple-400"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Your city"
                    className="border-gray-200 focus:border-purple-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pin_code">PIN Code</Label>
                  <Input
                    id="pin_code"
                    value={formData.pin_code}
                    onChange={(e) => handleInputChange('pin_code', e.target.value)}
                    placeholder="Your PIN code"
                    className="border-gray-200 focus:border-purple-400"
                  />
                </div>
              </div>

              <Separator />

              {/* Social Links */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Social Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedin_url" className="flex items-center gap-2">
                      <Linkedin className="w-4 h-4 text-blue-600" />
                      LinkedIn
                    </Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 border border-r-0 border-gray-200 rounded-l-md">
                        linkedin.com/in/
                      </span>
                      <Input
                        id="linkedin_url"
                        value={formData.linkedin_url}
                        onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                        placeholder="username"
                        className="border-gray-200 focus:border-purple-400 rounded-l-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter_url" className="flex items-center gap-2">
                      <Twitter className="w-4 h-4 text-blue-400" />
                      Twitter
                    </Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 border border-r-0 border-gray-200 rounded-l-md">
                        twitter.com/
                      </span>
                      <Input
                        id="twitter_url"
                        value={formData.twitter_url}
                        onChange={(e) => handleInputChange('twitter_url', e.target.value)}
                        placeholder="username"
                        className="border-gray-200 focus:border-purple-400 rounded-l-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram_url" className="flex items-center gap-2">
                      <Instagram className="w-4 h-4 text-pink-600" />
                      Instagram
                    </Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 border border-r-0 border-gray-200 rounded-l-md">
                        instagram.com/
                      </span>
                      <Input
                        id="instagram_url"
                        value={formData.instagram_url}
                        onChange={(e) => handleInputChange('instagram_url', e.target.value)}
                        placeholder="username"
                        className="border-gray-200 focus:border-purple-400 rounded-l-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="github_url" className="flex items-center gap-2">
                      <Github className="w-4 h-4 text-gray-800" />
                      GitHub
                    </Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 border border-r-0 border-gray-200 rounded-l-md">
                        github.com/
                      </span>
                      <Input
                        id="github_url"
                        value={formData.github_url}
                        onChange={(e) => handleInputChange('github_url', e.target.value)}
                        placeholder="username"
                        className="border-gray-200 focus:border-purple-400 rounded-l-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Message */}
              {saveMessage && (
                <div className={`p-4 rounded-lg mb-4 ${
                  saveMessageType === 'success'
                    ? 'bg-green-50 border border-green-200 text-green-800'
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                  <div className="flex items-center gap-2">
                    {saveMessageType === 'success' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <AlertCircle className="w-5 h-5" />
                    )}
                    <span className="font-medium">{saveMessage}</span>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleSave}
                  disabled={isSaving || !formData.nickname}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Profile
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
