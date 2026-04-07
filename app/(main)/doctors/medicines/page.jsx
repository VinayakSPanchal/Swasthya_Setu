"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Pill,
  AlertTriangle,
  Info,
  Beaker,
  Building2,
  Syringe,
  PackageOpen,
  Loader2,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function MedicinesPage() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async (search = "") => {
    try {
      setLoading(true);
      const url = search 
        ? `/api/medicines?search=${encodeURIComponent(search)}&limit=30`
        : `/api/medicines?limit=30`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (Array.isArray(data)) {
        setMedicines(data);
      } else {
        console.error("API did not return an array:", data);
        setMedicines([]);
      }
    } catch (error) {
      console.error("Error fetching medicines:", error);
      setMedicines([]);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearching(true);
      setSearchTerm(searchInput);
      fetchMedicines(searchInput);
    }
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
    fetchMedicines();
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Pill className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold">Generic Medicines Information</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Search for medicine information, uses, dosage, and warnings
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Medicines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by medicine name (e.g., Aspirin, Ibuprofen, Metformin)..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" disabled={searching || !searchInput.trim()}>
                {searching ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  "Search"
                )}
              </Button>
              {searchTerm && (
                <Button type="button" variant="outline" onClick={clearSearch}>
                  Clear
                </Button>
              )}
            </form>
            
            {searchTerm && (
              <p className="text-sm text-muted-foreground mt-2">
                Showing results for: <strong>{searchTerm}</strong>
              </p>
            )}
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-4 text-sm text-muted-foreground">
          {searchTerm 
            ? `Found ${medicines.length} medicine(s) matching "${searchTerm}"`
            : `Showing ${medicines.length} medicines`
          }
        </div>

        {/* Medicines List */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-muted rounded mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : medicines.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Pill className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">
                {searchTerm ? "No medicines found" : "No data available"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm 
                  ? "Try searching with a different medicine name"
                  : "Try searching for a specific medicine"
                }
              </p>
              {searchTerm && (
                <Button onClick={clearSearch}>Clear Search</Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {medicines.map((medicine) => (
              <Card
                key={medicine.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2">
                        {medicine.brandName}
                      </CardTitle>
                      {medicine.genericName !== medicine.brandName && (
                        <p className="text-muted-foreground">
                          Generic: {medicine.genericName}
                        </p>
                      )}
                    </div>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <PackageOpen className="h-3 w-3" />
                      {medicine.productType}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {medicine.manufacturer && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Building2 className="h-3 w-3" />
                        <span>{medicine.manufacturer}</span>
                      </div>
                    )}
                    {medicine.route && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Syringe className="h-3 w-3" />
                        <span>{medicine.route}</span>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {/* Active Ingredients */}
                    <AccordionItem value="ingredients">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <Beaker className="h-4 w-4 text-primary" />
                          <span className="font-semibold">Active Ingredients</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-muted-foreground pl-6">
                          {medicine.activeIngredients}
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Purpose / Uses */}
                    <AccordionItem value="purpose">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <Info className="h-4 w-4 text-blue-500" />
                          <span className="font-semibold">Purpose & Uses</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-muted-foreground pl-6 whitespace-pre-wrap">
                          {medicine.purpose}
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Dosage */}
                    <AccordionItem value="dosage">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <Pill className="h-4 w-4 text-green-500" />
                          <span className="font-semibold">Dosage & Administration</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-muted-foreground pl-6 whitespace-pre-wrap">
                          {medicine.dosage}
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Warnings */}
                    <AccordionItem value="warnings">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                          <span className="font-semibold">Warnings & Precautions</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-md p-3 pl-6">
                          <p className="text-sm text-orange-900 dark:text-orange-100 whitespace-pre-wrap">
                            {medicine.warnings}
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Side Effects */}
                    <AccordionItem value="side-effects">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span className="font-semibold">Possible Side Effects</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md p-3 pl-6">
                          <p className="text-sm text-red-900 dark:text-red-100 whitespace-pre-wrap">
                            {medicine.sideEffects}
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  {/* Disclaimer */}
                  <div className="mt-4 p-3 bg-muted rounded-md">
                    <p className="text-xs text-muted-foreground">
                      <strong>Disclaimer:</strong> This information is for educational purposes only. 
                      Always consult your healthcare provider before taking any medication.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}