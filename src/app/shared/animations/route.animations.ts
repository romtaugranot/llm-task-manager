import { trigger, transition, style, animate, query } from '@angular/animations';

export const routeAnimations = trigger('routeAnimations', [
    transition('signup => questionnaire', [
        query(':enter', [style({ opacity: 0, transform: 'scale(0.95)' })], { optional: true }),
        query(
            ':leave',
            [animate('300ms ease-out', style({ opacity: 0, transform: 'scale(1.05)' }))],
            { optional: true }
        ),
        query(
            ':enter',
            [animate('400ms 100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))],
            { optional: true }
        ),
    ]),
]);
