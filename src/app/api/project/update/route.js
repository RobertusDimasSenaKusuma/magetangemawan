// api/project/add/route.js
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

export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // Hindari Edge runtime

export async function PUT(request) {
  try {
    await connectToDB();

    const formData = await request.formData();
    const id = formData.get("id");
    const name = formData.get("name");
    const technologies = formData.get("technologies");
    const website = formData.get("website");
    const github = formData.get("github");
    const image = formData.get("image");
    const removeImage = formData.get("removeImage") === "true";

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid or missing project ID" }, { status: 400 });
    }

    if (!name || !technologies || !github) {
      return NextResponse.json({ success: false, message: "Name, technologies, and github are required" }, { status: 400 });
    }

    const existingProject = await Project.findById(id);
    if (!existingProject) {
      return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
    }

    let imageUrl = existingProject.image;

    // Hapus gambar lama jika di-request
    if (removeImage && existingProject.image) {
      try {
        const publicId = extractPublicId(existingProject.image);
        await cloudinary.uploader.destroy(`portfolio-projects/${publicId}`);
        imageUrl = null;
      } catch (err) {
        console.error("Cloudinary delete error:", err);
        return NextResponse.json({ success: false, message: "Failed to delete old image" }, { status: 500 });
      }
    }

    // Upload image baru jika ada
    if (image && image.size > 0) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!allowedTypes.includes(image.type)) {
        return NextResponse.json({ success: false, message: "Invalid image type." }, { status: 400 });
      }

      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64Image = `data:${image.type};base64,${buffer.toString("base64")}`;

      // Hapus gambar lama (jika belum dihapus sebelumnya)
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
            { width: 800, height: 600, crop: "fill" },
            { quality: "auto" },
          ],
        });

        imageUrl = uploadResponse.secure_url;
      } catch (err) {
        console.error("Cloudinary upload error:", err);
        return NextResponse.json({ success: false, message: "Image upload failed" }, { status: 500 });
      }
    }

    const updatedData = {
      name: name.trim(),
      technologies: technologies.trim(),
      website: website?.trim() || "",
      github: github.trim(),
      image: imageUrl,
    };

    const updatedProject = await Project.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProject) {
      return NextResponse.json({ success: false, message: "Update failed" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Project updated successfully",
      data: updatedProject,
    });
  } catch (e) {
    console.error("UPDATE ERROR:", e);

    let message = "Something went wrong!";
    if (e.name === "ValidationError") {
      message = Object.values(e.errors).map(err => err.message).join(", ");
    } else if (e.name === "CastError") {
      message = `Invalid ID: ${e.value}`;
    }

    return NextResponse.json(
      { success: false, message, error: process.env.NODE_ENV === "development" ? e.message : undefined },
      { status: 500 }
    );
  }
}

// GET method not allowed
export async function GET() {
  return NextResponse.json({ success: false, message: "Method not allowed" }, { status: 405 });
}

// 🔧 Ekstrak public ID dari URL Cloudinary
function extractPublicId(url) {
  const segments = url.split("/");
  const filename = segments.pop().split(".")[0]; // ambil nama file tanpa ekstensi
  return filename;
}
