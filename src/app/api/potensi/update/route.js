// api/potensi/update/route.js
import connectToDB from "@/database";
import Potensi from "@/models/Potensi";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const dynamic = "force-dynamic";

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
    const foto = formData.get("foto");
    const removeFoto = formData.get("removeFoto") === "true";

    // Data opsional (sosial media, e-commerce, maps)
    const maps_link = formData.get("maps_link") || "";
    const shopee_link = formData.get("shopee_link") || "";
    const facebook_link = formData.get("facebook_link") || "";
    const instagram_link = formData.get("instagram_link") || "";
    const whatsapp_link = formData.get("whatsapp_link") || "";

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing potensi ID" },
        { status: 400 }
      );
    }

    if (!nama || !kategori || !deskripsi || !tahun_mulai || !lokasi) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Field wajib tidak boleh kosong: nama, kategori, deskripsi, tahun_mulai, lokasi" 
        },
        { status: 400 }
      );
    }

    const existingPotensi = await Potensi.findById(id);
    if (!existingPotensi) {
      return NextResponse.json(
        { success: false, message: "Data potensi tidak ditemukan" },
        { status: 404 }
      );
    }

    let fotoUrl = existingPotensi.foto;

    // Hapus foto lama jika diminta
    if (removeFoto && existingPotensi.foto) {
      try {
        const publicId = existingPotensi.foto.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`potensi-desa/${publicId}`);
        fotoUrl = null;
      } catch (err) {
        console.error("Error deleting old image:", err);
        return NextResponse.json(
          { success: false, message: "Gagal menghapus foto lama" },
          { status: 500 }
        );
      }
    }

    // Upload foto baru
    if (foto && foto.size > 0) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!allowedTypes.includes(foto.type)) {
        return NextResponse.json(
          { success: false, message: "Tipe file tidak valid. Gunakan JPEG, JPG, PNG, atau WebP" },
          { status: 400 }
        );
      }

      const bytes = await foto.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Hapus foto lama dulu kalau belum dihapus
      if (existingPotensi.foto && !removeFoto) {
        try {
          const publicId = existingPotensi.foto.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(`potensi-desa/${publicId}`);
        } catch (err) {
          console.error("Error deleting old image:", err);
        }
      }

      const uploadResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: "image",
            folder: "potensi-desa",
            transformation: [
              { width: 800, height: 600, crop: "fill" },
              { quality: "auto" },
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });

      fotoUrl = uploadResponse.secure_url;
    }

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
      return NextResponse.json(
        { success: false, message: "Gagal mengupdate data" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Data potensi berhasil diupdate",
      data: updatedPotensi,
    });
  } catch (e) {
    console.error("UPDATE ERROR:", e);

    let customMessage = "Terjadi kesalahan server";
    if (e.name === "ValidationError") {
      customMessage = "Validasi gagal: " + Object.values(e.errors).map(err => err.message).join(", ");
    } else if (e.name === "CastError") {
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
  return NextResponse.json(
    { success: false, message: "Method not allowed" }, 
    { status: 405 }
  );
}