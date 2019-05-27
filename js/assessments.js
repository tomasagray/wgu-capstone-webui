// Assessment controller
ang_app.controller("assessmentsCtrl", function($scope, $http) {
  const $request_url = $api.url + "assessments/";
  $http
    .get($request_url)
    .then(
      function successCallback(response) {
        $scope.assessments = response.data;
      },
      function errorCallback(response) {
        console.log("Error fetching assessment data: " + response.toString());
      });
});
