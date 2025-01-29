import express from 'express';
import { add, update, delete1, deleteAll } from '../controllers/comments';
import isUser from '../middlewares/isUser';

const router = express.Router();

router.post('/add/:id', isUser, add);
router.put('/update/:id', isUser, update);
router.delete('/delete/:id', isUser, delete1);
router.delete('/deleteAll', isUser, deleteAll)

export default router;
