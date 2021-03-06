// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyBGqFrqSO8rsKPIgIMbOQCLZvxRCMlTYRY",
    authDomain: "slunch-voter-dev.firebaseapp.com",
    databaseURL: "https://slunch-voter-dev.firebaseio.com",
    projectId: "slunch-voter-dev",
    storageBucket: "slunch-voter-dev.appspot.com",
    messagingSenderId: "1066268706966"
  },
  adminRef: "admin/zVF84avWHGhKC0QBNiKL",
  stateRef: "state/FFv5YTIgUR0GwqvmkDgw",
  defaultIconUrl: "http://www.tasteinsf.com/public/images/default-restaurant-thumbnail-250x244.png"
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
