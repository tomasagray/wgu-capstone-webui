// Routing
// ----------------------------------------------------------------
ang_app.config(function($routeProvider) {
  console.log("routeProvider: " + $routeProvider.toString());
  $routeProvider
    .when("/", {
      templateUrl: "html/login.html"
    })
    .when("/dashboard", {
      templateUrl: "html/dashboard.html",
      controller: "dashboardCtrl"
    })
    .when("/students", {
      templateUrl: "html/students.html",
      controller: "studentsCtrl"
    })
    .when("/courses", {
      templateUrl: "html/courses.html",
      controller: "coursesCtrl"
    })
    .when("/assessments", {
      templateUrl: "html/assessments.html",
      controller: "assessmentsCtrl"
    })
    .when("/edit_school", {
      templateUrl: "html/edit_school.html"
    })
    .when("/edit_course", {
      templateUrl: "html/edit_course.html"
    })
    .when("/edit_assessment", {
      templateUrl: "html/edit_assessment.html"
    });
});
