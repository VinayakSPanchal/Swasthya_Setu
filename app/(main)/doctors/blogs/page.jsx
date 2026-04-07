"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Calendar,
  ExternalLink,
  FileText,
  User,
  TrendingUp,
  Loader2,
} from "lucide-react";
import Image from "next/image";

export default function BlogsPage() {
  const [articles, setArticles] = useState([]);
  const [displayedArticles, setDisplayedArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const observer = useRef();
  const ARTICLES_PER_PAGE = 6;

  // Ref for the last article element
  const lastArticleRef = useCallback(
    (node) => {
      if (loadingMore) return;
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });
      
      if (node) observer.current.observe(node);
    },
    [loadingMore, hasMore]
  );

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [searchTerm, selectedCategory, articles]);

  useEffect(() => {
    // Reset to first page when filters change
    setPage(1);
    setDisplayedArticles(filteredArticles.slice(0, ARTICLES_PER_PAGE));
    setHasMore(filteredArticles.length > ARTICLES_PER_PAGE);
  }, [filteredArticles]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/blogs");
      const data = await response.json();

      if (Array.isArray(data)) {
        setArticles(data);
        setFilteredArticles(data);
        setDisplayedArticles(data.slice(0, ARTICLES_PER_PAGE));
        setHasMore(data.length > ARTICLES_PER_PAGE);
      } else {
        console.error("API did not return an array:", data);
        setArticles([]);
        setFilteredArticles([]);
        setDisplayedArticles([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
      setArticles([]);
      setFilteredArticles([]);
      setDisplayedArticles([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const filterArticles = () => {
    let filtered = [...articles];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((article) => {
        const content = (article.title + " " + article.description).toLowerCase();
        switch (selectedCategory) {
          case "fitness":
            return content.includes("fitness") || content.includes("exercise") || content.includes("workout");
          case "nutrition":
            return content.includes("nutrition") || content.includes("diet") || content.includes("food");
          case "mental-health":
            return content.includes("mental") || content.includes("stress") || content.includes("anxiety");
          case "wellness":
            return content.includes("wellness") || content.includes("health") || content.includes("wellbeing");
          default:
            return true;
        }
      });
    }

    setFilteredArticles(filtered);
  };

  const loadMore = () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    
    setTimeout(() => {
      const nextPage = page + 1;
      const startIndex = page * ARTICLES_PER_PAGE;
      const endIndex = nextPage * ARTICLES_PER_PAGE;
      const newArticles = filteredArticles.slice(startIndex, endIndex);
      
      setDisplayedArticles((prev) => [...prev, ...newArticles]);
      setPage(nextPage);
      setHasMore(endIndex < filteredArticles.length);
      setLoadingMore(false);
    }, 500); // Small delay for smooth UX
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold">Health & Fitness Blogs</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Stay informed with the latest health, fitness, and wellness articles
          </p>
        </div>

        {/* Filters Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search & Filter Articles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Search Articles</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by title or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="fitness">Fitness & Exercise</SelectItem>
                    <SelectItem value="nutrition">Nutrition & Diet</SelectItem>
                    <SelectItem value="mental-health">Mental Health</SelectItem>
                    <SelectItem value="wellness">General Wellness</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Clear Filters */}
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={clearFilters} className="gap-2">
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {displayedArticles.length} of {filteredArticles.length} articles
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-48 bg-muted rounded mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : displayedArticles.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No articles found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search terms
              </p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedArticles.map((article, index) => {
                const isLastArticle = index === displayedArticles.length - 1;
                
                return (
                  <div
                    key={article.id}
                    ref={isLastArticle ? lastArticleRef : null}
                  >
                    <Card className="hover:shadow-lg transition-shadow overflow-hidden flex flex-col h-full">
                      {/* Article Image */}
                      {article.imageUrl && (
                        <div className="relative h-48 w-full overflow-hidden bg-muted">
                          <Image
                            src={article.imageUrl}
                            alt={article.title}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        </div>
                      )}

                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <Badge variant="secondary">{article.source}</Badge>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {formatDate(article.publishedAt)}
                          </div>
                        </div>
                        <CardTitle className="text-lg line-clamp-2">
                          {article.title}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="flex-1 flex flex-col">
                        {article.description && (
                          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                            {article.description}
                          </p>
                        )}

                        {article.author && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                            <User className="h-3 w-3" />
                            <span>{article.author}</span>
                          </div>
                        )}

                        <div className="mt-auto">
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                          >
                            <Button variant="default" className="w-full gap-2">
                              Read Full Article
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>

            {/* Loading More Indicator */}
            {loadingMore && (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading more articles...</span>
              </div>
            )}

            {/* End of Results */}
            {!hasMore && displayedArticles.length > 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>You've reached the end of the articles</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}