import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'Merry Christmas';
  isTreeOn = false;
  wishes:any[] = [];
  wishForm: FormGroup;
  selectedDiv: string = '';

  API_URL = "http://localhost:8000/";

  constructor(private fb: FormBuilder, private http: HttpClient){
    this.wishForm = this.fb.group({
      id: [],
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      description: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  ngOnInit(){
    this.fetchWishes();
  }

  showDiv(divId: string) {
    this.selectedDiv = divId;
  }

  toggleTree() {
    this.isTreeOn = !this.isTreeOn;
  }

  fetchWishes(){
    this.http.get(this.API_URL + 'get/').subscribe({
      next: (response: any) => (this.wishes = response),
      error: (err) => console.error('Error fetching wishes:', err),
    });
  }

  addWish() {
    if (this.wishForm.valid) {
      // Add Wish
      this.http.post(this.API_URL + 'add/', this.wishForm.value).subscribe({
        next: () => {
          alert('Wish added successfully!');
          this.resetForm();
          this.fetchWishes();
        },
        error: (err) => console.error('Error adding wish:', err),
      });
    }
  }

  deleteWish(id: number) {
    if (!id) {
      alert('Invalid Wish ID');
      return;
    }

    if (confirm('Are you sure you want to delete this wish?')) {
      this.http.delete(this.API_URL + `delete/`, { params: { wish_id: id } }).subscribe({
        next: () => {
          alert('Wish deleted successfully!');
          this.fetchWishes();
        },
        error: (err) => console.error('Error deleting wish:', err),
      });
    }
  }

  resetForm() {
    this.wishForm.reset();
  }

  get name() {
    return this.wishForm.get('name');
  }

  get email() {
    return this.wishForm.get('email');
  }

  get description() {
    return this.wishForm.get('description');
  }
}
