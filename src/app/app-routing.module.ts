import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './gurads/auth/auth.guard';

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
    redirectTo: 'places',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./pages/auth/auth.module').then((m) => m.AuthPageModule),
  },
  {
    path: 'places',
    loadChildren: () =>
      import('./pages/places/places.module').then((m) => m.PlacesPageModule),
    canLoad: [AuthGuard],
  },
  {
    path: 'bookings',
    loadChildren: () =>
      import('./pages/bookings/bookings.module').then(
        (m) => m.BookingsPageModule
      ),
    canLoad: [AuthGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
