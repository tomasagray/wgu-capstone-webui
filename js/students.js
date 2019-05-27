// Students controller
// ------------------------------------------------------
ang_app.controller('studentsCtrl', function($scope, $http, $location) {
  const $request_url = $api.url + "students/";
  console.log("Here we are:" + $request_url);
  $http
    .get($request_url)
    .then(
      function successCallback (response) {
        console.log("Success response: " + response.statusText);
        $scope.students = response.data;
      },
      function errorCallback(response) {
        console.log("Error response: " + response.data);
      });

  $scope.showStudentData = function ($student) {
    console.log("Showing student data " + JSON.stringify($student));
    $location.path($student);
  }
});
