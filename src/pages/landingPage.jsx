// LandingPage.jsx
import GoogleLogin from "../components/loginButton";

export default function LandingPage({ onLogin }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
      <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
        Welcome to Your Truth Buddy
      </h1>
      <p className="text-gray-600 max-w-md mb-6">
        A gamified learning platform that helps you verify facts, track your streak, and learn in an engaging way.
      </p>
      <GoogleLogin onLogin={onLogin} /> {/* ✅ passes down */}
    </div>
  );
}

