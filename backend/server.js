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
      { id: '1', name: 'Ali', age: '21', feesPaid: true, address: 'Mumbai' },
      { id: '2', name: 'Zara', age: '22', feesPaid: false, address: 'Delhi' },
      { id: '3', name: 'Rahul', age: '23', feesPaid: true, address: 'Bangalore' },
      { id: '4', name: 'Sneha', age: '20', feesPaid: false, address: 'Hyderabad' },
      { id: '5', name: 'Arjun', age: '24', feesPaid: true, address: 'Chennai' },
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
  const student = new Student(req.body);
  const saved = await student.save();
  res.json(saved); // return saved with _id
});



// ❌ DELETE a student
app.delete('/api/students/:id', async (req, res) => {
  try {
    const result = await Student.findByIdAndDelete(req.params.id);
    if (result) {
      res.status(200).json({ message: "Student deleted" }); // ✅ Proper JSON response
    } else {
      res.status(404).json({ error: "Student not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Delete failed", details: err });
  }
});




// 🚀 Start server
app.listen(3000, () => {
  console.log('🚀 Server running on http://localhost:3000');
});
