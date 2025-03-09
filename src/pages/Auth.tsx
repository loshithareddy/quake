
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navigate } from "react-router-dom";
import { AlertTriangle, Shield } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, isLoading, login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      await login(email, password);
    } else {
      await register(name, email, password);
    }
  };

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#FDE1D3] via-[#E5DEFF] to-[#1EAEDB]">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-xl">
        <div className="text-center">
          <Shield className="w-12 h-12 mx-auto text-forest" />
          <h1 className="mt-4 text-3xl font-bold text-forest">
            {isLogin ? "Sign In" : "Create Account"}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin
              ? "Sign in to access your earthquake alerts"
              : "Register to receive earthquake alerts"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {!isLogin && (
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1"
                placeholder="John Doe"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1"
              placeholder="••••••••"
            />
          </div>

          <div>
            <Button
              type="submit"
              className="w-full bg-forest hover:bg-forest-light text-white"
              disabled={isLoading}
            >
              {isLoading
                ? "Processing..."
                : isLogin
                ? "Sign In"
                : "Create Account"}
            </Button>
          </div>
        </form>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-forest hover:underline"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>

        <div className="mt-6 p-4 border border-yellow-300 bg-yellow-50 rounded-md">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
            <p className="text-sm text-yellow-700">
              This is a demo application. Authentication data is not persistent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
