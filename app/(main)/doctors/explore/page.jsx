"use client";

import React, { useState, useEffect } from "react";
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
  MapPin,
  Star,
  Stethoscope,
  Phone,
  MapPinned,
  Award,
  GraduationCap,
  Languages,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";

export default function ExploreDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedSpeciality, setSelectedSpeciality] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    let filtered = [...doctors];

    if (searchTerm) {
      filtered = filtered.filter((doctor) =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedLocation !== "all") {
      filtered = filtered.filter((doctor) =>
        doctor.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    if (selectedSpeciality !== "all") {
      filtered = filtered.filter(
        (doctor) => doctor.speciality === selectedSpeciality
      );
    }

    if (selectedRating !== "all") {
      const minRating = parseFloat(selectedRating);
      filtered = filtered.filter((doctor) => doctor.rating >= minRating);
    }

    setFilteredDoctors(filtered);
  }, [searchTerm, selectedLocation, selectedSpeciality, selectedRating, doctors]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/doctors/explore");
      const data = await response.json();

      if (Array.isArray(data)) {
        // ⭐ Sort doctors by ID here (increasing order)
        const sorted = data.sort((a, b) => a.id - b.id);

        setDoctors(sorted);
        setFilteredDoctors(sorted);
      } else {
        console.error("API did not return an array:", data);
        setDoctors([]);
        setFilteredDoctors([]);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setDoctors([]);
      setFilteredDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedLocation("all");
    setSelectedSpeciality("all");
    setSelectedRating("all");
  };

  const locations = [...new Set(doctors.map((d) => d.location))];
  const specialities = [...new Set(doctors.map((d) => d.speciality))];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Explore Nearby Doctors</h1>
          <p className="text-muted-foreground">
            Discover verified healthcare professionals in your area
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search & Filter Doctors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

              <div className="space-y-2">
                <label className="text-sm font-medium">Search by Name</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Doctor name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Select
                  value={selectedLocation}
                  onValueChange={setSelectedLocation}
                >
                  <SelectTrigger>
                    <MapPin className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Speciality</label>
                <Select
                  value={selectedSpeciality}
                  onValueChange={setSelectedSpeciality}
                >
                  <SelectTrigger>
                    <Stethoscope className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="All Specialities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Specialities</SelectItem>
                    {specialities.map((speciality) => (
                      <SelectItem key={speciality} value={speciality}>
                        {speciality}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Minimum Rating</label>
                <Select
                  value={selectedRating}
                  onValueChange={setSelectedRating}
                >
                  <SelectTrigger>
                    <Star className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="All Ratings" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="4.5">4.5+ Stars</SelectItem>
                    <SelectItem value="4.0">4.0+ Stars</SelectItem>
                    <SelectItem value="3.5">3.5+ Stars</SelectItem>
                    <SelectItem value="3.0">3.0+ Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={clearFilters} className="gap-2">
                Clear All Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mb-4 text-sm text-muted-foreground">
          Showing {filteredDoctors.length} of {doctors.length} doctors
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-24 bg-muted rounded mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredDoctors.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Stethoscope className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No doctors found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters to see more results
              </p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <Card key={doctor.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">

                    <div className="relative h-24 w-24 rounded-full overflow-hidden bg-muted flex-shrink-0 border-2 border-primary/20">
                      {doctor.photoUrl ? (
                        <Image
                          src={doctor.photoUrl}
                          alt={doctor.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/10">
                          <Stethoscope className="h-10 w-10 text-primary" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-xl truncate">
                          Dr. {doctor.name}
                        </CardTitle>
                        {doctor.isVerified && (
                          <CheckCircle2 className="h-5 w-5 text-blue-500 flex-shrink-0" />
                        )}
                      </div>
                      <Badge variant="secondary" className="mb-2">
                        {doctor.speciality}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">
                          {doctor.rating.toFixed(1)}
                        </span>
                        <span className="text-muted-foreground">
                          ({doctor.reviewCount} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5 text-primary" />
                    <div>
                      <div className="font-medium">{doctor.location}</div>
                      {doctor.address && (
                        <div className="text-muted-foreground text-xs mt-0.5">
                          {doctor.address}
                        </div>
                      )}
                    </div>
                  </div>

                  {doctor.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 flex-shrink-0 text-primary" />
                      <a href={`tel:${doctor.phone}`} className="font-medium text-primary hover:underline">
                        {doctor.phone}
                      </a>
                    </div>
                  )}

                  {doctor.clinicName && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPinned className="h-4 w-4 flex-shrink-0" />
                      <span>{doctor.clinicName}</span>
                    </div>
                  )}

                  {doctor.experience && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Award className="h-4 w-4 flex-shrink-0" />
                      <span>{doctor.experience} years experience</span>
                    </div>
                  )}

                  {doctor.education && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <GraduationCap className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{doctor.education}</span>
                    </div>
                  )}

                  {doctor.languages && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Languages className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{doctor.languages}</span>
                    </div>
                  )}

                  {doctor.phone && (
                    <div className="pt-2">
                      <a href={`tel:${doctor.phone}`} className="block">
                        <Button variant="default" className="w-full gap-2">
                          <Phone className="h-4 w-4" />
                          Call Now
                        </Button>
                      </a>
                    </div>
                  )}

                  <div className="pt-1">
                    <Badge variant="outline" className="w-full justify-center text-xs">
                      📍 Local Doctor (Not on Platform)
                    </Badge>
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
