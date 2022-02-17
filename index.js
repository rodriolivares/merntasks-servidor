const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors')

// creamos el servidor
const app = express();

//conectar a la bd:
conectarDB();

// habilitar cors 
app.use(cors());

// Habilitar express.json
app.use( express.json({ extended: true}) )

// puerto de la app
const PORT = process.env.PORT || 4000;

//importar rutas
app.use('/api/usuarios', require('./routes/usuarios'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/proyectos', require('./routes/proyectos'))
app.use('/api/tareas', require('./routes/tareas'))

// Definir la pagina principal
// app.get('/', (req, res) => {
//    res.send('Hola Mundo')
// });

// arrancamos la app (o el servidor):
app.listen(PORT, () => {
   console.log(`El servidor esta funcionando en el puerto ${PORT}`)
});

