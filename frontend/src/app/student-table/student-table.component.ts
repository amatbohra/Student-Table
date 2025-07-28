
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-table.component.html',
})
export class StudentTableComponent implements OnInit {
  students: any[] = [];
  formData = { id: '', name: '', age: '', feesPaid: false, address: '' };
  showForm = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchStudents();
  }

  fetchStudents() {
    this.http.get<any[]>('http://localhost:3000/api/students').subscribe(data => {
      this.students = data;
    });
  }

  addStudent() {
    this.http.post('http://localhost:3000/api/students', this.formData).subscribe(() => {
      this.fetchStudents();
      this.formData = { id: '', name: '', age: '', feesPaid: false, address: '' };
      this.showForm = false;
    });
  }

  deleteStudent(id: string) {
    this.http.delete(`http://localhost:3000/api/students/${id}`).subscribe(() => {
      this.fetchStudents();
    });
  }
}
