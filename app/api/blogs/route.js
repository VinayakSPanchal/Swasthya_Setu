import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const apiKey = process.env.NEWS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "NEWS_API_KEY is not configured" },
        { status: 500 }
      );
    }

    // Use health-specific sources and better query
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?category=health&language=en&pageSize=100&apiKey=${apiKey}`
    );

    if (!response.ok) {
      // Fallback to everything endpoint with stricter query
      const fallbackResponse = await fetch(
        `https://newsapi.org/v2/everything?q=("health" OR "medical" OR "medicine" OR "fitness" OR "mental health" OR "nutrition" OR "pharmaceuticals" OR "healthcare" OR "wellness" OR "disease" OR "treatment" OR "therapy" OR "vaccine" OR "clinical trial" OR "doctor" OR "hospital" OR "patient")&language=en&sortBy=publishedAt&pageSize=100&apiKey=${apiKey}`
      );
      
      if (!fallbackResponse.ok) {
        throw new Error("Failed to fetch articles from NewsAPI");
      }
      
      const fallbackData = await fallbackResponse.json();
      return processArticles(fallbackData);
    }

    const data = await response.json();
    return processArticles(data);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

function processArticles(data) {
  // Keywords to filter health-related content
  const healthKeywords = [
    'health', 'medical', 'medicine', 'fitness', 'mental', 'nutrition',
    'disease', 'treatment', 'therapy', 'vaccine', 'doctor', 'hospital',
    'patient', 'wellness', 'pharmaceutical', 'drug', 'clinical', 'healthcare',
    'diet', 'exercise', 'yoga', 'meditation', 'stress', 'anxiety', 'depression',
    'surgery', 'diagnosis', 'symptom', 'cure', 'prevent', 'immune', 'virus',
    'bacteria', 'infection', 'cancer', 'diabetes', 'heart', 'brain', 'body'
  ];

  // Filter and transform articles
  const articles = data.articles
    .filter(article => {
      if (!article.title || !article.description) return false;
      
      // Check if title or description contains health-related keywords
      const text = (article.title + ' ' + article.description).toLowerCase();
      return healthKeywords.some(keyword => text.includes(keyword));
    })
    .map((article) => ({
      id: article.url,
      title: article.title,
      description: article.description,
      content: article.content,
      imageUrl: article.urlToImage,
      source: article.source.name,
      author: article.author,
      publishedAt: article.publishedAt,
      url: article.url,
    }));

  return NextResponse.json(articles);
}