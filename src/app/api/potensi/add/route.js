// api/potensi/add/route.js
import connectToDB from "@/database";
import Potensi from "@/models/Potensi";
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
    const tahun_mulai = formData.get('tahun_mulai');
    const lokasi = formData.get('lokasi');
    const foto = formData.get('foto');
    
    // Data opsional (sosial media, e-commerce, maps)
    const maps_link = formData.get('maps_link') || '';
    const shopee_link = formData.get('shopee_link') || '';
    const facebook_link = formData.get('facebook_link') || '';
    const instagram_link = formData.get('instagram_link') || '';
    const whatsapp_link = formData.get('whatsapp_link') || '';

    // Validasi field wajib
    if (!nama || !kategori || !deskripsi || !tahun_mulai || !lokasi) {
      return NextResponse.json({
        success: false,
        message: "Field wajib tidak boleh kosong: nama, kategori, deskripsi, tahun_mulai, lokasi"
      }, { status: 400 });
    }

    let fotoUrl = '';

    // Upload foto ke Cloudinary jika ada
    if (foto && foto.size > 0) {
      const bytes = await foto.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Upload ke Cloudinary
      const uploadResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: "image",
            folder: "potensi-desa", // Folder di Cloudinary
            transformation: [
              { width: 800, height: 600, crop: "fill" }, // Resize gambar
              { quality: "auto" }
            ]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });

      fotoUrl = uploadResponse.secure_url;
    }

    // Siapkan data untuk disimpan
    const potensiData = {
      nama,
      kategori,
      deskripsi,
      foto: fotoUrl,
      tahun_mulai: parseInt(tahun_mulai),
      lokasi,
      // Field opsional
      maps_link,
      shopee_link,
      facebook_link,
      instagram_link,
      whatsapp_link
    };

    // Simpan data ke database
    const saveData = await Potensi.create(potensiData);

    if (saveData) {
      return NextResponse.json({
        success: true,
        message: "Data potensi berhasil disimpan",
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