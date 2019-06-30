// Routing
// ----------------------------------------------------------------
ang_app.config(function($routeProvider) {
  // Watcher

  $routeProvider
    .when("/", {
      templateUrl: "html/login.html"
    })
    .when("/dashboard", {
      templateUrl: "html/dashboard.html"
    })
    .when("/students", {
      templateUrl: "html/students.html"
    })
    .when("/courses", {
      templateUrl: "html/courses.html"
    })
    .when("/university", {
      templateUrl: "html/university.html"
    })
    .when("/faculty", {
      templateUrl: "html/faculty.html"
    })
    .when("/reports", {
      templateUrl: "html/reports.html"
    })
    .when("/edit_school", {
      templateUrl: "html/edit_school.html"
    })
    .when("/edit_student", {
      templateUrl: "html/edit_student.html"
    })
    .when("/edit_faculty", {
      templateUrl: "html/edit_faculty.html"
    })
    .when("/edit_course", {
      templateUrl: "html/edit_course.html"
    })
    .when("/edit_assessment", {
      templateUrl: "html/edit_assessment.html"
    })
    .when("/add_edit_term", {
      templateUrl: "html/add_term.html"
    });
});
