// App.jsx
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";
import LandingPage from "./pages/landingPage";
import HomePage from "./pages/HomePage";
import VerifyPage from "./pages/VerifyPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        {!currentUser && (
          <Route path="/" element={<LandingPage onLogin={setCurrentUser} />} />
        )}

        {/* Protected Routes */}
        {currentUser && (
          <Route element={<Layout currentUser={currentUser} setCurrentUser={setCurrentUser} />}>
            <Route index element={<Navigate to="/home" />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/verify" element={<VerifyPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/home" />} />
          </Route>
        )}
      </Routes>
    </Router>
  );
}

export default App;



