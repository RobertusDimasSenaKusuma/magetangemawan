// api/lembaga/add/route.js
import connectToDB from "@/database";
import Lembaga from "@/models/Lembaga";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    await connectToDB();
    
    const formData = await req.formData();
    const nama = formData.get('nama');
    const kategori = formData.get('kategori');
    const deskripsi = formData.get('deskripsi');
    const fotoFile = formData.get('foto');
    // Validasi field wajib
    if (!nama || !kategori || !deskripsi) {
      return NextResponse.json({
        success: false,
        message: "Field wajib tidak boleh kosong: nama, kategori, deskripsi"
      }, { status: 400 });
    }

    // Validasi kategori
    const validKategori = [
      "Pemerintahan", "Pendidikan", "Kesehatan", "Keagamaan", 
      "Sosial", "Ekonomi", "Keamanan", "Budaya", 
      "Lingkungan", "Pemuda", "Perempuan", "Lainnya"
    ];
    
    if (!validKategori.includes(kategori)) {
      return NextResponse.json({
        success: false,
        message: "Kategori tidak valid"
      }, { status: 400 });
    }

    let foto = '';

    if (fotoFile && fotoFile.size > 0) {
      const bytes = await fotoFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64Image = `data:${fotoFile.type};base64,${buffer.toString('base64')}`;
      
      try {
        const uploadResponse = await cloudinary.uploader.upload(base64Image, {
          resource_type: "image",
          folder: "lembaga-desa", // Folder di Cloudinary untuk lembaga
          transformation: [
            {
              quality: 50, // Compress 50%
              format: "auto" // Format optimal otomatis (WebP, AVIF, dll)
            }
          ]
        });
        
        foto = uploadResponse.secure_url;
      } catch (cloudErr) {
        console.error("Cloudinary upload error:", cloudErr);
        return NextResponse.json({
          success: false,
          message: "Image upload failed",
          error: cloudErr.message
        });
      }
    }

    // Siapkan data untuk disimpan
    const lembagaData = {
      nama: nama.trim(),
      kategori: kategori.trim(),
      deskripsi: deskripsi.trim(),
      foto,
    };

    // Simpan data ke database
    const saveData = await Lembaga.create(lembagaData);

    if (saveData) {
      return NextResponse.json({
        success: true,
        message: "Data lembaga berhasil disimpan",
        data: saveData
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Terjadi kesalahan saat menyimpan data"
      });
    }

  } catch (e) {
    console.log("Error:", e);
    
    let message = "Terjadi kesalahan server";
    if (e.name === "ValidationError") {
      message = Object.values(e.errors).map(err => err.message).join(", ");
    } else if (e.code === 11000) {
      // Handle duplicate key error jika ada unique field
      message = "Data dengan nama yang sama sudah ada";
    }
    
    return NextResponse.json({
      success: false,
      message,
      error: e.message
    }, { status: 500 });
  }
}