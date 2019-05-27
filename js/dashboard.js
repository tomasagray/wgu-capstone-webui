//  AngularJS Dashboard
// ----------------------------------------------------------------
ang_app.controller("dashboardCtrl", function($scope, $http, $location, data) {
  console.log("Initializing dashboard");
  // $("#topBar").css('display', 'inline-block');  // display top bar
  $scope.schoolTitle = "Hardt-nox";
  $scope.schoolAddress1 = "addd1";
  $scope.schoolAddress2 = "addd2";

  $scope.getRequest = function($uri) {
    const $request_url = $api.url + $uri;
    console.log("Initiating GET request to: " + $request_url);
    $http.get($request_url).then(
      function successCallback(response) {
        $scope.response = response;
        console.log("Got response: ");
        console.log(response);
      },
      function errorCallback(response) {
        console.log("Unable to fetch data from server: ");
        console.log(response);
      }
    );
  }

  $scope.menuClick = function($url) {
    console.log("Menu item clicked: " + $url);
    $location.path($url);
  }
});


// UI
// ------------------------------------------------------------------------
$(document).ready( function () {
  // Setup menu item handlers
  $("#mainMenu li").click( function () {
    $(this).siblings().removeClass("selected");
    $(this).addClass("selected");
  })
})
