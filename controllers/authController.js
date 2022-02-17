const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')

exports.autenticarUsuario = async (req, res) => {

   // revisar errores de express 
   const errores = validationResult(req);
   if( !errores.isEmpty() ) {
      return res.status(400).json({ errores: errores.array()})
   }

   const { email, password } = req.body
   try {
      // Revisar que el revisar que el usuario exista comparando el email 
      let usuario = await Usuario.findOne({ email });

      if(!usuario) {
         return res.status(400).json({ msg: 'El usuario no existe'})
      }

      // Revisar el password 
      const passCorrecto = await bcryptjs.compare(password, usuario.password)
      if(!passCorrecto) {
         return res.status(400).json({msg: 'La contraseña es incorrecta'})
      }

      // si todo es correcto: crear y firmar el jwt
      const payload = {
         usuario: {
            id: usuario.id 
         }
      };

      // // firmar el JWT
      jwt.sign(payload, process.env.SECRETA, {
         expiresIn: 3600 //1hora
      }, (error, token) => {
         if(error) throw error;
         // Mensaje de confirmacion
         res.json({ msg: 'Usuario autenticado correctamente', token })
      })
   } catch (error) {
      console.log(error);
      res.status(400).send('Hubo un error')
   }
}

// Obtiene que usuario esta autenticado
exports.usuarioAutenticado = async (req, res) => {
   try {
      const usuario = await Usuario.findById(req.usuario.id).select('-password')
      res.json({usuario})
   } catch (error) {
      console.log(error);
      res.status(500).json({ msg: 'Hubo un error'})
   }
}