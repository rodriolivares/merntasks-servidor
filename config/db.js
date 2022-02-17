const mongooose = require('mongoose');
require('dotenv').config({ path: 'variables.env' });

const conectarDB = async () => {
   
   try {
      await mongooose.connect(process.env.DB_MONGO, {
			useNewUrlParser: true,
         useUnifiedTopology: true,
			// useFindAndModify: false
		})
      console.log('db conectada');
   } catch (error) {
      console.log(error);
      process.exit(1); //Detener la app
   }
}

module.exports = conectarDB;