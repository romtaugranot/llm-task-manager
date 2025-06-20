import { trigger, state, style, transition, animate } from '@angular/animations';

export const slideInOut = trigger('slideInOut', [
    transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('300ms ease-in', style({ transform: 'translateX(0%)' }))
    ]),
    transition(':leave', [
        animate('300ms ease-out', style({ transform: 'translateX(-100%)' }))
    ])
]);

export const slideUpDown = trigger('slideUpDown', [
    state('collapsed', style({ height: '0px', overflow: 'hidden' })),
    state('expanded', style({ height: '*', overflow: 'visible' })),
    transition('collapsed <=> expanded', [
        animate('300ms ease-in-out')
    ])
]);

export const slideDown = trigger('slideDown', [
    transition(':enter', [
        style({ 
            height: '0px', 
            opacity: 0,
            overflow: 'hidden'
        }),
        animate('300ms ease-out', style({ 
            height: '*', 
            opacity: 1,
            overflow: 'visible'
        }))
    ]),
    transition(':leave', [
        style({ 
            height: '*', 
            opacity: 1,
            overflow: 'hidden'
        }),
        animate('300ms ease-in', style({ 
            height: '0px', 
            opacity: 0
        }))
    ])
]);