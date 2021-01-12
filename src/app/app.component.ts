import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationStart, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { SharedModule } from './shared/shared.module';

export let browserRefresh = false;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Casino Royale';
  signedIn = false;
  subscription: Subscription;

  constructor(
    private authService: AuthService,
    public router: Router) {
      this.subscription = router.events.subscribe((event) => {
        if (event instanceof NavigationStart) {
          browserRefresh = !router.navigated;
        }
      });
    }

  ngOnInit(): any {
    this.authService.signedIn$.subscribe(
      signInQ => this.signedIn = signInQ
    );
  }

  onSignOutClick(): any {
    this.router.navigate(['/home']);
    this.authService.signOut();
    localStorage.removeItem('Authorization');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
