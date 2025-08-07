// models/Potensi.js
import mongoose from "mongoose";

const PotensiSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: [true, "Nama potensi wajib diisi"],
    trim: true
  },
  kategori: {
    type: String,
    required: [true, "Kategori wajib diisi"],
    enum: ["UMKM", "Wisata", "Pertanian", "Peternakan", "Kerajinan","Situs","Budaya","Lainnya"],
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
  tahun_mulai: {
    type: Number,
    required: [true, "Tahun mulai wajib diisi"],
    min: [1900, "Tahun tidak valid"],
    max: [new Date().getFullYear(), "Tahun tidak boleh lebih dari tahun ini"]
  },
  lokasi: {
    type: String,
    required: [true, "Lokasi wajib diisi"],
    trim: true
  },
  // Field opsional untuk sosial media dan e-commerce
  maps_link: {
    type: String,
    default: "",
    trim: true
  },
  shopee_link: {
    type: String,
    default: "",
    trim: true
  },
  facebook_link: {
    type: String,
    default: "",
    trim: true
  },
  instagram_link: {
    type: String,
    default: "",
    trim: true
  },
  whatsapp_link: {
    type: String,
    default: "",
    trim: true
  }
}, {
  timestamps: true // Menambahkan createdAt dan updatedAt
});

// Index untuk pencarian
PotensiSchema.index({ nama: 'text', deskripsi: 'text' });
PotensiSchema.index({ kategori: 1 });

const Potensi = mongoose.models.Potensi || mongoose.model("Potensi", PotensiSchema);

export default Potensi;