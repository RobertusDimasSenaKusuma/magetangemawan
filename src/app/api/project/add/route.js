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

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    await connectToDB();
    
    const formData = await req.formData();
    const name = formData.get('name');
    const technologies = formData.get('technologies');
    const website = formData.get('website');
    const github = formData.get('github');
    const image = formData.get('image');

    let imageUrl = '';

    // Upload gambar ke Cloudinary jika ada
    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Upload ke Cloudinary
      const uploadResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: "image",
            folder: "portfolio-projects", // Folder di Cloudinary
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

      imageUrl = uploadResponse.secure_url;
    }

    // Simpan data ke database
    const projectData = {
      name,
      technologies,
      website,
      github,
      image: imageUrl
    };

    const saveData = await Project.create(projectData);

    if (saveData) {
      return NextResponse.json({
        success: true,
        message: "Project saved successfully",
        data: saveData
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Something goes wrong! Please try again",
      });
    }
  } catch (e) {
    console.log("Error:", e);

    return NextResponse.json({
      success: false,
      message: "Something goes wrong! Please try again",
      error: e.message
    });
  }
}