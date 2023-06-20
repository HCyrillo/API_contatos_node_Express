import { Router } from 'express';
import {getContatos,getContato, postContato,putContato,deleteContato } from './controlador.js';
const router = Router();

router
    .post('/', postContato)
    .get('/', getContatos)
    .get('/:id', getContato)
    .put('/:id', putContato)
    .delete('/:id', deleteContato)

export default router;