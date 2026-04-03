const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered" });
    } else {
      return res.status(404).json({ message: "User already exists" });
    }
  }
  return res.status(404).json({ message: "Unable to register user" });
});


// Get all books (async/await)
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});


// Get by ISBN (promise)
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  axios.get('http://localhost:5000/')
    .then(response => {
      return res.status(200).json(response.data[isbn]);
    })
    .catch(error => {
      return res.status(500).json({ message: "Error retrieving book" });
    });
});


// Get by author (promise)
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  axios.get('http://localhost:5000/')
    .then(response => {
      const filtered = Object.values(response.data)
        .filter(book => book.author === author);
      return res.status(200).json(filtered);
    })
    .catch(error => {
      return res.status(500).json({ message: "Error retrieving author books" });
    });
});


// Get by title (promise)
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  axios.get('http://localhost:5000/')
    .then(response => {
      const filtered = Object.values(response.data)
        .filter(book => book.title === title);
      return res.status(200).json(filtered);
    })
    .catch(error => {
      return res.status(500).json({ message: "Error retrieving title books" });
    });
});


// Get review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;