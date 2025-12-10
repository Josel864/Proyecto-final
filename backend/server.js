const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const { testConnection } = require('./src/config/db');
const authRoutes = require('./src/routes/auth.routes');
const materiasRoutes = require('./src/routes/materias.routes');
const tareasRoutes = require('./src/routes/tareas.routes');
const examenesRoutes = require('./src/routes/examenes.routes'); // 👈 nuevo
const reportesRoutes = require('./src/routes/reportes.routes');


const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

testConnection();

app.get('/', (req, res) => {
  res.json({ mensaje: 'API UniPlanner funcionando 🚀' });
});

app.use('/api/auth', authRoutes);
app.use('/api/materias', materiasRoutes);
app.use('/api/tareas', tareasRoutes);
app.use('/api/examenes', examenesRoutes);
app.use('/api/reportes', reportesRoutes);


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en el puerto ${PORT}`);
});
