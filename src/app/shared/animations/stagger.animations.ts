import { trigger, query, stagger, animateChild, transition } from '@angular/animations';

export const staggerIn = trigger('staggerIn', [
    transition('* => *', [
        query(':enter', [
            stagger('100ms', [
                animateChild()
            ])
        ], { optional: true })
    ])
]);

export const listAnimation = trigger('listAnimation', [
    transition('* <=> *', [
        query(':enter', [
            stagger('50ms', [
                animateChild()
            ])
        ], { optional: true })
    ])
]);