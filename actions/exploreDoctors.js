"use server";

import prisma from "@/lib/db";

export async function getDoctors() {
  try {
    const doctors = await prisma.doctor.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            imageUrl: true,
          },
        },
      },
      where: {
        // Only show verified/approved doctors if you have that field
        // isApproved: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform the data
    const transformedDoctors = doctors.map((doctor) => ({
      id: doctor.id,
      name: doctor.user.name,
      email: doctor.user.email,
      imageUrl: doctor.user.imageUrl,
      speciality: doctor.specialization || "General Physician",
      location: doctor.location || "Not specified",
      bio: doctor.bio,
      experience: doctor.yearsOfExperience || 0,
      consultationFee: doctor.consultationFee,
      rating: 4.0 + Math.random() * 1, // Replace with actual rating calculation
      reviewCount: 0, // Replace with actual review count
    }));

    return transformedDoctors;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw new Error("Failed to fetch doctors");
  }
}

export async function searchDoctors(filters) {
  try {
    const { name, location, speciality, minRating } = filters;

    const doctors = await prisma.doctor.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            imageUrl: true,
          },
        },
      },
      where: {
        ...(location && location !== "all" && { location }),
        ...(speciality && speciality !== "all" && { specialization: speciality }),
        ...(name && {
          user: {
            name: {
              contains: name,
              mode: "insensitive",
            },
          },
        }),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform and filter by rating if needed
    let transformedDoctors = doctors.map((doctor) => ({
      id: doctor.id,
      name: doctor.user.name,
      email: doctor.user.email,
      imageUrl: doctor.user.imageUrl,
      speciality: doctor.specialization || "General Physician",
      location: doctor.location || "Not specified",
      bio: doctor.bio,
      experience: doctor.yearsOfExperience || 0,
      consultationFee: doctor.consultationFee,
      rating: 4.0 + Math.random() * 1,
      reviewCount: 0,
    }));

    if (minRating && minRating !== "all") {
      transformedDoctors = transformedDoctors.filter(
        (doctor) => doctor.rating >= parseFloat(minRating)
      );
    }

    return transformedDoctors;
  } catch (error) {
    console.error("Error searching doctors:", error);
    throw new Error("Failed to search doctors");
  }
}