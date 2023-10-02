import { Router } from 'express';
import { check } from 'express-validator';
import { buscar } from '../controllers/buscar.js';

const router = Router();

router.get('/:coleccion/:termino', buscar);

export { router };
