import {
  trigger,
  transition,
  style,
  query,
  group,
  animate,
} from '@angular/animations';

export const slideInAnimation = trigger('routeAnimations', [
  transition('LoginPage => RegisterPage', [
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

    query(':enter .illustration-section', [style({ zIndex: 10, position: 'relative' })], { optional: true }),
    query(':leave .illustration-section', [style({ zIndex: 9, position: 'relative' })], { optional: true }),
    query(':enter .form-section, :leave .form-section', [style({ zIndex: 1, position: 'relative' })], { optional: true }),

    query(':enter .illustration-section', [style({ transform: 'translateX(-100%)' })], { optional: true }),
    query(':enter .form-section', [style({ transform: 'translateX(100%)', opacity: 0 })], { optional: true }),
    
    group([
      query(':leave .illustration-section', [
        animate('1200ms ease-in-out', style({ transform: 'translateX(100%)' }))
      ], { optional: true }),
      query(':leave .form-section', [
        animate('1200ms ease-in-out', style({ transform: 'translateX(-100%)', opacity: 0 }))
      ], { optional: true }),
      
      query(':enter .illustration-section', [
        animate('1200ms ease-in-out', style({ transform: 'translateX(0)' }))
      ], { optional: true }),
      query(':enter .form-section', [
        animate('1200ms ease-in-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ], { optional: true })
    ])
  ]),
  transition('RegisterPage => LoginPage', [
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
    
    query(':enter .illustration-section', [style({ zIndex: 10, position: 'relative' })], { optional: true }),
    query(':leave .illustration-section', [style({ zIndex: 9, position: 'relative' })], { optional: true }),
    query(':enter .form-section, :leave .form-section', [style({ zIndex: 1, position: 'relative' })], { optional: true }),

    query(':enter .illustration-section', [style({ transform: 'translateX(100%)' })], { optional: true }),
    query(':enter .form-section', [style({ transform: 'translateX(-100%)', opacity: 0 })], { optional: true }),
    
    group([
      query(':leave .illustration-section', [
        animate('1200ms ease-in-out', style({ transform: 'translateX(-100%)' }))
      ], { optional: true }),
      query(':leave .form-section', [
        animate('1200ms ease-in-out', style({ transform: 'translateX(100%)', opacity: 0 }))
      ], { optional: true }),
      
      query(':enter .illustration-section', [
        animate('1200ms ease-in-out', style({ transform: 'translateX(0)' }))
      ], { optional: true }),
      query(':enter .form-section', [
        animate('1200ms ease-in-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ], { optional: true })
    ])
  ])
]);
