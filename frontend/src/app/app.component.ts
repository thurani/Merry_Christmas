import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

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

  async ngOnInit(){
    this.fetchWishes();
  }

  showDiv(divId: string) {
    this.selectedDiv = divId;
  }

  toggleTree() {
    this.isTreeOn = !this.isTreeOn;
  }

  async fetchWishes(){
    try {
      this.wishes = await firstValueFrom(this.http.get<any[]>(`${this.API_URL}get/`));
    } catch (error) {
      console.error('Error fetching wishes:', error);
    }
  }

  async addWish() {
    if (this.wishForm.valid) {
      try {
        await firstValueFrom(this.http.post(`${this.API_URL}add/`, this.wishForm.value));
        alert('Wish added successfully!');
        this.resetForm();
        await this.fetchWishes();
      } catch (error) {
        console.error('Error adding wish:', error);
      }
    }
  }

  async deleteWish(id: number) {
    if (!id) {
      alert('Invalid Wish ID');
      return;
    }

    if (confirm('Are you sure you want to delete this wish?')) {
      try {
        await firstValueFrom(this.http.delete(`${this.API_URL}delete/`, { params: { wish_id: id } }));
        alert('Wish deleted successfully!');
        await this.fetchWishes();
      } catch (error) {
        console.error('Error deleting wish:', error);
      }
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
