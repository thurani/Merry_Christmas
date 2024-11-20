import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'Merry Christmas';
  isTreeOn = false;

  newWish = { name: '', email: '', description: '' };
  wishes:any = []

  APIURL = "http://localhost:8000/";

  constructor(private http:HttpClient){}

  selectedDiv: string = '';

  ngOnInit(){
    this.get_wishes();
  }

  showDiv(divId: string) {
    this.selectedDiv = divId;
  }

  toggleTree() {
    this.isTreeOn = !this.isTreeOn;
  }

  get_wishes(){
    this.http.get(this.APIURL + "get_wishes/").subscribe((res)=>{
      this.wishes = res;
    })
  }

  add_wishes(){
    // const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (this.newWish.name && this.newWish.email && this.newWish.description){
      this.http.post(this.APIURL + "add_wishes/", this.newWish).subscribe({
        next: (response) => {
          console.log('Wish added:', response);
          this.get_wishes();
          this.newWish = { name: '', email: '', description: '' };
        },
        error: (error) => {
          console.error('Error adding wish:', error);
        }
    })
    }
  }
}
