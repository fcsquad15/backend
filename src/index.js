const express = require('express');
const dotenv = require('dotenv')

dotenv.config({ path: './env/.env' });

const app = express();
const cors = require('cors')
const rotas = require('./Routes/rotas');


app.use(express.json({ limit: "5mb" }));
app.use(cors());
app.use(rotas);


const port = process.env.PORT
app.listen(port)