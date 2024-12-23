import { Router } from 'express';
import * as booksController from '../controllers/booksController';

const router = Router();


router.post('/saveBook', booksController.addBook);


router.get('/getBookById/:id', booksController.getBook);


router.get('/getAllBooks', booksController.getAllBooks);

router.put('/updateOwner/:id', booksController.updateOwner);

export default router;
