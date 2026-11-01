const mongoose = require('mongoose');

const getConnection = async (uri = process.env.MONGO_URI) => {
  try {
    await mongoose.connect(uri);
    console.log(`Conexión exitosa a MongoDB (${mongoose.connection.name})`);
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error.message);
    throw new Error('No fue posible conectar con la base de datos');
  }
};

module.exports = { getConnection };
