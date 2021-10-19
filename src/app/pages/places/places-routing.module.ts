import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Paths } from "../../app-routing.module";

import { PlacesPage } from './places.page';

const routes: Routes = [
  {
    path: '',
    component: PlacesPage
  },
  {
    path: Paths.DISCOVER,
    loadChildren: () => import('./discover/discover.module').then( m => m.DiscoverPageModule)
  },
  {
    path: Paths.OFFERS,
    loadChildren: () => import('./offers/offers.module').then( m => m.OffersPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlacesPageRoutingModule {}
