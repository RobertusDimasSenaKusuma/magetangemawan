// models/Kegiatan.js
import mongoose from "mongoose";

const KegiatanSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: [true, "Nama kegiatan wajib diisi"],
    trim: true
  },
  kategori: {
    type: String,
    required: [true, "Kategori wajib diisi"],
    enum: [
      "Sosial",
      "Budaya", 
      "Keagamaan",
      "Pendidikan",
      "Kesehatan",
      "Ekonomi",
      "Lingkungan",
      "Olahraga",
      "Pemuda",
      "Perempuan",
      "Pemerintahan",
      "Keamanan",
      "Gotong Royong",
      "Pelatihan",
      "Lainnya"
    ],
    trim: true
  },
  deskripsi: {
    type: String,
    required: [true, "Deskripsi wajib diisi"],
    trim: true
  },
  tahun: {
    type: Number,
    required: [true, "Tahun kegiatan wajib diisi"],
    min: [1900, "Tahun tidak valid"],
    max: [new Date().getFullYear() + 5, "Tahun tidak boleh terlalu jauh ke depan"]
  },
  foto: {
    type: String,
    default: ""
  }
}, {
  timestamps: true // Menambahkan createdAt dan updatedAt
});

// Index untuk pencarian
KegiatanSchema.index({ nama: 'text', deskripsi: 'text' });
KegiatanSchema.index({ kategori: 1 });
KegiatanSchema.index({ tahun: 1 });

const Kegiatan = mongoose.models.Kegiatan || mongoose.model("Kegiatan", KegiatanSchema);

export default Kegiatan;