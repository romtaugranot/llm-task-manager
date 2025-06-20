import { trigger, state, style, transition, animate } from '@angular/animations';

export const fadeInOut = trigger('fadeInOut', [
    state('in', style({ opacity: 1 })),
    transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
    ]),
    transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
    ])
]);

export const fadeInUp = trigger('fadeInUp', [
    transition(':enter', [
        style({ 
            opacity: 0, 
            transform: 'translateY(20px)' 
        }),
        animate('400ms ease-out', style({ 
            opacity: 1, 
            transform: 'translateY(0)' 
        }))
    ])
]);

export const fadeInDown = trigger('fadeInDown', [
    transition(':enter', [
        style({ 
            opacity: 0, 
            transform: 'translateY(-20px)' 
        }),
        animate('400ms ease-out', style({ 
            opacity: 1, 
            transform: 'translateY(0)' 
        }))
    ])
]);

export const fadeInLeft = trigger('fadeInLeft', [
    transition(':enter', [
        style({ 
            opacity: 0, 
            transform: 'translateX(-20px)' 
        }),
        animate('400ms ease-out', style({ 
            opacity: 1, 
            transform: 'translateX(0)' 
        }))
    ])
]);

export const fadeInRight = trigger('fadeInRight', [
    transition(':enter', [
        style({ 
            opacity: 0, 
            transform: 'translateX(20px)' 
        }),
        animate('400ms ease-out', style({ 
            opacity: 1, 
            transform: 'translateX(0)' 
        }))
    ])
]);