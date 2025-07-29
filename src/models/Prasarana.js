// models/Prasarana.js
import mongoose from "mongoose";

const PrasaranSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: [true, "Nama prasarana wajib diisi"],
    trim: true
  },
  kategori: {
    type: String,
    required: [true, "Kategori wajib diisi"],
    enum: ["Transportasi", "Pendidikan", "Kesehatan", "Ibadah", "Olahraga", "Sosial", "Ekonomi", "Lainnya"],
    trim: true
  },
  deskripsi: {
    type: String,
    required: [true, "Deskripsi wajib diisi"],
    trim: true
  },
  foto: {
    type: String,
    default: ""
  },
  tahun_pembangunan: {
    type: String,
    required: [true, "Tahun pembangunan wajib diisi"],
    trim: true
  },
  lokasi: {
    type: String,
    required: [true, "Lokasi wajib diisi"],
    trim: true
  },
  // Field opsional untuk lokasi maps
  maps_link: {
    type: String,
    default: "",
    trim: true
  }
}, {
  timestamps: true // Menambahkan createdAt dan updatedAt
});

// Index untuk pencarian
PrasaranSchema.index({ nama: 'text', deskripsi: 'text' });
PrasaranSchema.index({ kategori: 1 });

const Prasarana = mongoose.models.Prasarana || mongoose.model("Prasarana", PrasaranSchema);

export default Prasarana;