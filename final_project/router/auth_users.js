const express = require('express');
let books = require("./booksdb.js");
let users = [];
const regd_users = express.Router();

const isValid = (username)=>{ 
  let user = users.find(user => user.username === username);
  return user ? true : false;
}

const authenticatedUser = (username,password)=>{ 
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  return validusers.length > 0;
}


// Login Route
regd_users.post("/login", (req,res) => {

  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username,password)) {
    req.session.authorization = {
      username
    };

    return res.status(200).json({ message: "Login successful!" });
  }

  return res.status(208).json({ message: "Invalid Login. Check username and password" });
});


// Add or Modify Review
regd_users.put("/review/:isbn", (req,res) => {
  const username = req.session.authorization.username;
  const isbn = req.params.isbn;
  const review = req.body.review;

  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added successfully",
    reviews: books[isbn].reviews
  });
});


// Delete Review
regd_users.delete("/review/:isbn", (req,res) => {
  const username = req.session.authorization.username;
  const isbn = req.params.isbn;

  delete books[isbn].reviews[username];

  return res.status(200).json({
    message: "Review deleted successfully"
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;