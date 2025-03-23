
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LogOut, User } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  // Function to determine if a nav link is active
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-indigo-900">
          TerraAlert
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={`${isActive('/') 
              ? 'text-indigo-700 font-medium' 
              : 'text-indigo-600/80 hover:text-indigo-700'} transition-colors`}
          >
            Dashboard
          </Link>
          <Link 
            to="/map" 
            className={`${isActive('/map') 
              ? 'text-indigo-700 font-medium' 
              : 'text-indigo-600/80 hover:text-indigo-700'} transition-colors`}
          >
            Map
          </Link>
          <Link 
            to="/alerts" 
            className={`${isActive('/alerts') 
              ? 'text-indigo-700 font-medium' 
              : 'text-indigo-600/80 hover:text-indigo-700'} transition-colors`}
          >
            Alerts
          </Link>
          <Link 
            to="/about" 
            className={`${isActive('/about') 
              ? 'text-indigo-700 font-medium' 
              : 'text-indigo-600/80 hover:text-indigo-700'} transition-colors`}
          >
            About
          </Link>
        </div>
        {user ? (
          <div className="flex items-center space-x-4">
            <div className="text-indigo-700">
              <User className="inline-block mr-1" size={16} />
              {user.name}
            </div>
            <Button 
              onClick={logout}
              variant="outline" 
              size="sm"
              className="flex items-center border-indigo-200 hover:bg-indigo-50"
            >
              <LogOut className="mr-1" size={16} />
              Logout
            </Button>
          </div>
        ) : (
          <Link to="/auth">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium">
              Get started
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
