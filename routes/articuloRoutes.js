
import express from 'express';
import {
    getAllArticulos,
    getArticuloById,
    createArticulo,
    updateArticulo,
    deleteArticulo
} from '../controllers/articuloController.js';

const router = express.Router();

router.get('/', getAllArticulos);
router.get('/:id', getArticuloById);
router.post('/', createArticulo);
router.put('/:id', updateArticulo);
router.delete('/:id', deleteArticulo);

export default router;
