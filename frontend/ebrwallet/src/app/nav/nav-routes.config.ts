import { NavRouteInfo } from './nav.metadata';


export const ETHROUTES: NavRouteInfo[] =[
        { path: '/wallet', title: 'Create Wallet' , subroutes : false, routes : null},
        { path: '/send-ether', title: 'Send Ether' , subroutes : false, routes : null},

];


export const NAVROUTES: NavRouteInfo[] =[
        { path: '/', title: 'Home' , subroutes : false, routes : null},
        { path: '#', title: 'Ethereum' , subroutes : true, routes : ETHROUTES},
        // { path: '/login', title: 'Sign In' , subroutes : false, routes : null},
        // { path: '/register', title: 'Sign Up' ,subroutes : false, routes : null}

];
