const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

console.log('🚀 Server starting...');

// ✅ Mongoose connection (cleaned)
mongoose.connect('mongodb://localhost:27017/studentdb')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// 🎓 Student Schema
const StudentSchema = new mongoose.Schema({
  id: String,
  name: String,
  age: String,
  feesPaid: Boolean,
  address: String,
});

const Student = mongoose.model('Student', StudentSchema);

// 🌱 Seed data (only if empty)
Student.countDocuments().then(count => {
  if (count === 0) {
    console.log('🌱 Seeding data...');
    Student.insertMany([
      { id: 'S1', name: 'Ali', age: '21', feesPaid: true, address: 'Mumbai' },
      { id: 'S2', name: 'Zara', age: '22', feesPaid: false, address: 'Delhi' },
      { id: 'S3', name: 'Rahul', age: '23', feesPaid: true, address: 'Bangalore' },
      { id: 'S4', name: 'Sneha', age: '20', feesPaid: false, address: 'Hyderabad' },
      { id: 'S5', name: 'Arjun', age: '24', feesPaid: true, address: 'Chennai' },
    ]);
  }
});

// 📥 GET all students
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// ➕ ADD a student
app.post('/api/students', async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.status(201).send('Student added');
  } catch (err) {
    res.status(400).json({ error: 'Failed to add student' });
  }
});

// ❌ DELETE a student
app.delete('/api/students/:id', async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).send('Student not found');
    res.send('Student deleted');
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete student' });
  }
});

// 🚀 Start server
app.listen(3000, () => {
  console.log('🚀 Server running on http://localhost:3000');
});
