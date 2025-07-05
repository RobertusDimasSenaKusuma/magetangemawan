import connectToDB from "@/database";
import Project from "@/models/Project";
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
        { success: false, message: "Invalid or missing project ID. Please provide ID in URL parameter (?id=xxx) or request body." },
        { status: 400 }
      );
    }

    // Cari project yang akan dihapus
    const existingProject = await Project.findById(id);
    if (!existingProject) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    // Hapus gambar dari Cloudinary jika ada
    if (existingProject.image) {
      try {
        const publicId = existingProject.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`portfolio-projects/${publicId}`);
        console.log(`Image deleted from Cloudinary: ${publicId}`);
      } catch (err) {
        console.error("Error deleting image from Cloudinary:", err);
        // Lanjutkan proses delete meskipun gagal hapus gambar
      }
    }

    // Hapus project dari database
    const deletedProject = await Project.findByIdAndDelete(id);
    
    if (!deletedProject) {
      return NextResponse.json(
        { success: false, message: "Failed to delete project" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
      data: deletedProject,
    });

  } catch (e) {
    console.error("DELETE ERROR:", e);

    let customMessage = "Something went wrong!";
    if (e.name === "CastError") {
      customMessage = `Invalid ID format: ${e.value}`;
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
        { success: false, message: "Invalid or missing project ID" },
        { status: 400 }
      );
    }

    // Cari project yang akan dihapus
    const existingProject = await Project.findById(id);
    if (!existingProject) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    // Hapus gambar dari Cloudinary jika ada
    if (existingProject.image) {
      try {
        const publicId = existingProject.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`portfolio-projects/${publicId}`);
        console.log(`Image deleted from Cloudinary: ${publicId}`);
      } catch (err) {
        console.error("Error deleting image from Cloudinary:", err);
        // Lanjutkan proses delete meskipun gagal hapus gambar
      }
    }

    // Hapus project dari database
    const deletedProject = await Project.findByIdAndDelete(id);
    
    if (!deletedProject) {
      return NextResponse.json(
        { success: false, message: "Failed to delete project" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
      data: deletedProject,
    });

  } catch (e) {
    console.error("DELETE ERROR:", e);

    let customMessage = "Something went wrong!";
    if (e.name === "CastError") {
      customMessage = `Invalid ID format: ${e.value}`;
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