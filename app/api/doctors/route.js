import { db } from "@/lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const specialty = searchParams.get("specialty") || undefined;
    const region = searchParams.get("region") || undefined;
    const locality = searchParams.get("locality") || undefined;

    const doctors = await db.localDoctor.findMany({
      where: {
        ...(specialty && { specialty: { contains: specialty, mode: "insensitive" } }),
        ...(region && { region }),
        ...(locality && { locality: { contains: locality, mode: "insensitive" } }),
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        specialty: true,
        region: true,
        locality: true,
        hospital: true,
        clinicName: true,
        contact: true,      // ✔ REQUIRED
        address: true,      // ✔ REQUIRED
        platformDoctorId: true,
        isOnPlatform: true,
        createdAt: true,
      },
    });

    return Response.json(doctors);
  } catch (err) {
    console.error("Error fetching doctors:", err);
    return new Response("Error fetching doctors", { status: 500 });
  }
}
