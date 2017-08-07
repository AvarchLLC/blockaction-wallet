import { NavRouteInfo } from './nav.metadata';


export const ETHROUTES: NavRouteInfo[] =[
        { path: '/ethereum/wallet', title: 'Create Wallet' , subroutes : false, routes : null},
        { path: '/ethereum/send', title: 'Send Ether' , subroutes : false, routes : null},
        { path: '/ethereum/info', title: 'View Wallet' , subroutes : false, routes : null},
];

export const BTCROUTES: NavRouteInfo[] =[
        { path: '/bitcoin/wallet', title: 'Create Wallet' , subroutes : false, routes : null},
        { path: '/bitcoin/info', title: 'View Wallet' , subroutes : false, routes : null},
];


export const NAVROUTES: NavRouteInfo[] =[
        { path: '/', title: 'Home' , subroutes : false, routes : null},
        { path: '#', title: 'Bitcoin' , subroutes : true, routes : BTCROUTES},
        { path: '#', title: 'Ethereum' , subroutes : true, routes : ETHROUTES},
        // { path: '/login', title: 'Sign In' , subroutes : false, routes : null},
        // { path: '/register', title: 'Sign Up' ,subroutes : false, routes : null}

];
