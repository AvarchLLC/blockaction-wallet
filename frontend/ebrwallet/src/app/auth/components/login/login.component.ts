import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../services/auth.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  form : FormGroup;
 
  error : string;

  constructor(@Inject(FormBuilder) fb: FormBuilder, private authService : AuthService, private router: Router ) {
    
    var usernameValidator = Validators.compose([
                              Validators.required, 
                              Validators.pattern("[A-Za-z][A-Za-z0-9._]{3,14}")
                            ])
 
    var passwordValidator = Validators.compose([
                              Validators.required, 
                              Validators.minLength(6)
                              ])
    
    this.form = fb.group({
      username: ['', [ usernameValidator ]],
      password: ['', [ passwordValidator ]],
    })
  }


  
	onSubmit(formValue) {
    this.error = null
    
    var body = {
      username: formValue.username,
      password: formValue.password
    }

    this.authService
      .login(body)
      .then(res => {
        if(res.success) {
          this.router.navigate(['/wallet'])
        } else {
          this.error = res.message
        }
      })
      .catch(err => this.error = "An error occurred. Please try again.")
	}

	ngOnInit() {
    if ( this.authService.authenticated ) {
      this.router.navigate(['/wallet'])      
    }
  }
}
