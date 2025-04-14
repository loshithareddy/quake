
import { AlertTriangle, Info, Shield, Database, Phone, MapPin, Globe, Activity, GitMerge, Clock, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AboutPage = () => {
  const features = [
    {
      icon: <Activity className="h-10 w-10 text-indigo-600" />,
      title: "Real-time Monitoring",
      description: "Continuous tracking of seismic activity across India with frequent updates from multiple reliable sources."
    },
    {
      icon: <Globe className="h-10 w-10 text-indigo-600" />,
      title: "Interactive Map",
      description: "Visualize earthquakes on an interactive map with details on magnitude, depth, and affected regions."
    },
    {
      icon: <AlertTriangle className="h-10 w-10 text-indigo-600" />,
      title: "Instant Alerts",
      description: "Receive immediate notifications for significant seismic events based on customizable thresholds."
    },
    {
      icon: <MapPin className="h-10 w-10 text-indigo-600" />,
      title: "Location-based Tracking",
      description: "Focus on specific regions of interest and receive targeted updates for those areas."
    },
    {
      icon: <Database className="h-10 w-10 text-indigo-600" />,
      title: "Historical Analysis",
      description: "Access and analyze past earthquake data to identify patterns and trends in seismic activity."
    },
    {
      icon: <Shield className="h-10 w-10 text-indigo-600" />,
      title: "Safety Information",
      description: "Access comprehensive guides on earthquake preparedness and emergency response procedures."
    },
  ];
  
  const dataSources = [
    {
      name: "USGS",
      fullName: "United States Geological Survey",
      description: "Global earthquake monitoring network with real-time data collection and analysis.",
      url: "https://earthquake.usgs.gov/"
    },
    {
      name: "IMD",
      fullName: "India Meteorological Department",
      description: "Official agency for meteorological and seismological observations in India.",
      url: "https://www.imd.gov.in/"
    },
    {
      name: "EMSC",
      fullName: "European-Mediterranean Seismological Centre",
      description: "Real-time earthquake information for the Euro-Mediterranean region.",
      url: "https://www.emsc-csem.org/"
    },
    {
      name: "NCS",
      fullName: "National Center for Seismology",
      description: "Monitoring earthquakes across the Indian subcontinent.",
      url: "https://seismo.gov.in/"
    }
  ];

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-[#F5F7FA] via-[#E4ECF7] to-[#C3CFE2]">
      <div className="container mx-auto p-4">
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-900 mb-4">About QuakeAlert India</h1>
          <p className="text-lg text-gray-700">
            A comprehensive earthquake monitoring and alert system for the Indian subcontinent,
            providing real-time updates, historical analysis, and personalized notifications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div>
            <h2 className="text-2xl font-semibold text-indigo-900 mb-4 flex items-center">
              <Info className="mr-2 h-5 w-5" /> Our Mission
            </h2>
            <p className="text-gray-700 mb-6">
              QuakeAlert India aims to provide accurate, timely information about seismic activity across the 
              Indian subcontinent. By leveraging data from multiple trusted sources and implementing advanced 
              monitoring systems, we help residents stay informed and prepared for potential earthquakes.
            </p>
            <p className="text-gray-700 mb-6">
              Our platform combines real-time monitoring with historical analysis to offer a comprehensive 
              view of seismic patterns and potential risk areas. We believe that accessible, user-friendly 
              information is essential for public safety and community preparedness.
            </p>
            <div className="mb-6">
              <Link to="/alerts">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  Set Up Your Alerts
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-indigo-900 mb-4 flex items-center">
              <Clock className="mr-2 h-5 w-5" /> How Our System Works
            </h2>
            <ol className="space-y-4 text-gray-700">
              <li className="flex">
                <span className="bg-indigo-100 text-indigo-800 rounded-full w-6 h-6 flex items-center justify-center font-medium mr-2 flex-shrink-0">1</span>
                <span>Continuous data collection from multiple seismic monitoring stations across India and global networks.</span>
              </li>
              <li className="flex">
                <span className="bg-indigo-100 text-indigo-800 rounded-full w-6 h-6 flex items-center justify-center font-medium mr-2 flex-shrink-0">2</span>
                <span>Automated processing and verification of earthquake data to ensure accuracy.</span>
              </li>
              <li className="flex">
                <span className="bg-indigo-100 text-indigo-800 rounded-full w-6 h-6 flex items-center justify-center font-medium mr-2 flex-shrink-0">3</span>
                <span>Real-time analysis of magnitude, depth, and potential impact of seismic events.</span>
              </li>
              <li className="flex">
                <span className="bg-indigo-100 text-indigo-800 rounded-full w-6 h-6 flex items-center justify-center font-medium mr-2 flex-shrink-0">4</span>
                <span>Instant notification delivery through multiple channels based on user preferences.</span>
              </li>
              <li className="flex">
                <span className="bg-indigo-100 text-indigo-800 rounded-full w-6 h-6 flex items-center justify-center font-medium mr-2 flex-shrink-0">5</span>
                <span>Historical data archiving for pattern analysis and research purposes.</span>
              </li>
            </ol>
          </div>
        </div>
        
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-indigo-900 mb-8 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-none shadow-md">
                <CardHeader className="pb-2">
                  <div className="mb-2">{feature.icon}</div>
                  <CardTitle className="text-lg text-indigo-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-indigo-900 mb-8 text-center flex items-center justify-center">
            <GitMerge className="mr-2 h-5 w-5" /> Data Sources
          </h2>
          <p className="text-gray-700 mb-6 text-center max-w-3xl mx-auto">
            QuakeAlert India integrates data from multiple authoritative sources to ensure comprehensive 
            and reliable earthquake information. Our multi-source approach helps validate earthquake 
            reports and provides redundancy for critical safety information.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dataSources.map((source, index) => (
              <Card key={index} className="border-none shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-indigo-900">{source.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium text-gray-700 mb-2">{source.fullName}</p>
                  <p className="text-gray-600 mb-4">{source.description}</p>
                  <a 
                    href={source.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium inline-flex items-center"
                  >
                    Visit Website <Globe className="ml-1 h-3 w-3" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8 mb-16">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 md:pr-8">
              <h2 className="text-2xl font-semibold text-indigo-900 mb-4 flex items-center">
                <Users className="mr-2 h-5 w-5" /> Join Our Community
              </h2>
              <p className="text-gray-700 mb-6">
                Help us improve earthquake monitoring and awareness across India. Sign up for alerts, 
                provide feedback on our system, and be part of building a safer, more prepared community.
              </p>
              <div className="flex space-x-4">
                <Link to="/auth">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    Create Account
                  </Button>
                </Link>
                <Link to="/alerts">
                  <Button variant="outline" className="border-indigo-600 text-indigo-600 hover:bg-indigo-50">
                    Configure Alerts
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/3 mt-8 md:mt-0">
              <div className="rounded-lg bg-indigo-50 p-6 border border-indigo-100">
                <h3 className="text-lg font-medium text-indigo-900 mb-2 flex items-center">
                  <Phone className="mr-2 h-4 w-4" /> Emergency Contact
                </h3>
                <p className="text-gray-700 mb-2">National Disaster Response Force (NDRF)</p>
                <p className="text-indigo-700 font-medium">011-24368251</p>
                <p className="text-sm text-gray-500 mt-4">
                  For immediate assistance during an earthquake emergency, please contact local 
                  authorities or dial the national emergency number.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
