const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const bodyParser = require("body-parser");
const Sequelize = require("sequelize");
require('dotenv').config()
const multer = require("multer");
const morgan = require('morgan');

app.use(express.json());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, "public")));

const Eventos_img = require("./models/eventos");
const Albuns_ = require("./models/albuns");
const Image_files = require("./models/image_files")


let message = "";

app.get("/eventos", async (req, res) => {
  const eventos_img = await Eventos_img.findAll();

  res.render("eventos", {
    eventos_img,
  });
});


// ________________________________________

const knex = require('knex');
const db = knex({
  client: 'postgres',
  connection: {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_BASE,
  },
  }
);

const imageUpload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'image/');
    },
    filename: function (req, file, cb) {
    cb(null, new Date().valueOf() + '_' + file.originalname);
    }
  }), 
});

app.post('/image', imageUpload.single('image'), (req, res) => {
    const { filename, mimetype, size } = req.file;
    const filepath = req.file.path;
db
  .insert({
        filename,
        filepath,
        mimetype,
        size,
        })
  .into('image_files')
  .then(() => res.json({ success: true, filename }))
  .catch(err => res
  .json({ 
      success: false,
      message: 'upload failed',
      stack: err.stack,
      })); 

        res.render("deletar");
});

app.get('/image/:filename', async (req, res) => {
  // const imagem = await Image_files.findByPk(req.params.filename);
  const imagem = await Image_files.findAll();
    const { filename } = req.params;
    db
      .select('*')
      .from('image_files')
      .where({ filename })
      .then(images => {
      if (images[0]) {
        const dirname = path.resolve();
        const fullfilepath = path.join(dirname, images[0].filepath);
        return res
      .type(images[0].mimetype)
      .sendFile(fullfilepath);
      }
      return Promise.reject(new Error('Image does not exist'));
      })
      .catch(err => res
      .status(404)
      .json({
        success: false, 
        message: 'not found', 
        stack: err.stack,
      }),
      );
      res.render("fotos", {
        imagem,
      })
});

// ________________________________________



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
    eventos_img,
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

  res.render("deletar")
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

// app.get("/fotos/:id", async  (req, res) => { 
//   const imagem_id = await Image_files.findByPk(req.params.id);
//   const imagem = await Image_files.findAll();

//   res.render("fotos", {
//     imagem,
//     imagem_id
//   });
// });

//  <section id="book">
//         <% imagem.forEach((item, image_files) => { %>
//                 <img src='<%= item.filename %>'width="30%">
//     </a>
//     <% }) %> 

  // <section id="book">
  //       <% albuns.forEach((item, albuns) => { %>
  //               <img src='<%= item.album_imagem %>'width="30%">
  //   </a>
  //   <% }) %>
  //   </section>


app.listen(port, () =>
console.log(`Servidor rodando em http://localhost:${port}`)
);

