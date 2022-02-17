const Tarea = require('../models/Tarea')
const Proyecto = require('../models/Proyecto')
const { validationResult } = require('express-validator')

// Crea una nueva tarea 
exports.crearTarea = async (req, res) => {
   // revisar errores de express 
   const errores = validationResult(req);
   if( !errores.isEmpty() ) {
      return res.status(400).json({ errores: errores.array()})
   }
   try {
      // extraer el proyecto y comprobar si existe 
      const { proyecto } = req.body
      const existeProyecto = await Proyecto.findById(proyecto)
      if(!existeProyecto) {
         return res.status(404).json({ msg: 'Proyecto no encontrado'})
      }
      // revisar si el proy atual pertenece al usuairo autenticado (ref del proy = a id usuario autenticado)
      if(existeProyecto.creador.toString() !== req.usuario.id) {
         return res.status(401).json({ msg: 'No autorizado' })
      }
      // creamos la tarea
      const tarea = new Tarea(req.body);
      await tarea.save()
      res.json({ tarea })
   } catch (error) {
      console.log(error);
      res.status(500).send('Hubo un error')
   }
}

// obtener tareas por proyecto
exports.obtenerTareas = async (req, res) => {
   try {
      // extraer el proyecto y comprobar si existe 
      const { proyecto } = req.query
      const existeProyecto = await Proyecto.findById(proyecto)
      if(!existeProyecto) {
         return res.status(404).json({ msg: 'Proyecto no encontrado'})
      }
      // revisar si el proy atual pertenece al usuairo autenticado (ref del proy = a id usuario autenticado)
      if(existeProyecto.creador.toString() !== req.usuario.id) {
         return res.status(401).json({ msg: 'No autorizado' })
      }
      // obtener la tarea por proyecto
      const tareas = await Tarea.find({ proyecto }).sort({ creado: -1 })
      res.json({ tareas })
   } catch (error) {
      console.log(error);
      res.status(500).send('Hubo un error')
   }
}

exports.actualizarTarea = async (req, res) => {
   try {
      // extraer el proyecto y comprobar si existe 
      const { proyecto, nombre, estado } = req.body;

      // hay que verificar que la tarea exista. lo cual implica que el proy exista asi que es como verificar ambas:
      let tarea = await Tarea.findById(req.params.id);
      if(!tarea) {
         return res.status(404).json({ msg: 'La Tarea no existe'})
      }
      // extraer proyecto
      const existeProyecto = await Proyecto.findById(proyecto)
      // revisar si el proy atual pertenece al usuairo autenticado (ref del proy = a id usuario autenticado)
      if(existeProyecto.creador.toString() !== req.usuario.id) {
         return res.status(401).json({ msg: 'No autorizado' })
      }
      
      // crear un objeto con la nueva informacion
      const nuevaTarea = {};
      nuevaTarea.nombre = nombre;
      nuevaTarea.estado = estado;
      // guardar la tarea 
      tarea = await Tarea.findOneAndUpdate({ _id: req.params.id }, nuevaTarea, { new: true } );
      res.json({ tarea })
   } catch (error) {
      console.log(error);
      res.status(500).send('Hubo un error')      
   }
}

exports.eliminarTarea = async (req, res) => {
   try {
      // extraer el proyecto y comprobar si existe 
      const { proyecto } = req.query;

      // hay que verificar que la tarea exista. lo cual implica que el proy exista asi que es como verificar ambas:
      let tarea = await Tarea.findById(req.params.id);
      if(!tarea) {
         return res.status(404).json({ msg: 'La Tarea no existe'})
      }
      // extraer proyecto
      const existeProyecto = await Proyecto.findById(proyecto)
      // revisar si el proy atual pertenece al usuairo autenticado (ref del proy = a id usuario autenticado)
      if(existeProyecto.creador.toString() !== req.usuario.id) {
         return res.status(401).json({ msg: 'No autorizado' })
      }
      // eliminar 
      await Tarea.findOneAndRemove({ _id: req.params.id})
      res.json({msg: 'Tarea eliminada'})
      
   } catch (error) {
      console.log(error);
      res.status(500).send('Hubo un error')      
   }
}
