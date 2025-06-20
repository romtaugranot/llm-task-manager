import { trigger, state, style, transition, animate } from '@angular/animations';

export const scaleIn = trigger('scaleIn', [
    transition(':enter', [
        style({ 
            transform: 'scale(0.8)', 
            opacity: 0 
        }),
        animate('300ms ease-out', style({ 
            transform: 'scale(1)', 
            opacity: 1 
        }))
    ])
]);

export const scaleInOut = trigger('scaleInOut', [
    transition(':enter', [
        style({ 
            transform: 'scale(0.8)', 
            opacity: 0 
        }),
        animate('300ms ease-out', style({ 
            transform: 'scale(1)', 
            opacity: 1 
        }))
    ]),
    transition(':leave', [
        animate('200ms ease-in', style({ 
            transform: 'scale(0.8)', 
            opacity: 0 
        }))
    ])
]);

export const bounceIn = trigger('bounceIn', [
    transition(':enter', [
        style({ 
            transform: 'scale(0.3)', 
            opacity: 0 
        }),
        animate('300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)', style({ 
            transform: 'scale(1)', 
            opacity: 1 
        }))
    ])
]);

export const pulseOnHover = trigger('pulseOnHover', [
    state('normal', style({ transform: 'scale(1)' })),
    state('hovered', style({ transform: 'scale(1.05)' })),
    transition('normal <=> hovered', [
        animate('200ms ease-in-out')
    ])
]);