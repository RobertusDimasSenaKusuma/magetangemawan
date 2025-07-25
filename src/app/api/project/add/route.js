// api/project/add/route.js
import connectToDB from "@/database";
import Project from "@/models/Project";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const dynamic = "force-dynamic"; // Hindari cache
export const runtime = "nodejs";        // Pakai Node, bukan Edge

export async function POST(req) {
  try {
    await connectToDB();
    
    const formData = await req.formData();
    const name = formData.get('name');
    const technologies = formData.get('technologies');
    const website = formData.get('website');
    const github = formData.get('github');
    const image = formData.get('image'); // File type

    let imageUrl = '';

    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64Image = `data:${image.type};base64,${buffer.toString('base64')}`;

      try {
        const uploadResponse = await cloudinary.uploader.upload(base64Image, {
          resource_type: "image",
          folder: "portfolio-projects",
          transformation: [
            { width: 800, height: 600, crop: "fill" },
            { quality: "auto" }
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

    // Simpan data ke MongoDB
    const projectData = {
      name,
      technologies,
      website,
      github,
      image: imageUrl
    };

    const saveData = await Project.create(projectData);

    return NextResponse.json({
      success: true,
      message: "Project saved successfully",
      data: saveData
    });

  } catch (e) {
    console.error("API Error:", e);
    return NextResponse.json({
      success: false,
      message: "Something goes wrong! Please try again",
      error: e.message
    });
  }
}
