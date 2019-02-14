import express from 'express';
import { createSeller, getSellers } from '../models/sellers';

const router = express.Router();

router.post('/', async (req, res) => {
  await createSeller(req.body.name);

  res.status(201).send('Added');
});

router.get('/', async (req, res) => {
  const sellers = await getSellers();

  res.status(200).json({
    sellers,
  });
});

export default router;
