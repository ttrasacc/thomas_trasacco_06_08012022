const cors = require('cors');
const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const { routes } = require('./routes');
require('dotenv').config()
const { authenticateToken } = require('./app');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(authenticateToken);

mongoose.connect(process.env.DB_URL,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || '3000');
console.log(process.env.PORT)
app.set('port', port);

const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
};

app.use('/images', express.static(path.join(__dirname, 'images')));
for (let route in routes) app.use(route, routes[route]);
console.log(path.join(__dirname, 'images'));

const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);
