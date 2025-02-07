import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-forest">
          SeismicWatch
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/app" className="text-forest/90 hover:text-forest transition-colors">
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
        <Button className="bg-forest hover:bg-forest/90 text-white font-medium">
          Get started
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;