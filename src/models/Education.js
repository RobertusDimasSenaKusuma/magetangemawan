import mongoose from "mongoose";

const EducationSchema = new mongoose.Schema(
  {
    degree: String,
    year: String,
    college: String,
    picture: String,
    
  },
  { timestamps: true }
);

const Education = mongoose.models.Education || mongoose.model("Education", EducationSchema);

export default Education;