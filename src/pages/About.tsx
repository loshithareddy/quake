
import { CircleUser, Cpu, Mail, MapPin, Phone, Shield, Clock, Globe } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const About = () => {
  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-[#F5F7FA] via-[#E4ECF7] to-[#C3CFE2]">
      <div className="container mx-auto p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-indigo-900 mb-2">About SeismicWatch</h1>
          <p className="text-indigo-700 mb-8">Real-time earthquake monitoring for India</p>
          
          <div className="bg-white/80 rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-indigo-800 mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-4">
              SeismicWatch is dedicated to providing accurate, real-time earthquake information to the people of India. 
              Our platform integrates data from multiple seismic monitoring sources to deliver timely alerts and 
              comprehensive analysis of seismic activity across the region.
            </p>
            <p className="text-gray-700">
              We believe that access to reliable earthquake information can save lives and help communities prepare for 
              and respond to seismic events. Our goal is to make this critical data accessible to everyone, 
              from emergency response teams to ordinary citizens.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-indigo-800">
                  <Cpu className="mr-2 h-5 w-5 text-indigo-600" />
                  Data Sources
                </CardTitle>
                <CardDescription>
                  Our earthquake data is collected from multiple authoritative sources
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm"><span className="font-medium">IMD:</span> India Meteorological Department</p>
                <p className="text-sm"><span className="font-medium">NCS:</span> National Center for Seismology</p>
                <p className="text-sm"><span className="font-medium">USGS:</span> United States Geological Survey</p>
                <p className="text-sm"><span className="font-medium">EMSC:</span> European-Mediterranean Seismological Centre</p>
                <p className="text-sm"><span className="font-medium">IRIS:</span> Incorporated Research Institutions for Seismology</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-indigo-800">
                  <Shield className="mr-2 h-5 w-5 text-indigo-600" />
                  How We Help
                </CardTitle>
                <CardDescription>
                  Services provided by SeismicWatch
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm"><span className="font-medium">Real-time Monitoring:</span> 24/7 tracking of seismic activity</p>
                <p className="text-sm"><span className="font-medium">Instant Alerts:</span> Immediate notifications of significant earthquakes</p>
                <p className="text-sm"><span className="font-medium">Historical Analysis:</span> Compare current events with past patterns</p>
                <p className="text-sm"><span className="font-medium">Interactive Map:</span> Visualize earthquake data geographically</p>
                <p className="text-sm"><span className="font-medium">Safety Information:</span> Guidance on earthquake preparedness</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-white/80 rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-indigo-800 mb-4">Technical Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="flex items-center text-lg font-medium text-indigo-700 mb-3">
                  <Clock className="mr-2 h-5 w-5 text-indigo-600" />
                  Data Updates
                </h3>
                <p className="text-gray-700 text-sm mb-4">
                  Our system fetches new earthquake data every 5 minutes, ensuring you have the most current information available.
                  For significant events (magnitude 4.5+), we expedite this process to provide alerts as quickly as possible.
                </p>
                <h3 className="flex items-center text-lg font-medium text-indigo-700 mb-3">
                  <Cpu className="mr-2 h-5 w-5 text-indigo-600" />
                  Analysis Methods
                </h3>
                <p className="text-gray-700 text-sm">
                  We use advanced algorithms to process and analyze seismic data, including magnitude classification,
                  depth analysis, and geographic correlation. This helps us provide context for seismic events and
                  identify patterns that may indicate increased risk.
                </p>
              </div>
              <div>
                <h3 className="flex items-center text-lg font-medium text-indigo-700 mb-3">
                  <Globe className="mr-2 h-5 w-5 text-indigo-600" />
                  Coverage Area
                </h3>
                <p className="text-gray-700 text-sm mb-4">
                  While we focus primarily on India and surrounding regions, our platform tracks significant 
                  seismic events worldwide. Our most detailed coverage is for the Indian subcontinent,
                  including Pakistan, Nepal, Bangladesh, Bhutan, Myanmar, and Sri Lanka.
                </p>
                <h3 className="flex items-center text-lg font-medium text-indigo-700 mb-3">
                  <Shield className="mr-2 h-5 w-5 text-indigo-600" />
                  Data Reliability
                </h3>
                <p className="text-gray-700 text-sm">
                  By aggregating data from multiple authoritative sources, we're able to cross-verify
                  earthquake information for greater accuracy. Initial reports are marked as preliminary
                  until confirmed by at least two sources.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-indigo-800 mb-4">Contact Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start">
                <Mail className="mt-1 mr-3 h-5 w-5 text-indigo-600 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-medium text-indigo-700">Email</h3>
                  <p className="text-gray-700">info@seismicwatch.in</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="mt-1 mr-3 h-5 w-5 text-indigo-600 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-medium text-indigo-700">Phone</h3>
                  <p className="text-gray-700">+91 98765 43210</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="mt-1 mr-3 h-5 w-5 text-indigo-600 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-medium text-indigo-700">Address</h3>
                  <p className="text-gray-700">Delhi, India</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
