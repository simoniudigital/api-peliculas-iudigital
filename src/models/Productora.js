const { Schema, model } = require('mongoose');

const ProductoraSchema = new Schema(
  {
    nombre: { type: String, required: [true, 'El nombre de la productora es obligatorio'], unique: true, trim: true },
    estado: { type: String, required: true, enum: ['Activo', 'Inactivo'], default: 'Activo' },
    slogan: { type: String, trim: true, default: '' },
    descripcion: { type: String, trim: true, default: '' },
  },
  { timestamps: { createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' }, versionKey: false }
);

module.exports = model('Productora', ProductoraSchema);
