const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const bodyParser = require("body-parser");

let message = "";
const aniversarios = [];
const baladas = [];
const casamentos = [];
const churrascos = [];
const festivais = [];
const happyHour = [];
const malabares = [];
const reveillons = [];

app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, "public")));


app.get("/", (req, res) => {
  res.render("index");
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

app.get("/sobre", (req, res) => {
  res.render("sobre");
});

app.get("/eventos", (req, res) => {
  res.render("eventos");
});

app.get("/aniversarios", (req, res) => {
  res.render("aniversarios", {
      aniversarios: aniversarios
  });
});

app.get("/baladas", (req, res) => {
  res.render("baladas", {
    baladas: baladas
});
});

app.get("/casamentos", (req, res) => {
  res.render("casamentos", {
    casamentos: casamentos
});
});

app.get("/churrascos", (req, res) => {
  res.render("churrascos",{
    churrascos: churrascos
});
});

app.get("/festivais", (req, res) => {
  res.render("festivais", {
    festivais: festivais
});
});

app.get("/happyHour", (req, res) => {
  res.render("happyHour", {
    happyHour: happyHour
});
});

app.get("/malabares", (req, res) => {
  res.render("malabares", {
    malabares: malabares
});
});

app.get("/reveillons", (req, res) => {
  res.render("reveillons", {
    reveillons: reveillons
});
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

app.post("/new", (req, res) => {
  const album = req.body;
  let escolha = req.body.evento

  if (escolha == 'aniversarios') {
    aniversarios.push(album);
  } else if (escolha == 'baladas') {
      baladas.push(album);
  } else if (escolha == 'casamentos') {
    casamentos.push(album);
  } else if (escolha == 'churrascos') {
    churrascos.push(album);
  } else if (escolha == 'festivais') {
    festivais.push(album);
  } else if (escolha == 'happyHour') {
    happyHour.push(album);
  } else if (escolha == 'malabares') {
    malabares.push(album);
  } else if (escolha == 'reveillons') {
    reveillons.push(album);
  }   

  res.redirect(escolha);
});

// app.get("/detalhes/:id", (req, res) => {
//   const id = req.params.id;
//   const bookDaGalera = book[id];
//   res.render("detalhes", {
//     bookDaGalera,
//   });
// });

app.listen(port, () =>
console.log(`Servidor rodando em http://localhost:${port}`)
);

