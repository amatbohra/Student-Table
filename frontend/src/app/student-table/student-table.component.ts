
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-student-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-table.component.html',
  styleUrls: ['./student-table.component.css']
})
export class StudentTableComponent implements OnInit {
  students: any[] = [];
  formData = { id: '', name: '', age: null, feesPaid: false, address: '' };
  showForm = false;
  message = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchStudents();
  }

  fetchStudents() {
  this.http.get<any[]>('http://localhost:3000/api/students').subscribe(data => {
    this.students = [...data]; // force re-render by cloning
  });
}


  addStudent() {
    const ageNum = Number(this.formData.age);
    if (isNaN(ageNum) || ageNum < 21 || ageNum > 23) {
      this.showMessage("❌ Age must be between 21 and 23.");
      return;
    }

    if (!this.formData.id || !this.formData.name || !this.formData.address) {
      this.showMessage("❌ Please fill all fields.");
      return;
    }

    this.http.post<any>('http://localhost:3000/api/students', this.formData).subscribe((newStudent) => {
      // ✅ Now this will contain MongoDB _id
      this.students.push(newStudent);
      this.students = [...this.students]; // refresh
      this.resetForm();
      this.showMessage("✅ Student added successfully");
    }, err => {
      this.showMessage("❌ Failed to add student");
    });
  }


  deleteStudent(id: string) {
    console.log("Attempting to delete student with ID:", id); // ✅ Debug

    this.http.delete(`http://localhost:3000/api/students/${id}`).subscribe({
      next: () => {
        this.students = this.students.filter(student => student._id !== id);
        this.showMessage("✅ Student deleted successfully");
      },
      error: (err) => {
        console.error("❌ Delete error:", err);
        this.showMessage("❌ Failed to delete student");
      }
    });
  }

  resetForm() {
    this.formData = { id: '', name: '', age: null, feesPaid: false, address: '' };
    this.showForm = false;
  }

  showMessage(msg: string) {
    this.message = msg;
    setTimeout(() => this.message = '', 3000);
  }
}

