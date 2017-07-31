import { Component, OnInit } from '@angular/core';
import { NAVROUTES, ETHROUTES } from './nav-routes.config';
import {ActivatedRoute, Router, NavigationEnd, NavigationStart} from '@angular/router';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})

export class NavComponent implements OnInit {
  navOpen = false;
  activeLink;
  public menuItems: any[];

  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe((event: NavigationEnd) => {
        this.activeLink = event.url;
        this.menuItems = NAVROUTES.filter(menuItem => menuItem);

      });

  }

  ngOnInit() {
    this.menuItems = NAVROUTES.filter(menuItem => menuItem);
  }

  isActive(menuItem): boolean {
    if (menuItem.routes) {
      for (const route of menuItem.routes) {
        if (route.path === this.activeLink) {
          return true;
        }
      }
    } else {
      return menuItem.path === this.activeLink;
    }
  }

}
