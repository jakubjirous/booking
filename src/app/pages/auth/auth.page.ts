import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {}

  onLogin() {
    this.loadingCtrl
      .create({
        id: 'loading',
        message: 'Logging in...',
        keyboardClose: true,
      })
      .then((loadingEl) => {
        loadingEl.present();
        setTimeout(() => {
          loadingEl.dismiss();
          this.isLoading = false;
          this.router.navigateByUrl('/places/tabs/discover');
        }, 2000);
      });
    this.isLoading = true;
    this.authService.login();
  }

  onLogout() {
    this.authService.logout();
  }
}
