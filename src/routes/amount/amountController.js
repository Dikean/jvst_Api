const { Router } = require('express');
const db = require('../../db'); // Ajusta la ruta según tu estructura
const router = Router();

// Obtener todos los consignments
router.get('/api/amount', (req, res) => {
 
  const exampleData = [
    {
      id: 1,
      date: '2023-08-15',
      amount: 1500,
      bank: 'Banco Ejemplo',
      voucher: '12345',
      users_id: 123
    },
    {
      id: 2,
      date: '2023-08-14',
      amount: 2000,
      bank: 'Otro Banco',
      voucher: '67890',
      users_id: 456
    }
  ];

  res.status(200).json(exampleData);

  // const query = 'SELECT * FROM consignments';
  // db.query(query, (err, results) => {
  //   if (err) {
  //     res.status(500).json({ error: 'Error al obtener datos de la base de datos' });
  //   } else {
  //     res.status(200).json(results);
  //   }
  // });
});

// Crear un nuevo consignments
router.post('/api/amount', (req, res) => {
    const { date, amount, bank, voucher, users_id } = req.body;
  
    const query = `INSERT INTO consignments (date, amount, bank, voucher, users_id) VALUES (?, ?, ?, ?, ?)`;
    db.query(query, [date, amount, bank, voucher, users_id], (err, result) => {
      if (err) {
        console.log('Error en la consulta SQL:', err);
        res.status(500).json({ error: 'Error al crear un nuevo documento', details: err });
      } else {
        res.status(201).json({ message: 'Documento creado exitosamente' });
      }
    });
  });

// Eliminar un consignments por su ID
router.delete('/api/amount/:id', (req, res) => {
    const fileId = req.params.id;
  
    const query = 'DELETE FROM consignments WHERE id = ?';
    db.query(query, [fileId], (err, result) => {
      if (err) {
        console.log('Error en la consulta SQL:', err);
        res.status(500).json({ error: 'Error al eliminar el documento', details: err });
      } else {
        res.status(200).json({ message: 'Documento eliminado exitosamente' });
      }
    });
  });
  
  // Obtener consignments8 de un usuario específico
router.get('/api/amount/:id/amount', (req, res) => {
    const userId = req.params.id;
    const query = 'SELECT * FROM consignments WHERE users_id = ?';
    db.query(query, [userId], (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error al obtener datos de la base de datos' });
      } else {
        res.status(200).json(results);
      }
    });
  });


module.exports = router;


