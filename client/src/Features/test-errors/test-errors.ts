import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-test-errors',
  imports: [],
  templateUrl: './test-errors.html',
  styleUrl: './test-errors.css'
})
export class TestErrors {
  private http = inject(HttpClient)
  baseUrl = environment.apiUrl;
  validationError = signal<string[]>([])

  get404Error() {
    this.http.get(this.baseUrl + 'Buggy/not-found').subscribe({
      next: result => {
        console.log(result)
      },
      error: error => {
        console.log(error)
      },
      complete: () => {
        console.log('From test-errors.ts')
      }
    });
  }
  get400Error() {
    this.http.get(this.baseUrl + 'Buggy/bad-request').subscribe({
      next: result => {
        console.log(result)
      },
      error: error => {
        console.log(error)
      },
      complete: () => {
        console.log('From test-errors.ts')
      }
    });
  }
  get500Error() {
    this.http.get(this.baseUrl + 'Buggy/server-error').subscribe({
      next: result => {
        console.log(result)
      },
      error: error => {
        console.log(error)
      },
      complete: () => {
        console.log('From test-errors.ts')
      }
    });
  }
  get401Error() {
    this.http.get(this.baseUrl + 'Buggy/auth').subscribe({
      next: result => {
        console.log(result)
      },
      error: error => {
        console.log(error)
      },
      complete: () => {
        console.log('From test-errors.ts')
      }
    });
  }
  get400ValidationError() {
    this.http.post(this.baseUrl + 'account/register', {}).subscribe({
      next: result => {
        console.log(result)
      },
      error: error => {
        console.log(error)
        this.validationError.set(error);
      },
      complete: () => {
        console.log('From test-errors.ts')
      }
    });
  }

}
