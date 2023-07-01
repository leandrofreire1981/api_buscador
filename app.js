const express = require('express');
const mysql = require('mysql');
require('dotenv').config()


const app = express();
const port = process.env.PORT;
const api_host = process.env.HOST;
const api_user = process.env.USER;
const api_pass = process.env.PASSWORD;
const api_database = process.env.DATABASE;


// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
  host: api_host,
  user: api_user,
  password: api_pass,
  database: api_database
});
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Reemplaza con el dominio de tu cliente web
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Conexión a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos');
});

// Middleware para el manejo de JSON
app.use(express.json());

// Ruta para la búsqueda de productos
app.get('/api/products/search', (req, res) => {
  const term = req.query.term;
  const query = `SELECT * FROM productos WHERE descripcion LIKE '%${term}%' OR marca LIKE '%${term}%' OR categoria LIKE '%${term}%' OR proveedor LIKE '%${term}%'`;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al buscar productos:', err);
      res.sendStatus(500);
      return;
    }
    res.json(results);
  });
});

// Ruta para agregar un producto
app.post('/api/products', (req, res) => {
  const productData = req.body;
  const query = 'INSERT INTO productos SET ?';

  db.query(query, productData, (err, result) => {
    if (err) {
      console.error('Error al agregar un producto:', err);
      res.sendStatus(500);
      return;
    }
    res.sendStatus(201);
  });
});

// Ruta para actualizar un producto
app.put('/api/products/:productId', (req, res) => {
  const productId = req.params.productId;
  const productData = req.body;
  const query = 'UPDATE productos SET ? WHERE id = ?';

  db.query(query, [productData, productId], (err, result) => {
    if (err) {
      console.error('Error al actualizar un producto:', err);
      res.sendStatus(500);
      return;
    }
    res.sendStatus(200);
  });
});

// Ruta para eliminar un producto
app.delete('/api/products/:productId', (req, res) => {
  const productId = req.params.productId;
  const query = 'DELETE FROM productos WHERE id = ?';

  db.query(query, productId, (err, result) => {
    if (err) {
      console.error('Error al eliminar un producto:', err);
      res.sendStatus(500);
      return;
    }
    res.sendStatus(200);
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor API escuchando en el puerto ${port}`);
});
