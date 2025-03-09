
import { useEffect, useState } from "react";
import { Newspaper, ExternalLink, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface NewsItem {
  id: string;
  title: string;
  description: string;
  source: string;
  url: string;
  publishedAt: string;
  imageUrl?: string;
}

// Mock news data
const mockNewsData: NewsItem[] = [
  {
    id: "1",
    title: "6.4 Magnitude Earthquake Hits Nepal-India Border Region",
    description: "A strong earthquake of magnitude 6.4 struck the Nepal-India border region on Tuesday, causing buildings to sway in Delhi and other parts of northern India.",
    source: "Earthquake Today",
    url: "#",
    publishedAt: "2023-11-05T15:43:00Z",
    imageUrl: "https://images.unsplash.com/photo-1633534812768-65c0c21e5448?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "2",
    title: "Scientists Detect Unusual Seismic Activity in Southern India",
    description: "Researchers have detected unusual seismic patterns in Southern India that could indicate increased tectonic stress in the region.",
    source: "Science Daily",
    url: "#",
    publishedAt: "2023-10-28T09:12:00Z",
    imageUrl: "https://images.unsplash.com/photo-1582990202684-5191293b5534?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "3",
    title: "New Early Warning System Deployed Across Gujarat",
    description: "Gujarat State Disaster Management Authority has deployed a new earthquake early warning system across the state to provide crucial seconds of warning before tremors hit.",
    source: "Tech Tribune",
    url: "#",
    publishedAt: "2023-10-15T13:27:00Z",
    imageUrl: "https://images.unsplash.com/photo-1629539291066-611db09f2277?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "4",
    title: "Historical Seismic Data Reveals Pattern in Himalayan Region",
    description: "Analysis of 50 years of seismic data has revealed cyclical patterns in earthquake activity in the Himalayan region, potentially aiding prediction efforts.",
    source: "Geology Today",
    url: "#",
    publishedAt: "2023-10-05T07:55:00Z",
    imageUrl: "https://images.unsplash.com/photo-1508154545652-01d439917d3d?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "5",
    title: "Minor Tremors Felt in Chennai, No Damage Reported",
    description: "Residents of Chennai reported feeling minor tremors on Monday evening, though officials confirm no damage has been reported and there is no cause for concern.",
    source: "Chennai News Network",
    url: "#",
    publishedAt: "2023-09-28T18:40:00Z",
    imageUrl: "https://images.unsplash.com/photo-1576509897998-1e18b35bc538?q=80&w=600&auto=format&fit=crop"
  }
];

const NewsFeed = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchNews = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setNews(mockNewsData);
      } catch (error) {
        console.error("Failed to fetch news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleNewsClick = (newsItem: NewsItem) => {
    setSelectedNews(newsItem);
    setOpenDialog(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <Newspaper className="text-forest mr-2" />
        <h2 className="text-xl font-bold text-forest">Seismic News Feed</h2>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-forest/20 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-forest/10 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {news.map((item) => (
            <div
              key={item.id}
              className="border-b border-forest/10 pb-4 cursor-pointer hover:bg-forest/5 p-2 rounded transition-colors"
              onClick={() => handleNewsClick(item)}
            >
              <h3 className="font-medium text-forest mb-1">{item.title}</h3>
              <div className="flex justify-between text-sm text-forest/70">
                <span>{item.source}</span>
                <span className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {format(new Date(item.publishedAt), "MMM dd, yyyy")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl text-forest">{selectedNews?.title}</DialogTitle>
            <DialogDescription className="flex items-center text-sm text-forest/70">
              {selectedNews?.source} · {selectedNews?.publishedAt && 
                format(new Date(selectedNews.publishedAt), "MMMM dd, yyyy")}
            </DialogDescription>
          </DialogHeader>
          
          {selectedNews?.imageUrl && (
            <div className="mb-4 rounded-md overflow-hidden">
              <img 
                src={selectedNews.imageUrl} 
                alt={selectedNews.title} 
                className="w-full h-64 object-cover"
              />
            </div>
          )}
          
          <p className="mb-6">{selectedNews?.description}</p>
          
          <div className="flex justify-end">
            <Button className="bg-forest hover:bg-forest-light text-white">
              Read Full Article <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewsFeed;
