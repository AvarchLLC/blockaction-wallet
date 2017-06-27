import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  form : FormGroup;
 
  message : string;

  error : [string];

  constructor(@Inject(FormBuilder) fb: FormBuilder, private authService : AuthService, private router: Router ) {
    
    var defaultValidator = Validators.compose([
                              Validators.required, 
                              Validators.minLength(2), 
                              Validators.maxLength(32)
                            ]);
    // Password rule :  Password must be at least 6 characters, no more than 18 characters, and must include at least one upper case letter, one lower case letter, and one numeric digit.
    var passwordValidator = Validators.compose([
                              defaultValidator, 
                              Validators.pattern("^([a-zA-Z0-9@*#]{6,18})$")
                              ])
    // Username rule: should be minimum 4 and maximum 15 characters. Alphanumeric characters are allowed. special characters ._ are allowed. No spaces are acceptable. The starting character should be alphabet.
    var usernameValidator = Validators.compose([defaultValidator, Validators.pattern("[A-Za-z][A-Za-z0-9._]{3,14}")])
    
    this.form = fb.group({
      username: ['', [ usernameValidator ]],
      password: ['', [ passwordValidator ]],
    })
  }


  
	onSubmit(formValue) {
    var body = {
      username: formValue.username,
      password: formValue.password
    }
    console.log('body', body)
    this.authService
      .login(body)
      .then(ok => {
        if(ok.success) {
          this.message = "Logged In"
          this.router.navigate(['/dashboard'])
        } else {
          this.message = ok.message
        }
      })
      .catch(err => console.error(err))
	}

	ngOnInit() {
    if ( this.authService.authenticated ) {
      this.router.navigate(['/dashboard'])      
    }
  }
}
