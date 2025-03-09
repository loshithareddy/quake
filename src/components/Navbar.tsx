
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LogOut, User } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-forest">
          SeismicWatch
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-forest/90 hover:text-forest transition-colors">
            Dashboard
          </Link>
          <Link to="/map" className="text-forest/90 hover:text-forest transition-colors">
            Map
          </Link>
          <Link to="/alerts" className="text-forest/90 hover:text-forest transition-colors">
            Alerts
          </Link>
          <Link to="/about" className="text-forest/90 hover:text-forest transition-colors">
            About
          </Link>
        </div>
        {user ? (
          <div className="flex items-center space-x-4">
            <div className="text-forest">
              <User className="inline-block mr-1" size={16} />
              {user.name}
            </div>
            <Button 
              onClick={logout}
              variant="outline" 
              size="sm"
              className="flex items-center"
            >
              <LogOut className="mr-1" size={16} />
              Logout
            </Button>
          </div>
        ) : (
          <Link to="/auth">
            <Button className="bg-forest hover:bg-forest/90 text-white font-medium">
              Get started
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
