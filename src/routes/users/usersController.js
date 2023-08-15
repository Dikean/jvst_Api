const { Router } = require('express');
const jwt = require('jsonwebtoken');//JWT
const bcrypt = require('bcrypt'); // Importa el módulo bcrypt
const db = require('../../db'); // Ajusta la ruta según tu estructura
const router = Router();

// Obtener todos los usuarios
router.get('/api/users', (req, res) => {
  const query = 'SELECT * FROM users';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error al obtener datos de la base de datos' });
    } else {
      res.status(200).json(results);
    }
  });
});



// Crear un nuevo usuario
router.post('/api/users', (req, res) => {
  const { name, lastname, email, password, role, address, postal_code, city, country, date, about_me } = req.body;

  // Hashear la contraseña antes de almacenarla
  bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
    if (hashErr) {
      res.status(500).json({ error: 'Error al crear una nueva contraseña' });
    } else {
      const query = `INSERT INTO users (name, lastname, email, password, role, address, postal_code, city, country, date, about_me) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      db.query(query, [name, lastname, email, hashedPassword, role, address, postal_code, city, country, date, about_me], (err, result) => {
        if (err) {
          console.log('Error en la consulta SQL:', err);
          res.status(500).json({ error: 'Error al crear un nuevo usuario', details: err });
        } else {
          // Obtener el ID del usuario recién creado
          const userId = result.insertId;

          // Generar un token JWT para el usuario
          const token = jwt.sign({ userId: userId }, 'clave-secreta', { expiresIn: '3h' });

          // Datos del usuario excepto la contraseña
          const userData = {
            id: userId,
            name: name,
            lastname: lastname,
            email: email,
            role: role,
            address: address,
            postal_code: postal_code,
            city: city,
            country: country,
            date: date,
            about_me: about_me
            // Agrega otros datos que quieras enviar en la respuesta
          };

          res.status(201).json({ message: 'Usuario creado exitosamente', token: token, userData: userData });
        }
      });
    }
  });
});




// Método de inicio de sesión
router.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ?';

  db.query(query, [email], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error al obtener datos de la base de datos' });
    } else {
      if (results.length === 0) {
        res.status(401).json({ error: 'Usuario no encontrado' });
      } else {
        const user = results[0];

        // Compara la contraseña proporcionada con la contraseña almacenada usando bcrypt
        bcrypt.compare(password, user.password, (bcryptErr, bcryptResult) => {
          if (bcryptErr || !bcryptResult) {
            res.status(401).json({ error: 'Credenciales incorrectas' });
          } else {
            // Contraseña correcta, se genera el token JWT
            const token = jwt.sign({ userId: user.id }, 'clave-secreta', { expiresIn: '3h' });

            // Datos del usuario excepto la contraseña
            const userData = {
              id: user.id,
              name: user.name,
              lastname: user.lastname,
              email: user.email,
              role: user.role,
              address: user.address,
              postal_code: user.postal_code,
              city: user.city,
              country: user.country,
              date: user.date,
              about_me: user.about_me
              // Agrega otros datos que quieras enviar en la respuesta
            };

            res.status(200).json({ token: token, userData: userData });
          }
        });
      }
    }
  });
});


module.exports = router;


