import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const limit = searchParams.get("limit") || "20";

    let url;
    
    if (search) {
      // Search for specific medicine
      url = `https://api.fda.gov/drug/label.json?search=openfda.generic_name:"${encodeURIComponent(search)}"OR openfda.brand_name:"${encodeURIComponent(search)}"&limit=${limit}`;
    } else {
      // Get general medicines list (popular ones)
      url = `https://api.fda.gov/drug/label.json?limit=${limit}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch medicine data from OpenFDA");
    }

    const data = await response.json();

    // Transform the data for frontend
    const medicines = data.results.map((drug, index) => {
      // Extract relevant information
      const genericName = drug.openfda?.generic_name?.[0] || "Unknown";
      const brandName = drug.openfda?.brand_name?.[0] || genericName;
      const manufacturer = drug.openfda?.manufacturer_name?.[0] || "Not specified";
      const activeIngredients = drug.active_ingredient?.[0] || drug.openfda?.substance_name?.[0] || "Not available";
      
      // Get purposes/indications
      const purpose = drug.purpose?.[0] || drug.indications_and_usage?.[0] || "Not available";
      
      // Get warnings
      const warnings = drug.warnings?.[0] || drug.warnings_and_cautions?.[0] || "Not available";
      
      // Get dosage
      const dosage = drug.dosage_and_administration?.[0] || "Consult your doctor";
      
      // Get side effects
      const sideEffects = drug.adverse_reactions?.[0] || "Not available";
      
      // Get route (oral, injection, etc)
      const route = drug.openfda?.route?.[0] || "Not specified";
      
      return {
        id: drug.id || `medicine-${index}`,
        genericName,
        brandName,
        manufacturer,
        activeIngredients,
        purpose: cleanText(purpose),
        warnings: cleanText(warnings),
        dosage: cleanText(dosage),
        sideEffects: cleanText(sideEffects),
        route,
        productType: drug.openfda?.product_type?.[0] || "HUMAN PRESCRIPTION DRUG",
      };
    });

    return NextResponse.json(medicines);
  } catch (error) {
    console.error("Error fetching medicines:", error);
    
    // Return empty array instead of error to avoid breaking the UI
    return NextResponse.json([]);
  }
}

// Helper function to clean and truncate text
function cleanText(text) {
  if (!text) return "Not available";
  
  // Remove excessive whitespace and newlines
  let cleaned = text.replace(/\s+/g, " ").trim();
  
  // Truncate if too long (keep first 500 characters)
  if (cleaned.length > 500) {
    cleaned = cleaned.substring(0, 500) + "...";
  }
  
  return cleaned;
}