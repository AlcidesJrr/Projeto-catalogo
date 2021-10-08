const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");

let message = "";

const pokedex = [];

app.set("view engine", "ejs");

app.use(express.urlencoded());

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {

    setTimeout(() => {
        message = "";
      }, 1000);

    res.render("index", {});
});

// app.get("/cadastro", (req, res) => {
//     res.render("cadastro");
// });
  
// app.get("/detalhes/:id", (req, res) => {
//     const id = req.params.id;
//     const pokemon = pokedex[id];
//     res.render("detalhes", {
//         pokemon,
//     });
// });

// app.post("/new", (req, res) => {
//     const pokemon = req.body;
//     pokedex.push(pokemon);
//     message = "Pokemon criado com sucesso!";
//     res.redirect("/");
//   });

  app.listen(port, () =>
  console.log(`Servidor rodando em http://localhost:${port}`)
);

