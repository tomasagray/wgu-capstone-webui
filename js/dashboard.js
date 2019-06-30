//  AngularJS Dashboard
// ----------------------------------------------------------------
ang_app.controller("dashboardCtrl", function($scope, $http, $location) {
  console.log("Initializing dashboard");

  $scope.getRequest = function($uri) {
    const $request_url = $api.url + $uri;
    console.log("Initiating GET request to: " + $request_url);
    $http.get($request_url).then(
      function successCallback(response) {
        $scope.response = response;
      },
      function errorCallback(response) {
        console.log("Unable to fetch data from server: ");
        console.log(response);
      }
    );
  };

  $scope.menuClick = function($url) {
    console.log("Menu item clicked: " + $url);
    $location.path($url);
  }
});
