import { Component, OnInit } from '@angular/core';
import { NAVROUTES } from './nav-routes.config';
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

}
