import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad {
  // Works as service
  // Can be added to a routes
  // Depends on how we attached method define inside guard is executed and routing can continue
  // Guard that runs before the lazy-loaded code is fetched

  constructor(private authService: AuthService, private route: Router) {}

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!this.authService.userIsAuthenticated) {
      this.route.navigateByUrl('/auth');
    }
    return this.authService.userIsAuthenticated;
  }
}
