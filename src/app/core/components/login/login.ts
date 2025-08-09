import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CommonService } from '../../../shared/services/common-service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  /**
   * Reactive form group for login form
   */
  loginForm !: FormGroup;
  /**
   * show invalid message 
   */
  invalid :boolean= false; 
  /**
   * Constructor to inject required services
   * @param router router Angular Router for navigation
   * @param commonService commonService Service for handling common logic like login
   */
  constructor(private router: Router, private commonService: CommonService) { }

  /**
   * Angular lifecycle hook - initializes the component
   */
  ngOnInit() {
    this.formInitialize();
  }
  /**
   * Initializes the login form with validators
   */
  formInitialize() {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]),
      password: new FormControl(null, Validators.required)
    })
  }
  /**
   * Handles the login action
   */
  onLogin() {
    const { email, password } = this.loginForm.value;
    const success = this.commonService.login(email, password);
    if (success) {
      this.router.navigate(['/dashboard']);
      this.invalid = false; 
    } else {
      this.invalid = true;
    }
  }
}
