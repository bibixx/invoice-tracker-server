import express from 'express';
import sellers from './sellers';

const router = express.Router();

router.use('/sellers', sellers);

export default router;
