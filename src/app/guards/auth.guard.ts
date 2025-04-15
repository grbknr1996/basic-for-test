import { inject, Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.isAuthenticated$.pipe(
      take(1),
      map((isAuthenticated) => {
        // Allow access if already authenticated
        console.log('isAuthenticated', isAuthenticated);
        if (isAuthenticated) {
          return true;
        }

        // Redirect to login if not authenticated
        return this.router.createUrlTree(['/login']);
      })
    );
  }
}
