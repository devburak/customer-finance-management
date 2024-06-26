const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  phone: { type: String, required: false },
  email: { type: String, required: false },
  gsm: { type: String, required: false }
}, { _id: false });

const responsiblePersonContactSchema = new mongoose.Schema({
  phone: { type: String, required: false },
  email: { type: String, required: false }
}, { _id: false });

const responsiblePersonSchema = new mongoose.Schema({
  name: { type: String, required: false },
  title: { type: String, required: false },
  contact: responsiblePersonContactSchema
}, { _id: false });

const customerSchema = new mongoose.Schema({
  companyName: { type: String, required: true }, // Şirket adı zorunlu
  taxOffice: { type: String, required: false }, // Vergi dairesi
  taxNumber: { type: String, required: false }, // Vergi numarası
  address: { type: String, required: false }, // Adres
  contact: contactSchema, // İletişim bilgileri
  responsiblePerson: responsiblePersonSchema, // Sorumlu kişi bilgileri
  type: { type: String, enum: ['satıcı', 'alıcı', 'işçi', 'toptancı'], required: false }, // Tip: satıcı, alıcı, işçi, toptancı
  status: { type: String, enum: ['aktif', 'pasif'], default: 'aktif' }, 
  notes: { type: String, required: false }, 
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
