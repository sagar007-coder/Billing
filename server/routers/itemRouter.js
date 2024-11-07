import express from 'express';
import { addItem, fetchData, getItems, submitForm } from '../controllers/itemController.js';

const router = express.Router();

// Route to fetch items
router.get('/', getItems);

// Route to add a new item
router.post('/', addItem);
router.post('/submit', submitForm);
router.get('/fetchData',fetchData);
export default router;
