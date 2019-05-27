// Courses controller
// ----------------------------------------------
ang_app.controller("coursesCtrl", function($scope, $http, $location, $compile) {
  const $request_url = $api.url + "courses/";
  $http
    .get($request_url)
    .then(
      function successCallback(response) {
        $scope.courses = response.data;
      },
      function errorCallBack(response) {
        console.log("Error getting courses data");
      });

  $scope.openFragment = function($url, $course_id) {
    // let $compiledHTML = $compile($url);
    // console.log($compiledHTML);
    console.log("Course ID: " + $course_id);
    $location.path($url);
  }
});

// Edit course controller
// ---------------------------------------------
ang_app.controller("editCourseCtrl", function ($scope, $http) {
  // TODO: FIX THIS!
  const $request_url = $api.url + "courses/" + "2916f846-1aca-4260-b20f-fda49eec9f57";
  $http
    .get($request_url)
    .then(
      function successCallback(response) {
        $scope.course = response.data;
      },
      function errorCallback(response) {
        console.log("Error getting course data: " + response.error);
      }
    );
});
