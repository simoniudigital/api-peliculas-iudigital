const { Schema, model } = require('mongoose');

const DirectorSchema = new Schema(
  {
    nombres: { type: String, required: [true, 'Los nombres son obligatorios'], trim: true },
    estado: { type: String, required: true, enum: ['Activo', 'Inactivo'], default: 'Activo' },
  },
  { timestamps: { createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' }, versionKey: false }
);

module.exports = model('Director', DirectorSchema);
