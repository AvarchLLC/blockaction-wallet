import { NavRouteInfo } from './nav.metadata';


export const ETHROUTES: NavRouteInfo[] =[
        { path: '/ethereum/wallet', title: 'Create Wallet' , subroutes : false, routes : null},
        { path: '/ethereum/send', title: 'Send Ether' , subroutes : false, routes : null},
        { path: '/ethereum/info', title: 'View Wallet' , subroutes : false, routes : null},
];

export const BTCROUTES: NavRouteInfo[] =[
        { path: '/bitcoin/wallet', title: 'Create Wallet' , subroutes : false, routes : null},
        { path: '/bitcoin/send', title: 'Send Bitcoin' , subroutes : false, routes : null},
        { path: '/bitcoin/info', title: 'View Wallet' , subroutes : false, routes : null},
];


export const NAVROUTES: NavRouteInfo[] =[
        { path: '/', title: 'Home' , subroutes : false, routes : null},
        { path: '/bitcoin/wallet', title: 'Bitcoin' , subroutes : false, routes : null},
        { path: '/ethereum/wallet', title: 'Ethereum' , subroutes : false, routes : null},
        { path: '/help', title: 'FAQ' , subroutes : false, routes : null},
        // { path: '/register', title: 'Sign Up' ,subroutes : false, routes : null}

];
