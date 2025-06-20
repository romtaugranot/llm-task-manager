import { trigger, query, stagger, animateChild, transition, style, animate } from '@angular/animations';

export const staggerIn = trigger('staggerIn', [
    transition('* => *', [
        query(':enter', [
            style({ opacity: 0, transform: 'translateY(10px)' }),
            stagger('50ms', [
                animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
            ])
        ], { optional: true })
    ])
]);

export const listAnimation = trigger('listAnimation', [
    transition('* <=> *', [
        query(':enter', [
            style({ opacity: 0, transform: 'scale(0.8)' }),
            stagger('50ms', [
                animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
            ])
        ], { optional: true }),
        query(':leave', [
            stagger('50ms', [
                animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.8)' }))
            ])
        ], { optional: true })
    ])
]);