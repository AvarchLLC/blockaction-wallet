import { DataService } from './services/data.service';
import {Component, OnInit} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {SpinnerService} from "./services/spinner.service";


import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';

declare var ga: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  title = 'Block Action';
  busy;


  coins: Array<object>;
  private alive: boolean; // used to unsubscribe from the IntervalObservable
                          // when OnDestroy is called.
  private timer: Observable<number>;
  private interval: number;

  constructor(
    public router: Router,
    private dataService: DataService,
    private spinner: SpinnerService
  ) {
    this.busy = false;

    this.alive = true;
    this.interval = 20 * 1000;
    this.timer = Observable.timer(0, this.interval);

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        ga('set', 'page', event.urlAfterRedirects);
        ga('send', 'pageview');
      }
    });
  }

  ngOnInit() {
    this.spinner.spinnerStatus.subscribe((val: boolean) => {
      this.busy = val;
    });

    this.timer
      .takeWhile(() => this.alive)
      .subscribe(() => {
        this.dataService.getCoinData('ethereum,bitcoin,ripple')
          .then(data =>  this.coins = data)
          .catch(err => console.log('No internet connection.'));
      });

    console.log('%cBlock%cAction', 'color: #1ED6E5; font-size:50px; font-weight:900;', 'color: #000000; font-size:38px; font-weight: 900');
    console.log('%cIf someone told you to paste some script here then', 'font-size: 16px;');
    console.log('%cStop!', 'color: #f00; font-size:38px; font-weight: 700;');
    console.log('%cThis is a browser feature for developers only. But it maybe used by people to steal your money.', 'font-size:22px;');
    console.log();
  }

  OnDestroy () {
    this.alive = false;
  }
}
