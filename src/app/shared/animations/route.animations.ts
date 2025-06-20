import { trigger, transition, style, query, group, animate } from '@angular/animations';

export const routeAnimations = trigger('routeAnimations', [
    transition('* <=> *', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
            style({
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%'
            })
        ], { optional: true }),
        query(':enter', [
            style({ opacity: 0, transform: 'translateX(100%)' })
        ], { optional: true }),
        query(':leave', [
            style({ opacity: 1, transform: 'translateX(0%)' })
        ], { optional: true }),
        group([
            query(':leave', [
                animate('300ms ease-in', style({ 
                    opacity: 0, 
                    transform: 'translateX(-100%)' 
                }))
            ], { optional: true }),
            query(':enter', [
                animate('300ms ease-out', style({ 
                    opacity: 1, 
                    transform: 'translateX(0%)' 
                }))
            ], { optional: true })
        ])
    ])
]);

export const slideInAnimation = trigger('slideInAnimation', [
    transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('400ms ease-out', style({ transform: 'translateY(0%)', opacity: 1 }))
    ])
]);