const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs, 
    likes: 0 
  }; 

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, techs, url, likes} = request.body;
  const repositoryIndex = repositories.findIndex(r => r.id === id);

  if (repositoryIndex < 0){
    return response.status(400).json({error: "Id não encontrado"});
  }

  const likeLabel = repositories[repositoryIndex].likes;

  const repository = {
    id,
    title,
    url,
    techs,
    likes: likeLabel
  }

  repositories[repositoryIndex] = repository;
  return response.json(repository);

});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(r=>r.id === id);
  if (repositoryIndex < 0){
    return response.status(400).json({error: "Id não encontrado"});
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;

  const repository = repositories.find(r=>r.id === id);

  if (!repository){
    return response.status(400).send();
  }

  repository.likes++;

  return response.json(repository);
});

module.exports = app;
