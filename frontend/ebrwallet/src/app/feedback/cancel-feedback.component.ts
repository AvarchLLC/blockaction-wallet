import {DataService} from './../services/data.service';
import {Component, OnInit} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute,} from '@angular/router';


import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';

declare var $: any;
declare var ga: any;
declare var toastr: any;

@Component({
  selector: 'cancel-feedback',
  templateUrl: './cancel-feedback.component.html'
})


export class CancelFeedbackComponent implements OnInit {
  title = 'Block Action';
  shownCancelFeedback = false;
  email: string = '';
  feedback: FormGroup;
  isSubmitted: boolean = false;

  constructor(public router: Router,
              private dataService: DataService,
              private fb: FormBuilder,
              private route: ActivatedRoute) {
    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe((event: NavigationEnd)=> {
        let url = event.url.split("?"),
          query = url[1];
        if (typeof(query) != 'undefined') {

          var subQuery = query.split('&');
          if (subQuery.length == 2) {
            var cancelParam = subQuery[0].split("="),
              emailParam = subQuery[1].split("=");
            if (cancelParam != null && emailParam != null) {
              this.shownCancelFeedback = (cancelParam[0] === 'cancel' && cancelParam[1] === 'true' ) ? true : false;
              this.email = emailParam[0] === 'email' ? emailParam[1] : null;
              console.log(this.email);
            }
          }
        }
      })

  }

  ngOnInit() {
    this.feedback = this.fb.group({
      email: [this.email, Validators.compose([Validators.required, Validators.email])],
      message: ['', Validators.required]
    });

  }

  redirectToMainPage() {
    this.router.navigate(["/"]);
  }


  submitFeedback() {
    if (this.feedback.valid) {
      this.dataService.submitReport(this.feedback.value)
        .then(res => {
          toastr.success('Success!', 'Thank you for your cooperation');
          this.feedback.reset();
          this.redirectToMainPage();
        })
        .catch(err => toastr.error('Couldn\'t send your feedback at the moment. Try again.'));
    }
  }
}
