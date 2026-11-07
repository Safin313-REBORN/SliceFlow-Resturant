import express from 'express';
import {
  getPizzas,
  getPizzaById,
  getPizzaBuilderOptions,
} from '../controllers/pizzaController.js';

const router = express.Router();

router.get('/pizzas', getPizzas);
router.get('/pizzas/:id', getPizzaById);
router.get('/menu', getPizzas);
router.get('/menu/:id', getPizzaById);
router.get('/pizza-builder/options', getPizzaBuilderOptions);

export default router;

