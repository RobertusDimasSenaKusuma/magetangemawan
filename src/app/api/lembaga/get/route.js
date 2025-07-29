// api/lembaga/get/route.js
import connectToDB from "@/database";
import Lembaga from "@/models/Lembaga";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectToDB();

    const extractData = await Lembaga.find({}).sort({ createdAt: -1 }); // Urutkan dari yang terbaru

    if (extractData && extractData.length > 0) {
      return NextResponse.json({
        success: true,
        data: extractData,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Tidak ada data lembaga ditemukan",
      });
    }

  } catch (e) {
    console.error("Error:", e);

    return NextResponse.json({
      success: false,
      message: "Terjadi kesalahan server. Silakan coba lagi.",
      error: e.message
    }, { status: 500 });
  }
}
