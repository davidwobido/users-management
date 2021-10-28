import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cookieParser from 'cookie-parser';
import { connectDatabase, getUserCollection } from './utils/database';

if (!process.env.MONGODB_URI) {
  throw new Error('No MongoDB URL dotenv variable');
}

const app = express();
const port = 3000;

// For parsing application/json
app.use(express.json());

// Middleware for parsing cookies
app.use(cookieParser());

const users = [
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

app.get('/api/me', (request, response) => {
  const username = request.cookies.username;
  const foundUser = users.find((user) => user.username === username);
  if (foundUser) {
    response.send(foundUser);
  } else {
    response.status(404).send('User not found');
  }
});

app.post('/api/login', (request, response) => {
  const credentials = request.body;
  const existingUser = users.find(
    (user) =>
      user.username === credentials.username &&
      user.password === credentials.password
  );

  if (existingUser) {
    response.setHeader('Set-Cookie', `username=${existingUser.username}`);
    response.send('Logged in');
  } else {
    response.status(401).send('You shall not pass');
  }
});

// Post with mongoDB

app.post('/api/users', async (request, response) => {
  const userCollection = getUserCollection();
  const newUser = request.body;

  if (
    typeof newUser.name !== 'string' ||
    typeof newUser.username !== 'string' ||
    typeof newUser.password !== 'string'
  ) {
    response.status(400).send('Missing properties');
    return;
  }
  const isUserKnown = await userCollection.findOne({
    username: newUser.username,
  });
  if (isUserKnown) {
    response.status(409).send(newUser + ' already exist.');
  } else {
    userCollection.insertOne(newUser);
    response.send(newUser.name + ' added');
  }
});

// Read one with mongoDB

app.get('/api/users/:username', async (request, response) => {
  const userCollection = getUserCollection(); // Datenbank
  const user = request.params.username; //Eingabe

  const isUserKnown = await userCollection.findOne({
    username: user,
  });
  if (isUserKnown) {
    response.status(200).send(isUserKnown);
  } else {
    response.status(404).send('User does not exist');
  }
});

// Read all with mongoDB

app.get('/api/users/', async (_request, response) => {
  const userCollection = getUserCollection();
  const cursor = userCollection.find();
  const allUsers = await cursor.toArray();
  response.send(allUsers);
});

// Delete with mongoDB

app.delete('/api/users/:username', async (request, response) => {
  const userCollection = getUserCollection(); // Datenbank
  const user = request.params.username; //Eingabe

  const isUserKnown = await userCollection.findOne({
    username: user,
  });
  if (isUserKnown) {
    userCollection.deleteOne({ username: user });
    response.send(isUserKnown);
  } else {
    response.status(404).send('User does not exist');
  }
});

app.get('/api/me', (request, response) => {
  const username = request.cookies.username;
  const foundUser = users.find((user) => user.username === username);
  if (foundUser) {
    response.send(foundUser);
  } else {
    response.status(404).send('User not found');
  }
});

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

// Connect to database
connectDatabase(process.env.MONGODB_URI).then(() =>
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  })
);
