import { Component, OnInit } from '@angular/core';
import { NAVROUTES, ETHROUTES } from './nav-routes.config';
import { Router, NavigationEnd } from '@angular/router';
import 'rxjs/add/operator/filter';

@Component({
    selector: "nav-bar",
    templateUrl: "./nav.html",
    styleUrls: ["./slide-nav.css"]
})

export class NavComponent implements OnInit{
     navOpen : boolean = false;
     activeLink : string = "/";
    public menuItems: any[];

    constructor(private router: Router){
        this.router.events
        .filter(event => event instanceof NavigationEnd)
        .subscribe((event: NavigationEnd)=>{
            this.activeLink =  event.url;
        })
    }

    ngOnInit(){
        this.menuItems = NAVROUTES.filter(menuItem => menuItem);
    }

    isActive(menuItem, activeLink) : boolean {
      if (menuItem.routes) {
        for(let route of menuItem.routes) {
          if(route.path === activeLink){
            return true
          }
        }
      }else {
        return menuItem.path === activeLink
      }
    }

}
