import { DataService } from './services/data.service';
import {Component, OnInit, ElementRef} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {SpinnerService} from './services/spinner.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';

declare var $: any;
declare var ga: any;
declare var toastr: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  host: {
    '(window:scroll)':'onScroll()'
  }
})


export class AppComponent implements OnInit{
  title = 'Block Action';
  busy: boolean;                // The loading spinner visibility flag
  sticky = false;
  shownFeedback = false;
  feedback      : FormGroup;



  coins: Array<object>;        // Holds the coins market data

  private alive: boolean; // used to unsubscribe from the IntervalObservable
                          // when OnDestroy is called.
  private timer: Observable<number>;
  private interval: number;

  images = {
    'ETH': 'assets/img/ethereum.svg',
    'BTC': 'assets/img/bitcoin.svg'
  };

  constructor(
    public router: Router,
    private dataService: DataService,
    private spinner: SpinnerService,
    private element: ElementRef,
    private fb: FormBuilder
  ) {

    // Coin Data
    this.alive = true;
    this.interval = 20 * 1000; // Interval at which coin data is retreived
    this.timer = Observable.timer(0, this.interval);

    // Google Analytics: subscribes to router and sends page and page view data
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        ga('set', 'page', event.urlAfterRedirects);
        ga('send', 'pageview');
      }
    });

    this.feedback = fb.group({
      firstName : ['', Validators.required],
      lastName  : ['', Validators.required],
      email     : ['', Validators.compose([Validators.required, Validators.email])],
      message   : ['', Validators.required]
    });
  }

  ngOnInit() {

    // Subscribe to spinner value and sets the visibility of the spinner
    this.spinner.spinnerStatus.subscribe((val: boolean) => {
      this.busy = val;
    });

    // Sets a interval for getting the coins market data
    this.timer
      .takeWhile(() => this.alive)
      .subscribe(() => {
        this.dataService.getCoinData('ethereum,bitcoin')
          .then(data =>  this.coins = data)
          .catch(err => console.log('No internet connection.'));
      });

    // Prints warning texts to the console
    console.log('%cBlock%cAction', 'color: #1ED6E5; font-size:50px; font-weight:900;', 'color: #000000; font-size:38px; font-weight: 900');
    console.log('%cIf someone told you to paste some script here then', 'font-size: 16px;');
    console.log('%cStop!', 'color: #f00; font-size:38px; font-weight: 700;');
    console.log('%cThis is a browser feature for developers only. But it maybe used by people to steal your money.', 'font-size:22px;');
    console.log();

  }

  // Sticky nav bar once user scrolls more than the stickyThreshold
  onScroll() {
    const stickyThreshold = 50;
    if (this.element.nativeElement.getBoundingClientRect().top * -1  >= stickyThreshold ) {
      this.sticky = true;
    }else {
      this.sticky = false;
    }
  }




  OnDestroy () {
    this.alive = false;
  }


  showFeedback() {
    this.shownFeedback = !this.shownFeedback;
  }


  submitFeedback() {
    if(this.feedback.valid) {
      this.dataService.submitFeedback(this.feedback.value)
       .then(res => {
         toastr.success('Success!', 'Thank you for your feedback');
         this.feedback.reset();
         this.showFeedback();
       })
       .catch(err => toastr.error('Couldn\'t send your feedback at the moment. Try again.'));
    }
  }

}
