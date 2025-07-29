// api/kegiatan/delete/route.js
import connectToDB from "@/database";
import Kegiatan from "@/models/Kegiatan";
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
        { success: false, message: "Invalid or missing kegiatan ID. Please provide ID in URL parameter (?id=xxx) or request body." },
        { status: 400 }
      );
    }

    // Cari kegiatan yang akan dihapus
    const existingKegiatan = await Kegiatan.findById(id);
    if (!existingKegiatan) {
      return NextResponse.json(
        { success: false, message: "Data kegiatan tidak ditemukan" },
        { status: 404 }
      );
    }

    // Hapus foto dari Cloudinary jika ada
    if (existingKegiatan.foto) {
      try {
        const publicId = existingKegiatan.foto.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`kegiatan-desa/${publicId}`);
        console.log(`Foto dihapus dari Cloudinary: ${publicId}`);
      } catch (err) {
        console.error("Error deleting image from Cloudinary:", err);
        // Lanjutkan proses delete meskipun gagal hapus foto
      }
    }

    // Hapus dokumen/file lain dari Cloudinary jika ada
    if (existingKegiatan.dokumen) {
      try {
        const publicId = existingKegiatan.dokumen.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`kegiatan-dokumen/${publicId}`);
        console.log(`Dokumen dihapus dari Cloudinary: ${publicId}`);
      } catch (err) {
        console.error("Error deleting document from Cloudinary:", err);
        // Lanjutkan proses delete meskipun gagal hapus dokumen
      }
    }

    // Hapus galeri foto jika ada
    if (existingKegiatan.galeri && existingKegiatan.galeri.length > 0) {
      for (const fotoUrl of existingKegiatan.galeri) {
        try {
          const publicId = fotoUrl.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(`kegiatan-galeri/${publicId}`);
          console.log(`Foto galeri dihapus dari Cloudinary: ${publicId}`);
        } catch (err) {
          console.error("Error deleting gallery image from Cloudinary:", err);
          // Lanjutkan proses delete meskipun gagal hapus foto galeri
        }
      }
    }

    // Hapus kegiatan dari database
    const deletedKegiatan = await Kegiatan.findByIdAndDelete(id);
    
    if (!deletedKegiatan) {
      return NextResponse.json(
        { success: false, message: "Gagal menghapus data kegiatan" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Data kegiatan berhasil dihapus",
      data: deletedKegiatan,
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
        { success: false, message: "Invalid or missing kegiatan ID" },
        { status: 400 }
      );
    }

    // Cari kegiatan yang akan dihapus
    const existingKegiatan = await Kegiatan.findById(id);
    if (!existingKegiatan) {
      return NextResponse.json(
        { success: false, message: "Data kegiatan tidak ditemukan" },
        { status: 404 }
      );
    }

    // Hapus foto dari Cloudinary jika ada
    if (existingKegiatan.foto) {
      try {
        const publicId = existingKegiatan.foto.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`kegiatan-desa/${publicId}`);
        console.log(`Foto dihapus dari Cloudinary: ${publicId}`);
      } catch (err) {
        console.error("Error deleting image from Cloudinary:", err);
        // Lanjutkan proses delete meskipun gagal hapus foto
      }
    }

    // Hapus dokumen/file lain dari Cloudinary jika ada
    if (existingKegiatan.dokumen) {
      try {
        const publicId = existingKegiatan.dokumen.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`kegiatan-dokumen/${publicId}`);
        console.log(`Dokumen dihapus dari Cloudinary: ${publicId}`);
      } catch (err) {
        console.error("Error deleting document from Cloudinary:", err);
        // Lanjutkan proses delete meskipun gagal hapus dokumen
      }
    }

    // Hapus galeri foto jika ada
    if (existingKegiatan.galeri && existingKegiatan.galeri.length > 0) {
      for (const fotoUrl of existingKegiatan.galeri) {
        try {
          const publicId = fotoUrl.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(`kegiatan-galeri/${publicId}`);
          console.log(`Foto galeri dihapus dari Cloudinary: ${publicId}`);
        } catch (err) {
          console.error("Error deleting gallery image from Cloudinary:", err);
          // Lanjutkan proses delete meskipun gagal hapus foto galeri
        }
      }
    }

    // Hapus kegiatan dari database
    const deletedKegiatan = await Kegiatan.findByIdAndDelete(id);
    
    if (!deletedKegiatan) {
      return NextResponse.json(
        { success: false, message: "Gagal menghapus data kegiatan" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Data kegiatan berhasil dihapus",
      data: deletedKegiatan,
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