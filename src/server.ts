import express from 'express';

const app = express();
const port = 3000;

// For parsing application/json
app.use(express.json());

let users = [
  {
    name: 'Manuel',
    username: 'manuel123',
    password: '123abc',
  },
  {
    name: 'Hendrik',
    username: 'hendriK',
    password: 'asdc',
  },
  {
    name: 'Manuel',
    username: 'manu_strg_f',
    password: 'ab',
  },
  {
    name: 'david',
    username: 'dw_182',
    password: 'pw123!',
  },
];

app.post('/api/login', (request, response) => {
  const userLogin = request.body;
  if (
    users.find(
      (user) =>
        user.username === userLogin.username &&
        user.password === userLogin.password
    )
  ) {
    response.send('Welcome to the users-management API.');
  } else {
    response.status(401).send('Login failed.');
  }
});

app.post('/api/users', (request, response) => {
  const isNameKnown = users.includes(request.body.username);
  if (isNameKnown) {
    response
      .status(409)
      .send('Conflict:' + request.body.username + 'User already exists');
  } else {
    const newUser = request.body;
    users.push(newUser);
    response.send(request.body.username + ' added.');
  }
});

app.delete('/api/users/:username', (request, response) => {
  const user = users.some((user) => user.username === request.params.username);
  if (user) {
    const newUsers = users.filter(
      (user) => user.username !== request.params.username
    );
    users = newUsers;
    response.send(users);
  } else {
    response.send('User not found');
  }
});

app.get('/api/users/:username', (request, response) => {
  const user = users.find((user) => user.username === request.params.username);
  if (user) {
    response.send(user);
  } else {
    response.status(404).send('User does not exits');
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
