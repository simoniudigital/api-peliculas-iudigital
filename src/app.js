const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { notFound, errorHandler } = require('./middlewares/error-handler');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

// Raíz: documentación rápida de los endpoints disponibles
app.get('/', (req, res) => {
  res.json({
    ok: true,
    msg: 'API REST Películas y Series - IU Digital de Antioquia',
    endpoints: ['/api/generos', '/api/directores', '/api/productoras', '/api/tipos', '/api/medias'],
  });
});

// Rutas de los módulos
app.use('/api/generos', require('./routes/genero.routes'));
app.use('/api/directores', require('./routes/director.routes'));
app.use('/api/productoras', require('./routes/productora.routes'));
app.use('/api/tipos', require('./routes/tipo.routes'));
app.use('/api/medias', require('./routes/media.routes'));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
