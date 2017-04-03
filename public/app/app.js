var app = angular.module('MyApp', ['mainCtrl','appRoute','customerCtrl','magazineCtrl','layoutCtrl','customerService','datatables','localytics.directives']);

app.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);




