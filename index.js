import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import articuloRoutes from './routes/articuloRoutes.js';
import compraRoutes from './routes/compraRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(cors());
app.use('/imagenes', express.static(path.join(__dirname, 'public/imagenes')));
app.use(bodyParser.json());

app.use('/articulos', articuloRoutes);
app.use('/compra', compraRoutes);
app.use('/usuarios', usuarioRoutes);

// Middleware de manejo de errores
const errorHandler = (err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Se produjo un error en el servidor' });
};

app.use(errorHandler);

app.listen(3001, () => {
    console.log('El servicio está en el puerto 3001');
});
