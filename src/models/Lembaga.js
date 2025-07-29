// models/Lembaga.js
import mongoose from "mongoose";

const LembagaSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: [true, "Nama lembaga wajib diisi"],
    trim: true
  },
  kategori: {
    type: String,
    required: [true, "Kategori wajib diisi"],
    enum: [
      "Pemerintahan", 
      "Pendidikan", 
      "Kesehatan", 
      "Keagamaan", 
      "Sosial", 
      "Ekonomi", 
      "Keamanan", 
      "Budaya",
      "Lingkungan",
      "Pemuda",
      "Perempuan",
      "Lainnya"
    ],
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
}, {
  timestamps: true // Menambahkan createdAt dan updatedAt
});

// Index untuk pencarian
LembagaSchema.index({ nama: 'text', deskripsi: 'text' });
LembagaSchema.index({ kategori: 1 });
LembagaSchema.index({ status: 1 });

const Lembaga = mongoose.models.Lembaga || mongoose.model("Lembaga", LembagaSchema);

export default Lembaga;