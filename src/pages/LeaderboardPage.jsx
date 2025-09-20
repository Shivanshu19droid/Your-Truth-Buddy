import React, { useState, useEffect } from "react";
import { User } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Trophy, Medal, Award, Crown, MapPin, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LeaderboardPage() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("monthly");

  useEffect(() => {
    loadLeaderboardData();
  }, []);

  const loadLeaderboardData = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
    } catch (error) {
      console.log("User not logged in");
    }

    const allUsers = await User.list();
    const sortedUsers = allUsers
      .filter(u => (u.points || 0) > 0 && u.nickname)
      .sort((a, b) => (b.points || 0) - (a.points || 0));
    setUsers(sortedUsers);
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Award className="w-6 h-6 text-amber-600" />;
      default: return <div className="w-6 h-6 flex items-center justify-center text-gray-500 font-bold">{rank}</div>;
    }
  };

  const getRankBadgeColor = (rank) => {
    switch (rank) {
      case 1: return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
      case 2: return "bg-gradient-to-r from-gray-400 to-gray-600 text-white";
      case 3: return "bg-gradient-to-r from-amber-400 to-amber-600 text-white";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getRegionalUsers = () => {
    if (!currentUser?.city) return [];
    return users.filter(u => u.city && u.city.toLowerCase() === currentUser.city.toLowerCase());
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          Leaderboard
        </h1>
        <p className="text-gray-600 text-lg">
          Compete with learners worldwide and in your region
        </p>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex justify-center">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-purple-50 border border-purple-200">
            <TabsTrigger 
              value="monthly" 
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Global
            </TabsTrigger>
            <TabsTrigger 
              value="regional"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Regional
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="monthly" className="space-y-6">
          <Card className="shadow-xl border-purple-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-purple-600" />
                Global Rankings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <AnimatePresence mode="wait">
                  {users.slice(0, 10).map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 ${
                        currentUser?.id === user.id 
                          ? 'bg-purple-50 border-purple-300 shadow-md' 
                          : 'bg-white border-gray-200 hover:border-purple-200 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <Badge className={getRankBadgeColor(index + 1)}>
                          #{index + 1}
                        </Badge>
                        {getRankIcon(index + 1)}
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full flex items-center justify-center">
                            <span className="font-bold text-white">
                              {user.nickname?.[0]?.toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {user.nickname || 'Anonymous'}
                              {currentUser?.id === user.id && (
                                <Badge className="ml-2 bg-purple-100 text-purple-700">You</Badge>
                              )}
                            </p>
                            {user.city && (
                              <p className="text-sm text-gray-500 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {user.city}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <span className="font-bold text-lg text-gray-800">
                          {user.points || 0}
                        </span>
                        <span className="text-sm text-gray-500">pts</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {users.length === 0 && (
                  <div className="text-center py-12">
                    <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-500 mb-2">No Rankings Yet</h3>
                    <p className="text-gray-400">Be the first to earn points and claim the top spot!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regional" className="space-y-6">
          <Card className="shadow-xl border-purple-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-6 h-6 text-purple-600" />
                Regional Rankings
                {currentUser?.city && (
                  <Badge className="bg-purple-100 text-purple-700">
                    {currentUser.city}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!currentUser?.city ? (
                <div className="text-center py-12">
                  <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-500 mb-2">Set Your Location</h3>
                  <p className="text-gray-400 mb-4">Add your city in your profile to see regional rankings</p>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Update Profile
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence mode="wait">
                    {getRegionalUsers().slice(0, 10).map((user, index) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 ${
                          currentUser?.id === user.id 
                            ? 'bg-purple-50 border-purple-300 shadow-md' 
                            : 'bg-white border-gray-200 hover:border-purple-200 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <Badge className={getRankBadgeColor(index + 1)}>
                            #{index + 1}
                          </Badge>
                          {getRankIcon(index + 1)}
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full flex items-center justify-center">
                              <span className="font-bold text-white">
                                {user.nickname?.[0]?.toUpperCase() || 'U'}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">
                                {user.nickname || 'Anonymous'}
                                {currentUser?.id === user.id && (
                                  <Badge className="ml-2 bg-purple-100 text-purple-700">You</Badge>
                                )}
                              </p>
                              <p className="text-sm text-gray-500 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {user.city}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-5 h-5 text-yellow-500" />
                          <span className="font-bold text-lg text-gray-800">
                            {user.points || 0}
                          </span>
                          <span className="text-sm text-gray-500">pts</span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {getRegionalUsers().length === 0 && (
                    <div className="text-center py-12">
                      <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-500 mb-2">No Regional Players</h3>
                      <p className="text-gray-400">Be the first player from {currentUser.city}!</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
