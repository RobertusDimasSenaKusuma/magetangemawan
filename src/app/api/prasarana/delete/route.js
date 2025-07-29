// api/prasarana/delete/route.js
import connectToDB from "@/database";
import Prasarana from "@/models/Prasarana";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const dynamic = "force-dynamic";

export async function DELETE(request) {
  try {
    await connectToDB();

    // Coba ambil ID dari URL parameter atau dari request body
    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");

    // Jika tidak ada di URL, coba dari request body
    if (!id) {
      try {
        const body = await request.json();
        id = body.id;
      } catch (e) {
        // Jika tidak bisa parse JSON, berarti tidak ada body
      }
    }

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing prasarana ID. Please provide ID in URL parameter (?id=xxx) or request body." },
        { status: 400 }
      );
    }

    // Cari prasarana yang akan dihapus
    const existingPrasarana = await Prasarana.findById(id);
    if (!existingPrasarana) {
      return NextResponse.json(
        { success: false, message: "Data prasarana tidak ditemukan" },
        { status: 404 }
      );
    }

    // Hapus foto dari Cloudinary jika ada
    if (existingPrasarana.foto) {
      try {
        const publicId = existingPrasarana.foto.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`prasarana-desa/${publicId}`);
        console.log(`Foto dihapus dari Cloudinary: ${publicId}`);
      } catch (err) {
        console.error("Error deleting image from Cloudinary:", err);
        // Lanjutkan proses delete meskipun gagal hapus foto
      }
    }

    // Hapus prasarana dari database
    const deletedPrasarana = await Prasarana.findByIdAndDelete(id);
    
    if (!deletedPrasarana) {
      return NextResponse.json(
        { success: false, message: "Gagal menghapus data prasarana" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Data prasarana berhasil dihapus",
      data: deletedPrasarana,
    });

  } catch (e) {
    console.error("DELETE ERROR:", e);

    let customMessage = "Terjadi kesalahan server";
    if (e.name === "CastError") {
      customMessage = `Format ID tidak valid: ${e.value}`;
    }

    return NextResponse.json(
      {
        success: false,
        message: customMessage,
        error: process.env.NODE_ENV === "development" ? e.message : undefined,
      },
      { status: 500 }
    );
  }
}

// Alternatif: Menggunakan request body untuk mengirim ID
export async function POST(request) {
  try {
    await connectToDB();

    const body = await request.json();
    const { id } = body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing prasarana ID" },
        { status: 400 }
      );
    }

    // Cari prasarana yang akan dihapus
    const existingPrasarana = await Prasarana.findById(id);
    if (!existingPrasarana) {
      return NextResponse.json(
        { success: false, message: "Data prasarana tidak ditemukan" },
        { status: 404 }
      );
    }

    // Hapus foto dari Cloudinary jika ada
    if (existingPrasarana.foto) {
      try {
        const publicId = existingPrasarana.foto.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`prasarana-desa/${publicId}`);
        console.log(`Foto dihapus dari Cloudinary: ${publicId}`);
      } catch (err) {
        console.error("Error deleting image from Cloudinary:", err);
        // Lanjutkan proses delete meskipun gagal hapus foto
      }
    }

    // Hapus prasarana dari database
    const deletedPrasarana = await Prasarana.findByIdAndDelete(id);
    
    if (!deletedPrasarana) {
      return NextResponse.json(
        { success: false, message: "Gagal menghapus data prasarana" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Data prasarana berhasil dihapus",
      data: deletedPrasarana,
    });

  } catch (e) {
    console.error("DELETE ERROR:", e);

    let customMessage = "Terjadi kesalahan server";
    if (e.name === "CastError") {
      customMessage = `Format ID tidak valid: ${e.value}`;
    }

    return NextResponse.json(
      {
        success: false,
        message: customMessage,
        error: process.env.NODE_ENV === "development" ? e.message : undefined,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ success: false, message: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ success: false, message: "Method not allowed" }, { status: 405 });
}