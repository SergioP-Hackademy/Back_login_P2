require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const rutes = require('../api/route');
const path = require('path');
const helmet = require('helmet');

// const io = require('socket.io')
const chalk = require('chalk');
const log = console.log;
const app = express();

// config cors
// const corsOptions = {
//   origin: 'http://localhost:3050',
// };

// midelwares
app.use(cors());
app.use(morgan('dev'));
// app.use(bodyParser.json());

app.use(express.json());
app.use(helmet());


// static resources
app.use(express.static(path.join(__dirname, 'public')));

// start path
app.get('/', (req, res) => {
  res.status(200).send({ message: 'Server OK' });
});

app.use('/api/v1', rutes);
// rout of acces----> http://localhost:3050/api/v1/<name API>/<metod for acces>

// set port, listen for requests
const PORT = process.env.PORT || 3050;
let server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

