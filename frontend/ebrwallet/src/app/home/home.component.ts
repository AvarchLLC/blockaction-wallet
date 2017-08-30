import { DataService } from '../services/data.service';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

declare var toastr: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  subscription: FormGroup;
  shownPopup = false;
  shownModal = false;

  constructor( @Inject(FormBuilder) fb: FormBuilder, private dataService: DataService) {
    this.subscription = fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])]
    });
  }

  ngOnInit() {
  }

  /**
   * Subscribe to newsletter
   */
  subscribe() {
    this.dataService.subscribeNews(this.subscription.controls.email.value)
      .then(res => console.log('success'))
      .catch(err => console.error('Couldn\'t subscribe at the moment.'));
  }

  /**
   * Scrolling to the top of the screen at decremental steps
   */
  scrollTop() {
    let x = window.innerHeight;
    // Set a interval id
    const clId = setInterval(() => {
      window.scrollTo(0, x);
      x -= 50;
      if (x <= 0) {
        window.scrollTo(0, 0);
        clearInterval(clId);    // Clear interval once it reaches the top
      }
    }, 15);
  }

  showPopup() {
    this.shownPopup = !this.shownPopup;
  }

  showModal() {
    this.shownModal = !this.shownModal;
  }
}
