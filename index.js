const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const bodyParser = require("body-parser");
const Sequelize = require("sequelize");
require('dotenv').config()


app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, "public")));


const Eventos_img = require("./models/eventos");
const Albuns_ = require("./models/albuns");

let message = "";


app.get("/eventos", async (req, res) => {
  const eventos_img = await Eventos_img.findAll();

  res.render("eventos", {
    eventos_img,
  });
});


app.get("/albuns/:id", async  (req, res) => { 
  const eventos_img = await Eventos_img.findByPk(req.params.id);

  let eventos_ = ["aniversarios", "baladas", "casamentos", "churrascos", "festivais", "happyHour", "malabares","reveillons"];

  let alb_db = parseInt(req.params.id)
  alb_db--

  let albuns = await Albuns_.findAll({
    where: {
    evento_album: eventos_[alb_db]
    }
    });

  res.render("albuns", {
    albuns,
    eventos_img
  });
});


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

app.get("/membros", async (req, res) => {
  const album = await Albuns_.findAll();

  res.render("membros", {
    album,
  });
});


app.post("/membros", async (req, res) => {
  const album = await Albuns_.findAll();

  const { nome_album, nome_autor, evento_album, album_imagem, local_album, data_album } = req.body;

  const album_a = await Albuns_.create({
    nome_album,
    nome_autor,
    evento_album,
    album_imagem,
    local_album,
    data_album,

  });

  try {
    const albuns_a = await Albuns_.create({
      nome_album,
      nome_autor,
      album_imagem
    });

    res.render("membros", {
      albuns_a,
      album
    });
  } catch (err) {
    console.log(err);

    res.render("membros", {
      album_a,
      album
    });
  }

});

app.get("/editar/:id", async (req, res) => {
  const albuns = await Albuns_.findByPk(req.params.id);
  const album = await Albuns_.findAll();

  res.render("editar", {
    albuns,
    album
  });
});

app.post("/editar/:id", async (req, res) => {
  const albuns = await Albuns_.findByPk(req.params.id);

  const { nome_album, nome_autor, evento_album, album_imagem, local_album, data_album } = req.body;
  albuns.nome_album = nome_album,
  albuns.nome_autor = nome_autor,
  albuns.evento_album = evento_album,
  albuns.album_imagem = album_imagem,
  albuns.local_album = local_album,
  albuns.data_album = data_album

  const albunsEditado = await albuns.save();

  res.render("deletar", {
    albuns: albunsEditado,
    mensagemSucesso: "Filme editado com sucesso!",
  });
});

app.get("/deletar/:id", async (req, res) => {
  const albuns = await Albuns_.findByPk(req.params.id);
  const album = await Albuns_.findAll();

  await albuns.destroy();

  res.render("deletar", {
    albuns,
    album
  })
});

app.get("/eventos/:id", async (req, res) => {
  const album = await Albuns_.findAll();

  res.render("eventos", {
    album
  });

});

app.get("/sobre", (req, res) => {
  res.render("sobre");
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

app.get("/fotos/:id", async  (req, res) => { 
  const albuns = await Albuns_.findAll();
  const eventos_img = await Eventos_img.findByPk(req.params.id);

  res.render("fotos", {
    albuns,
    eventos_img
  });
});

app.listen(port, () =>
console.log(`Servidor rodando em http://localhost:${port}`)
);

