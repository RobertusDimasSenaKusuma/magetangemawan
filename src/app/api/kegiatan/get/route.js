// api/kegiatan/get/route.js
import connectToDB from "@/database";
import Kegiatan from "@/models/Kegiatan";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectToDB();

    const extractData = await Kegiatan.find({}).sort({ createdAt: -1 }); // Urutkan dari yang terbaru

    if (extractData && extractData.length > 0) {
      return NextResponse.json({
        success: true,
        data: extractData,
        total: extractData.length,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Tidak ada data kegiatan ditemukan",
        data: [],
        total: 0,
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