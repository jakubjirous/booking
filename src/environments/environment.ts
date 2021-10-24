// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'https://ionic-angular-booking-firebase-default-rtdb.firebaseio.com',
  googleMapsApiKey: 'AIzaSyCEKl4cyNXQ92xdZV5Jt3NbjkmlGhxzdhQ', // for web
  firebase: {
    cloudFunctions:
      'https://us-central1-ionic-angular-booking-firebase.cloudfunctions.net',
    config: {
      apiKey: 'AIzaSyBLEJSpivNyclXDK8UH-4tbKUgZNqQ3s10',
      authDomain: 'ionic-angular-booking-firebase.firebaseapp.com',
      databaseURL:
        'https://ionic-angular-booking-firebase-default-rtdb.firebaseio.com',
      projectId: 'ionic-angular-booking-firebase',
      storageBucket: 'ionic-angular-booking-firebase.appspot.com',
      messagingSenderId: '694502522358',
      appId: '1:694502522358:web:7929845f75d2a1e1451bd7',
      measurementId: 'G-2TVEH1J5KN',
    },
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
