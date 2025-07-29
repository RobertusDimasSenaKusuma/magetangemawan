// api/prasarana/add/route.js
import connectToDB from "@/database";
import Prasarana from "@/models/Prasarana";
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
    const tahun_pembangunan = formData.get('tahun_pembangunan');
    const lokasi = formData.get('lokasi');
    const fotoFile = formData.get('foto');
    
    // Data opsional
    const maps_link = formData.get('maps_link') || '';

    // Validasi field wajib
    if (!nama || !kategori || !deskripsi || !tahun_pembangunan || !lokasi) {
      return NextResponse.json({
        success: false,
        message: "Field wajib tidak boleh kosong: nama, kategori, deskripsi, tahun_pembangunan, lokasi"
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
          folder: "prasarana-desa", // Folder di Cloudinary untuk prasarana
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
    const prasaranData = {
      nama,
      kategori,
      deskripsi,
      foto,
      tahun_pembangunan,
      lokasi,
      // Field opsional
      maps_link
    };

    // Simpan data ke database
    const saveData = await Prasarana.create(prasaranData);

    if (saveData) {
      return NextResponse.json({
        success: true,
        message: "Data prasarana berhasil disimpan",
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
    
    return NextResponse.json({
      success: false,
      message: "Terjadi kesalahan server",
      error: e.message
    }, { status: 500 });
  }
}