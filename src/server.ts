import express from 'express';

const app = express();
const port = 3000;

const users = ['Alice', 'Anke', 'David', 'Zied'];

app.delete('/api/users/:name', (request, response) => {
  const isNameKnown = users.includes(request.params.name);
  if (isNameKnown) {
    const usersIndex = users.indexOf(request.params.name);
    users.splice(usersIndex);
    response.send(
      'User ' + request.params.name + ' deleted. Still in the list: ' + users
    );
  } else {
    response.status(404).send('User does not exist');
  }
});

// app.delete('/api/users/:name', (request, response) => {
//   const isNameKnown = users.includes(request.params.name);
//   if (isNameKnown) {
//     delete request.params.name;
//     response.send('User deleted');
//   } else {
//     response.send('User does not exist');
//   }
// });

app.get('/api/users/:name/', (request, response) => {
  const isNameKnown = users.includes(request.params.name);
  if (isNameKnown) {
    response.send(request.params.name);
  } else {
    response.status(404).send('User does not exist');
  }
});

app.get('/api/users/', (_request, response) => {
  response.send(users);
});

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
