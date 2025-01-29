import express, { Router } from 'express';
import { signUp, signIn, single, all, update, delete1, deleteAll } from '../controllers/users'; 
import authenticate from '../middlewares/authenticate';

const router: Router = Router(); 

router.post('/signUp', signUp);
router.post('/signIn', signIn);
router.get( '/all', all );
router.get( '/single/:id', single )
router.put('/update/:id', authenticate, update)
router.delete('/delete/:id', authenticate, delete1)
router.delete('/deleteAll', authenticate, deleteAll)

export default router;
