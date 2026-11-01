const { Schema, model } = require('mongoose');

const MediaSchema = new Schema(
  {
    serial: { type: String, required: [true, 'El serial es obligatorio'], unique: true, trim: true },
    titulo: { type: String, required: [true, 'El título es obligatorio'], trim: true },
    sinopsis: { type: String, trim: true, default: '' },
    url: { type: String, required: [true, 'La URL es obligatoria'], unique: true, trim: true },
    imagenPortada: { type: String, trim: true, default: '' },
    anioEstreno: { type: Number, required: [true, 'El año de estreno es obligatorio'] },
    genero: { type: Schema.Types.ObjectId, ref: 'Genero', required: true },
    director: { type: Schema.Types.ObjectId, ref: 'Director', required: true },
    productora: { type: Schema.Types.ObjectId, ref: 'Productora', required: true },
    tipo: { type: Schema.Types.ObjectId, ref: 'Tipo', required: true },
  },
  { timestamps: { createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' }, versionKey: false }
);

module.exports = model('Media', MediaSchema, 'medias');
