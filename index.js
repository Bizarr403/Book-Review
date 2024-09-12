import express from "express";
import pg from "pg";
import axios from "axios";
import bodyParser from "body-parser";
import env from "dotenv";
const app = express();
const port = 3000;
env.config();
const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  try {
    const data = await db.query("SELECT * FROM books");

    const bookData = data.rows;
    ///const isbn = bookData[0].isbn;
    /*const isbn = bookData.map(async (book) => {
      const response = await axios.get(``);
      return response.data.url;
    });, data: image 
    const image = isbn;
    console.log(isbn);*/

    res.render("home.ejs", { books: bookData });
  } catch (error) {
    console.log(error);
  }
});
app.get("/add", (req, res) => {
  res.render("add.ejs");
});
app.post("/add", async (req, res) => {
  const book_name = req.body.title;
  const author = req.body.author;
  const isbn = req.body.isbn;
  const date = req.body.date;
  const rating = req.body.rating;
  const desc = req.body.description;
  const response = await axios.get(
    `https://bookcover.longitood.com/bookcover/${isbn} `
  );
  const imageURL = response.data.url;
  try {
    await db.query(
      "INSERT INTO books(book_name, author, isbn, date_read, rating, description, imageURL) VALUES($1, $2, $3, $4, $5, $6, $7)",
      [book_name, author, isbn, date, rating, desc, imageURL]
    );
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
