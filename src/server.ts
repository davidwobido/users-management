import express from 'express';

const app = express();
const port = 3000;

const users = ['Alice', 'Anke', 'David', 'Zied'];

app.get('/api/users/:name/', (request, response) => {
  const isNameKnown = users.includes(request.params.name);
  if (isNameKnown) {
    response.send(request.params.name);
  } else {
    response.status(404).send('Can’t find name');
  }
});

// app.get('/api/users/:name/', (request, response) => {
//   response.send(request.params.name);
// });

app.get('/api/users/', (_request, response) => {
  response.send(users);
});

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
