import {Component, OnInit} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {SpinnerService} from "./services/spinner.service";

declare var ga: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  title = 'Block Action';
  busy;

  constructor(
    public router: Router,
    private spinner: SpinnerService
  ) {
    this.busy = false;

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
  }
}
