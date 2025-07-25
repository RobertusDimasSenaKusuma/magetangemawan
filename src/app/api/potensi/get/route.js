// api/potensi/get/route.js
import connectToDB from "@/database";
import Potensi from "@/models/Potensi";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectToDB();
    const extractData = await Potensi.find({}).sort({ createdAt: -1 }); // Sort by newest first

    if (extractData) {
      return NextResponse.json({
        success: true,
        data: extractData,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "No potensi found",
      });
    }
  } catch (e) {
    console.log("Error:", e);

    return NextResponse.json({
      success: false,
      message: "Something went wrong! Please try again",
      error: e.message
    });
  }
}