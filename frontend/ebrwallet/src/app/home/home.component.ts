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
  shownPopup: boolean=false;
  shownModal: boolean=false;
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

  scrollTop() {
    let x = window.innerHeight;
    const clId = setInterval(() => {
      window.scrollTo(0, x);
      x -= 50;
      if (x <= 0) {
        window.scrollTo(0, 0);
        clearInterval(clId);
      }
    }, 15);
  }

  showPopup() {

this.shownPopup=!this.shownPopup;

}

  showModal() {

this.shownModal=!this.shownModal;

}


}
