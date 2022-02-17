const Proyecto = require('../models/Proyecto')
const Tarea = require('../models/Tarea');
const { validationResult } = require('express-validator')

exports.crearProyecto = async (req, res) => {
   // revisar errores de express 
   const errores = validationResult(req);
   if( !errores.isEmpty() ) {
      return res.status(400).json({ errores: errores.array()})
   }
   try {
      // creamos un nuevo proyecto
      const proyecto = new Proyecto(req.body)
      // guardar el creador via jwt
      proyecto.creador = req.usuario.id
      proyecto.save()
      res.json(proyecto)
   } catch (error) {
      console.log(error);
      res.status(500).send('Hubo un error')
   }
}
// obtener los proyectos del usuario actual:
exports.obtenerProyectos = async (req, res) => {
   try {
      const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({ creado: -1 });
      res.json({ proyectos });
   } catch (error) {
      console.log(error);
      res.status(500).send('Hubo un error')
   }
}
// Actualiza un proyecto
exports.actualizarProyecto = async (req, res) => {
   // revisar errores de express 
   const errores = validationResult(req);
   if( !errores.isEmpty() ) {
      return res.status(400).json({ errores: errores.array()})
   }
   // extraer la informacion del proyecto 
   const { nombre } = req.body
   const nuevoProyecto = {}
   if(nombre) {
      nuevoProyecto.nombre = nombre
   }

   try {
      // primero revisamos el id 
      let proyecto = await Proyecto.findById(req.params.id)
		//verificamos que exista el proyecto
      if(!proyecto) {
         return res.status(404).json({ msg: 'Proyecto no encontrado' })
      }
		// verificar el creador del proyecto (la persona autenticada coincide con el creador del proyecto)
      if(proyecto.creador.toString() !== req.usuario.id) {
         return res.status(401).json({ msg: 'No autorizado' })
      }
		// actualizar
      proyecto = await Proyecto.findByIdAndUpdate({ _id: req.params.id }, { $set: nuevoProyecto }, { new: true });
      res.json({proyecto})
   } catch (error) {
      console.log(error);
      res.status(500).send('Error en el servidor')
   }
}

// Elimina un proyecto por su id
exports.eliminarProyecto = async (req, res) => {
   try {
      // primero revisamos el id 
      let proyecto = await Proyecto.findById(req.params.id)
		//verificamos que exista el proyecto
      if(!proyecto) {
         return res.status(404).json({ msg: 'Proyecto no encontrado' })
      }
		// verificar el creador del proyecto (la persona autenticada coincide con el creador del proyecto)
      if(proyecto.creador.toString() !== req.usuario.id) {
         return res.status(401).json({ msg: 'No autorizado' })
      } 
      //Eliminar las tareas pertenecientes al ID de proyecto
      await Tarea.deleteMany({ proyecto: req.params.id });
      // Eliminar el Proyecto
      await Proyecto.findOneAndRemove({ _id: req.params.id })
      res.json({ msg: 'Proyecto eliminado' })
   } catch (error) {
         console.log(error);
         res.status(500).send('Error en el servidor')
   }
}