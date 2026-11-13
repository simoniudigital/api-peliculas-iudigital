// Datos iniciales que pide el caso de estudio: géneros y tipos de multimedia
const generos = [
  { nombre: 'Acción', descripcion: 'Películas y series con escenas de alto impacto' },
  { nombre: 'Aventura', descripcion: 'Historias de viajes, exploración y desafíos' },
  { nombre: 'Ciencia ficción', descripcion: 'Historias basadas en avances científicos o futuros posibles' },
  { nombre: 'Drama', descripcion: 'Historias centradas en conflictos emocionales' },
  { nombre: 'Terror', descripcion: 'Historias que buscan generar miedo o suspenso' },
];

const tipos = [
  { nombre: 'Película', descripcion: 'Producción audiovisual de una sola emisión' },
  { nombre: 'Serie', descripcion: 'Producción audiovisual dividida en temporadas y episodios' },
];

module.exports = { generos, tipos };
