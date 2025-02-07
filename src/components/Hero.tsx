import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";

const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-4">
      <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="flex items-center gap-2 seismic-card">
            <Star className="w-4 h-4 text-forest" />
            <span className="text-forest text-sm font-medium">Seismic Activity Monitor</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight text-forest">
            Track
            <br />
            Earthquakes
            <br />
            in Real-time
          </h1>
          <p className="text-lg text-forest/80 max-w-md">
            Monitor seismic activity across India with our real-time earthquake tracking system.
          </p>
          <div className="flex items-center gap-4">
            <Button className="bg-forest hover:bg-forest/90 text-white font-medium px-8 py-6 text-lg">
              View Map <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" className="border-forest text-forest hover:bg-forest/10">
              Learn More
            </Button>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-0.5 bg-forest/20 rounded-2xl blur opacity-30" />
          <div className="seismic-card h-[400px] relative">
            <img
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
              alt="Seismic monitoring"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div className="absolute -bottom-10 -left-10 seismic-card">
            <p className="text-forest text-4xl font-bold">24/7</p>
            <p className="text-forest/80">Active monitoring</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;