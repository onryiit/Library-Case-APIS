import { Request, Response } from 'express';
import db from '../firebaseConfig'; 

const usersRef = db.ref('users'); 

//Post Method for user
export const addUser = (req: Request, res: Response) => {
  const userData = req.body;
  const newUserRef = usersRef.push();
  
  newUserRef.set(userData)
    .then(() => {
      res.status(200).send('User added successfully');
    })
    .catch((error) => {
      res.status(500).send('Error adding user: ' + error.message);
    });
};
//Get Method for user by id
export const getUser = (req: Request, res: Response) => {
    const userId = req.params.id;
  
    usersRef.child(userId).once('value', (snapshot) => {
      if (snapshot.exists()) {
        const user = snapshot.val();

        const mappedUser = {
          id: userId, 
          name: user.name,
          date: user.date,
          books: user.books,
          previouslyBook:user.previouslyBook
        };
  
        res.status(200).send(mappedUser);
      } else {
        res.status(404).send('User not found');
      }
    });
  };
  
//Get Method for all user 
export const getAllUsers = (req: Request, res: Response) => {
    usersRef.once('value', (snapshot) => {
      if (snapshot.exists()) {
        const users = snapshot.val();
  
        const mappedUsers = Object.keys(users).map((key) => {
          const user = users[key];
          return {
            id: key,   
            name: user.name,  
            date: user.date,
            books:user.books,
            previouslyBook:user.previouslyBook
          };
        });
  
        res.status(200).send(mappedUsers);
      } else {
        res.status(404).send('No users found');
      }
    });
  };


  export const returnBook = (req: Request, res: Response) => {
    const userId = req.params.id;
    console.log(req.body)
    const { bookId, rating } = req.body; 
  
    if (!bookId) {
      return res.status(400).send('Book ID is required');
    }
  
    usersRef.child(userId).once('value', (snapshot) => {
      if (!snapshot.exists()) {
        return res.status(404).send('User not found');
      }
  
      const userData = snapshot.val();
      const books = userData.books || [];
      const previouslyBook = userData.previouslyBook || [];
 
      const bookIndex = books.findIndex((book: any) => book.id === bookId);
  
      if (bookIndex === -1) {
        return res.status(404).send('Book not found in user books');
      }
  
      const [removedBook] = books.splice(bookIndex, 1);
      const param = {
        ...removedBook,
        score: rating || 0
      }
      previouslyBook.push(param);
  
      usersRef.child(userId).set({
        ...userData,
        books: books,
        previouslyBook: previouslyBook,
      })
        .then(() => {
          res.status(200).send({
            message: 'Book moved to previouslyBook successfully',
            movedBook: removedBook,
          });
        })
        .catch((error) => {
          res.status(500).send('Error updating user: ' + error.message);
        });
    });
  };

  export const lendBookToUser = (req: Request, res: Response) => {
    const userId = req.params.id;
    const { bookId, name } = req.body;  
    
    if (!bookId || !name) {
      return res.status(400).send('Book ID and name are required');
    }
  
    const newBook = {
      id: bookId,
      name: name,
      date: Date.now()/1000, 
    };
  
    usersRef.child(userId).once('value', (snapshot) => {
      if (!snapshot.exists()) {
        return res.status(404).send('User not found');
      }
  
      const userData = snapshot.val();
      const books = userData.books || [];
  
      books.push(newBook);
  
      usersRef.child(userId).set({
        ...userData,
        books: books,
      })
        .then(() => {
          res.status(200).send({
            message: 'Book added to user successfully',
            addedBook: newBook,
          });
        })
        .catch((error) => {
          res.status(500).send('Error updating user: ' + error.message);
        });
    });
  };
  