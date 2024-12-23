import { Router } from 'express';
import * as usersController from '../controllers/usersController';

const router = Router();


router.post('/saveUser', usersController.addUser);


router.get('/getUserById/:id', usersController.getUser);


router.get('/getAllUsers', usersController.getAllUsers);


router.put('/returnBook/:id', usersController.returnBook);


router.put('/lendBook/:id', usersController.lendBookToUser);

export default router;
