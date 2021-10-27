import express from 'express';

const app = express();
const port = 3000;

// For parsing application/json
app.use(express.json());

const users = ['Alice', 'Anke', 'David', 'Zied'];

app.post('/api/users', (request, response) => {
  const isNameKnown = users.includes(request.body.name);
  if (isNameKnown) {
    response
      .status(409)
      .send('Conflict:' + request.body.name + 'User already exists');
  } else {
    const newUser = request.body;
    users.push(newUser.name);
    response.send(request.body.name + ' added.');
  }
});

app.delete('/api/users/:name', (request, response) => {
  const usersIndex = users.indexOf(request.params.name);
  if (usersIndex === -1) {
    response.status(404).send("User doesn't exist. Check another Castle 🏰");
    return;
  }
  users.splice(usersIndex, 1);
  response.send('Deleted');
});

// app.delete('/api/users/:name', (request, response) => {
//   const isNameKnown = users.includes(request.params.name);
//   if (isNameKnown) {
//     const usersIndex = users.indexOf(request.params.name);
//     users.splice(usersIndex);
//     response.send(
//       'User ' + request.params.name + ' deleted. Still in the list: ' + users
//     );
//   } else {
//     response.status(404).send('User does not exist');
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
