import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

export enum Paths {
  AUTH = 'auth',

  PLACES = 'places',
  DISCOVER = 'discover',
  PLACE_DETAIL = 'place-detail',

  OFFERS = 'offers',
  EDIT_OFFER = 'edit-offer',
  NEW_OFFER = 'new-offer',
  OFFER_BOOKINGS = 'offer-bookings',

  BOOKINGS = 'bookings',
}

const routes: Routes = [
  {
    path: '',
    // redirectTo: Paths.AUTH,
    redirectTo: Paths.PLACES,
    pathMatch: 'full',
  },
  {
    path: Paths.AUTH,
    loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthPageModule)
  },
  {
    path: Paths.PLACES,
    loadChildren: () => import('./pages/places/places.module').then( m => m.PlacesPageModule)
  },
  {
    path: Paths.BOOKINGS,
    loadChildren: () => import('./pages/bookings/bookings.module').then( m => m.BookingsPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
