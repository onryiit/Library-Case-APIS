import { Request, Response } from 'express';
import db from '../firebaseConfig'; 

const booksRef = db.ref('books'); 

export const addBook = (req: Request, res: Response) => {
  const bookData = req.body;
  const newBookRef = booksRef.push();

  newBookRef.set(bookData)
    .then(() => {
      res.status(200).send('Book added successfully');
    })
    .catch((error) => {
      res.status(500).send('Error adding book: ' + error.message);
    });
};

export const getBook = (req: Request, res: Response) => {
    const bookId = req.params.id;
  
    booksRef.child(bookId).once('value', (snapshot) => {
      if (snapshot.exists()) {
        const book = snapshot.val();

        const mappedBooks = {
          id: bookId,
          name: book.name,  
          date: book.date,
          book_detail:book.book_detail
        };
  
        res.status(200).send(mappedBooks);
      } else {
        res.status(404).send('Book not found');
      }
    });
  };
export const getAllBooks = (req: Request, res: Response) => {
  booksRef.once('value', (snapshot) => {
      if (snapshot.exists()) {
        const books = snapshot.val();
  
        const mappedBooks= Object.keys(books).map((key) => {
          const book = books[key];
          return {
            id: key,   
            name: book.name,  
            date: book.date,
            book_detail:book.book_detail
          };
        });
  
        res.status(200).send(mappedBooks);
      } else {
        res.status(404).send('No users found');
      }
    });
  };

  export const updateOwner = (req: Request, res: Response) => {
    const bookId = req.params.id;
    const owner = req.body.owner;
  
    if (!owner) {
      return res.status(400).send('Owner is required');
    }
  
    booksRef.child(bookId).once('value', (snapshot) => {
      if (snapshot.exists()) {
        const book = snapshot.val();
        const bookDetail = book.book_detail;
  
        if (bookDetail && bookDetail.length > 0) {
          bookDetail[0].owner = owner;
  
          booksRef.child(bookId).update({ book_detail: bookDetail })
            .then(() => {
              res.status(200).send('Owner updated successfully');
            })
            .catch((error) => {
              res.status(500).send('Error updating owner: ' + error.message);
            });
        } else {
          res.status(404).send('Book details not found');
        }
      } else {
        res.status(404).send('Book not found');
      }
    });
  };
  