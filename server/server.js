const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456789',
  database: 'sccinventory'
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});

// Get all student accounts

// Add a new student account
app.post('/studentaccount', (req, res) => {
  const { username, password } = req.body;
  connection.query('INSERT INTO studentaccount (username, password) VALUES (?, ?)', [username, password], (err, result) => {
    if (err) {
      console.error('Error adding data to database:', err);
      res.status(500).json({ error: 'Error adding data to database' });
      return;
    }
    res.json({ id: result.insertId, username, password });
  });
});

// Update a student account
app.put('/studentaccount/:id', (req, res) => {
  const { id } = req.params;
  const { username, password, message } = req.body;

  if (message) {
    const query = 'UPDATE studentaccount SET messages = ? WHERE id = ?';
    connection.query(query, [message, id], (err, result) => {
      if (err) {
        console.error('Error updating message:', err);
        return res.status(500).json({ error: 'Error updating message' });
      }

      console.log(`Message updated with id ${id}: ${message}`);
      res.json({ message: 'Message updated successfully' });
    });
  } else {
    connection.query('UPDATE studentaccount SET username = ?, password = ? WHERE id = ?', [username, password, id], (err, result) => {
      if (err) {
        console.error('Error updating data in database:', err);
        res.status(500).json({ error: 'Error updating data in database' });
        return;
      }
      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Student account not found' });
        return;
      }
      res.json({ id: parseInt(id), username, password });
    });
  }
});

// Delete a student account
app.delete('/studentaccount/:id', (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM studentaccount WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Error deleting data from database:', err);
      res.status(500).json({ error: 'Error deleting data from database' });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Student account not found' });
      return;
    }
    res.json({ message: 'Student account deleted' });
  });
});



// Endpoint to create a new message
app.post('/messages', (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Add the message to the messages array
  messages.push({ message, timestamp: new Date() });
  res.status(201).json({ message: 'Message sent successfully' });
});

// Endpoint to get all messages
app.get('/messages', (req, res) => {
  res.json(messages);
});

app.get('/studentaccount/exists', (req, res) => {
  connection.query('SELECT username FROM studentaccount', (err, results) => {
    if (err) {
      console.error('Error fetching user accounts:', err);
      res.status(500).json({ error: 'Error fetching user accounts' });
      return;
    }
    const usernames = results.map(result => result.username);
    res.json({ usernames });
  });
});

app.get('/adminaccount', (req, res) => {
  const sql = 'SELECT username, password FROM adminaccount';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching admin accounts:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  });
});

app.get('/studentaccount', (req, res) => {
  const sql = 'SELECT id,username, password FROM studentaccount';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching admin accounts:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  });
});
// Make the server publicly accessible
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
