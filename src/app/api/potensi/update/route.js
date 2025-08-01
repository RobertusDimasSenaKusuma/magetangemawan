// api/potensi/update/route.js
import connectToDB from "@/database";
import Potensi from "@/models/Potensi";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const dynamic = "force-dynamic"; // Hindari cache
export const runtime = "nodejs";        // Pakai Node, bukan Edge

export async function PUT(request) {
  try {
    await connectToDB();

    const formData = await request.formData();
    const id = formData.get("id");
    const nama = formData.get("nama");
    const kategori = formData.get("kategori");
    const deskripsi = formData.get("deskripsi");
    const tahun_mulai = formData.get("tahun_mulai");
    const lokasi = formData.get("lokasi");
    const foto = formData.get("foto"); // File type
    const removeFoto = formData.get("removeFoto") === "true";

    // Data opsional (sosial media, e-commerce, maps)
    const maps_link = formData.get("maps_link") || "";
    const shopee_link = formData.get("shopee_link") || "";
    const facebook_link = formData.get("facebook_link") || "";
    const instagram_link = formData.get("instagram_link") || "";
    const whatsapp_link = formData.get("whatsapp_link") || "";

    // Validasi ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({
        success: false,
        message: "Invalid or missing potensi ID"
      }, { status: 400 });
    }

    // Validasi field required
    if (!nama || !kategori || !deskripsi || !tahun_mulai || !lokasi) {
      return NextResponse.json({
        success: false,
        message: "Field wajib tidak boleh kosong: nama, kategori, deskripsi, tahun_mulai, lokasi"
      }, { status: 400 });
    }

    // Cek potensi exists
    const existingPotensi = await Potensi.findById(id);
    if (!existingPotensi) {
      return NextResponse.json({
        success: false,
        message: "Data potensi tidak ditemukan"
      }, { status: 404 });
    }

    let fotoUrl = existingPotensi.foto;

    // Hapus foto lama jika di-request
    if (removeFoto && existingPotensi.foto) {
      try {
        const publicId = extractPublicId(existingPotensi.foto);
        await cloudinary.uploader.destroy(`potensi-desa/${publicId}`);
        fotoUrl = '';
      } catch (cloudErr) {
        console.error("Cloudinary delete error:", cloudErr);
        return NextResponse.json({
          success: false,
          message: "Image delete failed",
          error: cloudErr.message
        });
      }
    }

    // Upload foto baru jika ada
    if (foto && foto.size > 0) {
      const bytes = await foto.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64Image = `data:${foto.type};base64,${buffer.toString('base64')}`;

      // Hapus foto lama sebelum upload baru (jika belum dihapus sebelumnya)
      if (existingPotensi.foto && !removeFoto) {
        try {
          const publicId = extractPublicId(existingPotensi.foto);
          await cloudinary.uploader.destroy(`potensi-desa/${publicId}`);
        } catch (err) {
          console.error("Error deleting old image (optional):", err);
        }
      }

      try {
        const uploadResponse = await cloudinary.uploader.upload(base64Image, {
          resource_type: "image",
          folder: "potensi-desa",
          transformation: [
            {
              quality: 50, // Compress 50%
              format: "auto" // Format optimal otomatis (WebP, AVIF, dll)
            }
          ]
        });

        fotoUrl = uploadResponse.secure_url;
      } catch (cloudErr) {
        console.error("Cloudinary upload error:", cloudErr);
        return NextResponse.json({
          success: false,
          message: "Image upload failed",
          error: cloudErr.message
        });
      }
    }

    // Update data potensi
    const updatedData = {
      nama: nama.trim(),
      kategori: kategori.trim(),
      deskripsi: deskripsi.trim(),
      tahun_mulai: parseInt(tahun_mulai),
      lokasi: lokasi.trim(),
      foto: fotoUrl,
      maps_link: maps_link.trim(),
      shopee_link: shopee_link.trim(),
      facebook_link: facebook_link.trim(),
      instagram_link: instagram_link.trim(),
      whatsapp_link: whatsapp_link.trim(),
    };

    const updatedPotensi = await Potensi.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedPotensi) {
      return NextResponse.json({
        success: false,
        message: "Update failed"
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Data potensi berhasil diupdate",
      data: updatedPotensi,
    });

  } catch (e) {
    console.error("API Error:", e);

    let message = "Something goes wrong! Please try again";
    if (e.name === "ValidationError") {
      message = Object.values(e.errors).map(err => err.message).join(", ");
    } else if (e.name === "CastError") {
      message = `Invalid ID: ${e.value}`;
    }

    return NextResponse.json({
      success: false,
      message,
      error: e.message
    }, { status: 500 });
  }
}

// GET method not allowed
export async function GET() {
  return NextResponse.json({
    success: false,
    message: "Method not allowed"
  }, { status: 405 });
}

// 🔧 Ekstrak public ID dari URL Cloudinary
function extractPublicId(url) {
  const segments = url.split("/");
  const filename = segments.pop().split(".")[0]; // ambil nama file tanpa ekstensi
  return filename;
}