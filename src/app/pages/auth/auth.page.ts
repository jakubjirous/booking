import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
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
  isLoginMode = true;

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

  onSwitchAuthMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;
    // TODO: login service will be added later (Jakub Jirous 2021-10-20 13:08:36)
    console.log(email, password);

    if (this.isLoginMode) {
      // Send to request to login servers
    } else {
      // Send to request to signup servers
    }
  }
}
