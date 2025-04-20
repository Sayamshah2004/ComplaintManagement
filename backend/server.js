// backend/server.js

const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('✅ Server is running!');
});

// POST: Submit a new complaint
app.post('/api/complaints', (req, res) => {
  const { name, email, type, description } = req.body;

  if (!name || !email || !type || !description) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const sql = `
    INSERT INTO complaints (name, email, type, description, status)
    VALUES (?, ?, ?, ?, 'Pending')
  `;

  db.query(sql, [name, email, type, description], (err, result) => {
    if (err) {
      console.error('❌ Error inserting complaint:', err);
      return res.status(500).json({ message: 'Error submitting complaint' });
    }

    const newComplaint = {
      id: result.insertId,
      name,
      email,
      type,
      description,
      status: 'Pending',
    };

    console.log('✅ Complaint submitted:', newComplaint);
    res.status(201).json({ message: 'Complaint submitted', complaint: newComplaint });
  });
});

// GET: Fetch all complaints
app.get('/api/complaints', (req, res) => {
  const sql = 'SELECT * FROM complaints';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Error fetching complaints:', err);
      return res.status(500).json({ message: 'Error fetching complaints' });
    }

    res.json(results);
  });
});

// PUT: Mark a complaint as resolved
app.put('/api/complaints/:id', (req, res) => {
  const complaintId = req.params.id;

  const sql = 'UPDATE complaints SET status = "Resolved" WHERE id = ?';
  db.query(sql, [complaintId], (err, result) => {
    if (err) {
      console.error('❌ Error updating complaint:', err);
      return res.status(500).json({ message: 'Error updating complaint' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json({ message: 'Complaint marked as resolved' });
  });
});

// DELETE: Remove a complaint by ID
app.delete('/api/complaints/:id', (req, res) => {
  const complaintId = req.params.id;

  const sql = 'DELETE FROM complaints WHERE id = ?';
  db.query(sql, [complaintId], (err, result) => {
    if (err) {
      console.error('❌ Error deleting complaint:', err);
      return res.status(500).json({ message: 'Error deleting complaint' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json({ message: 'Complaint deleted successfully' });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
