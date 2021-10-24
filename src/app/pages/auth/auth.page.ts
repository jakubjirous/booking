import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import firebase from 'firebase/compat';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import UserCredential = firebase.auth.UserCredential;

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoading = false;
  isLoginMode = true;
  showPassword = false;
  userCredentials: Observable<UserCredential> = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit(): void {}

  authenticate(email: string, password: string): void {
    this.loadingCtrl
      .create({
        id: 'loading',
        message: 'Logging in...',
        keyboardClose: true,
      })
      .then((loadingEl) => {
        loadingEl.present();

        this.isLoading = true;
        if (this.isLoginMode) {
          this.userCredentials = this.authService.loginUser(email, password);
        } else {
          this.userCredentials = this.authService.registerUser(email, password);
        }

        return this.userCredentials.subscribe(
          () => {
            loadingEl.dismiss();
            this.isLoading = false;
            this.router.navigateByUrl('/places/tabs/discover');
          },
          (error) => {
            const code = error?.code;
            let message = this.isLoginMode
              ? 'Could not login you, please try again later.'
              : 'Could not sign you up, please try again later.';

            if (code === 'auth/user-not-found') {
              message = "User with this email address doesn't exist!";
            } else if (code === 'auth/invalid-email') {
              message = 'Your email address is invalid, please try again.';
            } else if (code === 'auth/wrong-password') {
              message = 'This password is not correct.';
            } else if (code === 'auth/user-disabled') {
              message = 'Your account has been disabled.';
            } else if (code === 'auth/email-already-in-use') {
              message = 'This email address exists already!';
            } else if (code === 'auth/weak-password') {
              message =
                'Your password is not strong enough. Please try to insert better one.';
            }

            this.showAlert(message);
            loadingEl.dismiss();
            this.isLoading = false;
          }
        );
      });
  }

  onLogout(): void {
    this.authService.logout();
  }

  onSwitchAuthMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  onTogglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(form: NgForm): void {
    if (!form.valid) {
      return;
    }

    const email = form?.value?.email;
    const password = form?.value?.password;
    this.authenticate(email, password);
  }

  private showAlert(message: string): void {
    this.alertCtrl
      .create({
        header: 'Authentication failed',
        message: message,
        buttons: ['Okay'],
      })
      .then((alertEl) => {
        alertEl.present();
      });
  }
}
