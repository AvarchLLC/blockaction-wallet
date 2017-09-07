import { DataService } from '../services/data.service';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

declare var toastr: any;

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html'
})
export class HelpComponent implements OnInit {

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

}
