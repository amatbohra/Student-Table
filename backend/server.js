const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

console.log('🚀 Server starting...');

mongoose.connect('mongodb://localhost:27017/studentsDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected');

  const StudentSchema = new mongoose.Schema({
    id: String,
    name: String,
    age: String,
    feesPaid: Boolean,
    address: String,
  });

  const Student = mongoose.model('Student', StudentSchema);

  // Seed data
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

  app.get('/api/students', async (req, res) => {
    const students = await Student.find();
    res.json(students);
  });

  app.post('/api/students', async (req, res) => {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.status(201).send('Student added');
  });

  app.delete('/api/students/:id', async (req, res) => {
    await Student.findByIdAndDelete(req.params.id);
    res.send('Student deleted');
  });

  app.listen(3000, () => {
    console.log('🚀 Server running on http://localhost:3000');
  });

})
.catch(err => {
  console.error('❌ MongoDB connection failed:', err.message);
});

