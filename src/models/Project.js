// models/Project.js
import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true
    },
    website: {
      type: String,
      required: [true, "Website URL is required"],
      trim: true
    },
    technologies: {
      type: String,
      required: [true, "Technologies are required"],
      trim: true
    },
    github: {
      type: String,
      required: [true, "Github URL is required"],
      trim: true
    },
    image: {
      type: String,
      default: '', // URL gambar dari Cloudinary
      trim: true
    },
     youtube: {
      type: String,
      default: '',
      trim: true
    }
  },
  { 
    timestamps: true 
  }
);

const Project =
  mongoose.models.Project || mongoose.model("Project", ProjectSchema);

export default Project;