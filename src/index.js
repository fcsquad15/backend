const express = require('express');
const rotas = require('./rotas');
const cors = require('cors')

const app = express();

app.use(express.json());
app.use(cors());

app.use(rotas);
const port = process.env.PORT || 8000
app.listen(port)