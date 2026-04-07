import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");
    const location = searchParams.get("location");
    const speciality = searchParams.get("speciality");
    const minRating = searchParams.get("rating");

    const whereClause = {};

    if (name && name !== "all") {
      whereClause.name = {
        contains: name,
        mode: "insensitive",
      };
    }

    if (location && location !== "all") {
      whereClause.location = {
        contains: location,
        mode: "insensitive",
      };
    }

    if (speciality && speciality !== "all") {
      whereClause.speciality = speciality;
    }

    if (minRating && minRating !== "all") {
      whereClause.rating = {
        gte: parseFloat(minRating),
      };
    }

    // SORT BY ID ASC (Your request)
    const localDoctors = await db.localDoctor.findMany({
      where: whereClause,
      orderBy: {
        id: "asc",
      },
    });

    const transformedDoctors = localDoctors.map((doctor) => ({
      id: doctor.id,
      name: doctor.name,
      speciality: doctor.speciality,
      location: doctor.location,
      rating: doctor.rating,
      reviewCount: doctor.reviewCount,
      photoUrl: doctor.photoUrl,
      phone: doctor.phone,
      address: doctor.address,
      clinicName: doctor.clinicName,
      experience: doctor.experience,
      education: doctor.education,
      languages: doctor.languages,
      isVerified: doctor.isVerified,
      isRegistered: false,
    }));

    return NextResponse.json(transformedDoctors);

  } catch (error) {
    console.error("Error fetching local doctors:", error);
    return NextResponse.json(
      { error: "Failed to fetch doctors" },
      { status: 500 }
    );
  }
}
