import express from 'express';
import { 
    getAllUsuarios, 
    getUsuarioById, 
    getUsuarioByEmail,
    createUsuario, 
    updateUsuario, 
    deleteUsuario 
} from '../controllers/usuarioController.js';

const router = express.Router();

router.get('/', getAllUsuarios);
router.get('/:id', getUsuarioById);
router.get('/email/:email', getUsuarioByEmail);
router.post('/', createUsuario);
router.put('/:id', updateUsuario);
router.delete('/:id', deleteUsuario);

export default router;
