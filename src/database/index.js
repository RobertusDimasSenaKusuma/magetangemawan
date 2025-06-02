import mongoose from "mongoose";

export default async function connectToDB() {
  try {
    await mongoose.connect(
      "mongodb+srv://robert:gemawan@cluster0.zp6k8sn.mongodb.net/robert"
    );
    console.log("Database connected successfully");
  } catch (e) {
    console.log(e);
  }
}
