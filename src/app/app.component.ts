import { AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { Contact } from '../models/contact.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, FormsModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Contactly-WEB';
  
  http = inject(HttpClient);

  contactsForm = new FormGroup({
    name: new FormControl<string>(''),
    email: new FormControl<string | null>(null),
    phone: new FormControl<string>(''),
    favorite: new FormControl<boolean>(false)
  })

  contacts$ = this.getContacts();

  onFormSubmit(){
    const addContactRequest = {
      name: this.contactsForm.value.name,
      email: this.contactsForm.value.email,
      phone: this.contactsForm.value.phone,
      favorite: this.contactsForm.value.favorite
    }

    this.http.post('https://localhost:7234/api/Contacts', addContactRequest)
      .subscribe({
        next: (value) => {
          console.log(value);
          this.contacts$ = this.getContacts();
          this.contactsForm.reset();
        }
      })
  }

  private getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>('https://localhost:7234/api/Contacts')
  }
}