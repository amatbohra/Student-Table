
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

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

  constructor(private http: HttpClient, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.fetchStudents();
  }

  fetchStudents() {
    this.http.get<any[]>('http://localhost:3000/api/students').subscribe(data => {
      this.students = [...data];
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
      this.students.push(newStudent); // ✅ directly add to table
      this.students = [...this.students]; // force view update
      this.resetForm();
      this.showMessage("✅ Student added successfully");
    });
  }

  deleteStudent(id: string) {
  this.http.delete(`http://localhost:3000/api/students/${id}`).subscribe(() => {
    this.fetchStudents();
    this.cd.detectChanges(); // force Angular to detect UI change
    this.showMessage("Student deleted successfully");
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

