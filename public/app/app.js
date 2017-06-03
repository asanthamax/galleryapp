var app = angular.module('MyApp', ['mainCtrl','appRoute','customerCtrl','magazineCtrl','layoutCtrl','loginCtrl','customerService','userService','datatables','localytics.directives']);

app.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);




