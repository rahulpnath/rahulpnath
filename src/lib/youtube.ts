// YouTube Data API integration
export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  publishedAt: string;
  viewCount: string;
  url: string;
}

export interface YouTubeApiResponse {
  items: Array<{
    id: {
      videoId: string;
    };
    snippet: {
      title: string;
      description: string;
      publishedAt: string;
      thumbnails: {
        medium: { url: string };
        high: { url: string };
      };
    };
  }>;
}

export interface YouTubeVideoDetails {
  items: Array<{
    id: string;
    contentDetails: {
      duration: string;
    };
    statistics: {
      viewCount: string;
    };
  }>;
}

// Convert ISO 8601 duration to readable format
function formatDuration(duration: string): string {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return '0:00';
  
  const hours = parseInt(match[1]?.replace('H', '') || '0');
  const minutes = parseInt(match[2]?.replace('M', '') || '0');
  const seconds = parseInt(match[3]?.replace('S', '') || '0');
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Format view count to readable format
function formatViewCount(viewCount: string): string {
  const count = parseInt(viewCount);
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M views`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K views`;
  }
  return `${count} views`;
}

// Format published date to relative time
function formatPublishedDate(publishedAt: string): string {
  const now = new Date();
  const published = new Date(publishedAt);
  const diffInMs = now.getTime() - published.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    if (diffInHours === 0) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `${diffInMinutes} minutes ago`;
    }
    return `${diffInHours} hours ago`;
  } else if (diffInDays === 1) {
    return '1 day ago';
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else {
    const years = Math.floor(diffInDays / 365);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  }
}

export async function getLatestYouTubeVideos(maxResults: number = 10): Promise<YouTubeVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID || 'UC6QBkqZ-MqKQQKz0O2FGbMQ'; // Rahul Nath's channel ID
  
  if (!apiKey) {
    console.warn('YouTube API key not found. Using mock data.');
    return getMockYouTubeVideos();
  }

  try {
    // Step 1: Get latest videos from channel
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet&type=video&order=date&maxResults=${maxResults}`;
    
    const searchResponse = await fetch(searchUrl, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!searchResponse.ok) {
      throw new Error(`YouTube API error: ${searchResponse.status}`);
    }
    
    const searchData: YouTubeApiResponse = await searchResponse.json();
    
    if (!searchData.items || searchData.items.length === 0) {
      return getMockYouTubeVideos();
    }
    
    // Step 2: Get video details (duration, view count) for all videos
    const videoIds = searchData.items.map(item => item.id.videoId).join(',');
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${videoIds}&part=contentDetails,statistics`;
    
    const detailsResponse = await fetch(detailsUrl, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!detailsResponse.ok) {
      throw new Error(`YouTube API error: ${detailsResponse.status}`);
    }
    
    const detailsData: YouTubeVideoDetails = await detailsResponse.json();
    
    // Step 3: Combine search results with video details
    const videos: YouTubeVideo[] = searchData.items.map((item, index) => {
      const details = detailsData.items.find(detail => detail.id === item.id.videoId);
      
      return {
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium.url,
        duration: details ? formatDuration(details.contentDetails.duration) : '0:00',
        publishedAt: formatPublishedDate(item.snippet.publishedAt),
        viewCount: details ? formatViewCount(details.statistics.viewCount) : '0 views',
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`
      };
    });
    
    return videos;
    
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return getMockYouTubeVideos();
  }
}

// Fallback mock data
function getMockYouTubeVideos(): YouTubeVideo[] {
  return [
    {
      id: 'mock-1',
      title: 'Building Scalable Web Applications with Next.js 15',
      description: 'Learn how to build production-ready applications with the latest Next.js features including App Router, Server Components, and streaming.',
      thumbnail: '/article-img.jpg',
      duration: '24:35',
      viewCount: '12.5K views',
      publishedAt: '2 days ago',
      url: 'https://youtube.com/watch?v=example1'
    },
    {
      id: 'mock-2',
      title: 'AWS Lambda Best Practices for Production',
      description: 'Essential patterns and practices for building robust serverless applications with AWS Lambda.',
      thumbnail: '/article-img.jpg',
      duration: '18:42',
      viewCount: '8.3K views',
      publishedAt: '1 week ago',
      url: 'https://youtube.com/watch?v=example2'
    },
    {
      id: 'mock-3',
      title: 'React Server Components Deep Dive',
      description: 'Understanding how React Server Components work and when to use them in your applications.',
      thumbnail: '/article-img.jpg',
      duration: '15:23',
      viewCount: '15.7K views',
      publishedAt: '2 weeks ago',
      url: 'https://youtube.com/watch?v=example3'
    },
    {
      id: 'mock-4',
      title: 'TypeScript Tips for Better Developer Experience',
      description: 'Advanced TypeScript techniques to improve your development workflow and code quality.',
      thumbnail: '/article-img.jpg',
      duration: '12:18',
      viewCount: '9.2K views',
      publishedAt: '3 weeks ago',
      url: 'https://youtube.com/watch?v=example4'
    }
  ];
}