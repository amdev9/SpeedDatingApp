import express, { Router } from 'express';
// Import index action from movies controller
import { list } from './controllers/events';

// Initialize the router
const router = Router();

// Handle /movies.json route with index action from movies controller
router.route('/events')
  .get(list);

export default router;

