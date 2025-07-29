// api/project/update/route.js
import connectToDB from "@/database";
import Project from "@/models/Project";
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
    const name = formData.get("name");
    const technologies = formData.get("technologies");
    const website = formData.get("website");
    const github = formData.get("github");
    const youtube = formData.get("youtube"); // Tambahan field youtube
    const image = formData.get("image"); // File type
    const removeImage = formData.get("removeImage") === "true";

    // Validasi ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ 
        success: false, 
        message: "Invalid or missing project ID" 
      }, { status: 400 });
    }

    // Validasi field required
    if (!name || !technologies || !github) {
      return NextResponse.json({ 
        success: false, 
        message: "Name, technologies, and github are required" 
      }, { status: 400 });
    }

    // Cek project exists
    const existingProject = await Project.findById(id);
    if (!existingProject) {
      return NextResponse.json({ 
        success: false, 
        message: "Project not found" 
      }, { status: 404 });
    }

    let imageUrl = existingProject.image;

    // Hapus gambar lama jika di-request
    if (removeImage && existingProject.image) {
      try {
        const publicId = extractPublicId(existingProject.image);
        await cloudinary.uploader.destroy(`portfolio-projects/${publicId}`);
        imageUrl = '';
      } catch (cloudErr) {
        console.error("Cloudinary delete error:", cloudErr);
        return NextResponse.json({
          success: false,
          message: "Image delete failed",
          error: cloudErr.message
        });
      }
    }

    // Upload image baru jika ada
    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64Image = `data:${image.type};base64,${buffer.toString('base64')}`;

      // Hapus gambar lama sebelum upload baru (jika belum dihapus sebelumnya)
      if (existingProject.image && !removeImage) {
        try {
          const publicId = extractPublicId(existingProject.image);
          await cloudinary.uploader.destroy(`portfolio-projects/${publicId}`);
        } catch (err) {
          console.error("Error deleting old image (optional):", err);
        }
      }

      try {
        const uploadResponse = await cloudinary.uploader.upload(base64Image, {
          resource_type: "image",
          folder: "portfolio-projects",
          transformation: [
            {
              quality: 50, // Compress 50%
              format: "auto" // Format optimal otomatis (WebP, AVIF, dll)
            }
          ]
        });

        imageUrl = uploadResponse.secure_url;
      } catch (cloudErr) {
        console.error("Cloudinary upload error:", cloudErr);
        return NextResponse.json({
          success: false,
          message: "Image upload failed",
          error: cloudErr.message
        });
      }
    }

    // Update data project
    const updatedData = {
      name,
      technologies,
      website,
      github,
      youtube, // Tambahkan field youtube
      image: imageUrl,
    };

    const updatedProject = await Project.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProject) {
      return NextResponse.json({ 
        success: false, 
        message: "Update failed" 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Project updated successfully",
      data: updatedProject,
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