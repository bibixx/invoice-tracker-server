import express from 'express';
import { createSellerPost, getSellersGet, getSellerByIdGet } from '../controllers/sellers';

const router = express.Router();

router.post('/', createSellerPost);
router.get('/:id', getSellerByIdGet);
router.get('/', getSellersGet);

export default router;
