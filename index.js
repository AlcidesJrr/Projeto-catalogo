const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const bodyParser = require("body-parser");

let message = "";
const book = [];

app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index", {});
});

app.get("/sobre", (req, res) => {
  res.render("sobre");
});

app.get("/controle", (req, res) => {

  setTimeout(() => {
    message = "";
  }, 1000);

  res.render("controle", {
    message
  });
});

app.get("/membros", (req, res) => {
  res.render("membros");
});

app.post('/controle', (req, res) => {
  let login = req.body.login;
  let senha = req.body.senha;
  
  
  if (login == "book" && senha == "1234") {
    res.redirect('/membros')
  } else {
    message = 'Usuário ou senha inválido'
    res.redirect('/controle')
  };
});

// app.get("/detalhes/:id", (req, res) => {
//   const id = req.params.id;
//   const bookDaGalera = book[id];
//   res.render("detalhes", {
//     bookDaGalera,
//   });
// });


// app.post("/new", (req, res) => {
//   const pokemon = req.body;
//   book.push(bookDaGalera);
//   message = "Informações adiconadas";
//   res.redirect("/mebros");
// });

app.listen(port, () =>
console.log(`Servidor rodando em http://localhost:${port}`)
);

