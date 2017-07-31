import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

declare var toastr: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  subscription : FormGroup;

  constructor( @Inject(FormBuilder) fb: FormBuilder) {
    this.subscription = fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])]
    })
  }

  ngOnInit() {
  }

  subscribe() {
    toastr.success('Subscribed to newsletter.')
  }

}
