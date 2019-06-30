// Reports controller
// -------------------------------------------------------------
ang_app.controller('reportsCtrl', function ($scope, $data, $http, $toast)
{
  // Controller-globals
  const $months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December'
  ];
  const $bgColors = [
    'rgba(23, 199, 122, 0.8)',
    'rgba(54, 162, 235, 0.8)',
    'rgba(255, 206, 86, 0.8)',
    'rgba(255, 122, 32, 0.8)',
    'rgba(215, 222, 22, 0.8)',
    'rgba(55, 112, 212, 0.8)',
    'rgba(125, 122, 112, 0.8)',
    'rgba(255, 22, 212, 0.8)',
    'rgba(255, 222, 112, 0.8)',
    'rgba(155, 233, 212, 0.8)',
    'rgba(55, 122, 112, 0.8)',
    'rgba(55, 212, 112, 0.8)'
  ];

  // Chart setup
  // -------------------------------------------------
  $scope.setupCourseStatusChart = function () {
    let $ctx_courseStatus = $("#courseStatus");
    let $courseStatusChart = new Chart($ctx_courseStatus, {
      type: 'pie',
      data: {
        labels: ['In Progress', 'Planned', 'Completed', 'Dropped'],
        datasets: [{
          data: [
            $scope.courseReportData.in_progress,
            $scope.courseReportData.planned,
            $scope.courseReportData.completed,
            $scope.courseReportData.dropped
          ],
          backgroundColor: [
            'rgba(23, 199, 122, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(255, 22, 12, 1)'
          ]
        }]
      }
    });
  };

  $scope.setupEnrollmentChart = function() {
    let $ctx_enrollments = $("#enrollmentChart");
    let $enrollmentsChart = new Chart($ctx_enrollments, {
      type: 'line',
      data: {
        labels: $months,
        datasets: [{
          label: 'Enrollments',
          data: $scope.enrollmentReportData,
          backgroundColor: ['rgba(255, 22, 212, 0.8)']
        }]
      },
      options: {
        scales: {
          yAxes: [{
            display: true,
            ticks: {
              suggestedMin: 0,
              beginAtZero: true
            }
          }]
        }
      }
    });
  };

  $scope.setupStudentsCourseChart = function() {
    let $ctx_students = $("#studentsCourse");
    let $studentCourseChart = new Chart($ctx_students, {
      type: 'bar',
      data: {
        labels: $scope.parseCourseReportLabels(),
        datasets: [{
          label: '# of students',
          data: $scope.parseCourseReportData(),
          backgroundColor: $bgColors
        }]
      },
      options: {
        scales: {
          yAxes: [{
            display: true,
            ticks: {
              suggestedMin: 0,
              beginAtZero: true
            }
          }]
        }
      }
    });
  };

  // Data loaders
  // -------------------------------------------------
  $scope.loadCourseStatusReport = function() {
    let $getUrl = $api.url + "reports/course_status_distribution/";
    let $request = {
      method: 'GET',
      url: $getUrl,
      headers: {
        'Authorization': $data.uid + ":" + $data.token
      }
    };

    $http($request)
      .then(
        function (response) {
          // Load data
          $scope.courseReportData = response.data;
          // Setup chart
          $scope.setupCourseStatusChart();
        },
        function (response) {
          console.log("Error getting report data:", response.status);
        }
      );
  };

  $scope.loadEnrollmentsReport = function() {
    let $getUrl = $api.url + "reports/enrollments_per_month/";
    let $request = {
      method: 'GET',
      url: $getUrl,
      headers: {
        'Authorization': $data.uid + ":" + $data.token
      }
    };

    $http($request)
      .then(
        function (response) {
          console.log("Retrieved enrollments report data", response.data);
          $scope.enrollmentReportData = $scope.parseEnrollmentReportData(response.data);
          console.log("Parsed Report data is:", $scope.enrollmentReportData);
          // Setup chart
          $scope.setupEnrollmentChart();
        },
        function (response) {
          let $msg = "Could not retrieve enrollments report data!";
          $toast.toast($msg);
        }
      )
  };

  $scope.loadStudentCourseReport = function() {
    let $getUrl = $api.url + "reports/students_per_course/";
    let $request = {
      method: 'GET',
      url: $getUrl,
      headers: {
        'Authorization': $data.uid + ":" + $data.token
      }
    };

    $http($request)
      .then(
        function (response) {
          console.log("Got students per course report data", response.data);
          $scope.studentCourseReportData = response.data;
          // Setup chart
          $scope.setupStudentsCourseChart();
        },
        function (response) {
          let $msg = "Could not fetch student per course report data";
          console.log($msg, response.status);
          $toast.toast($msg);
        }
      );
  };

  // Parsers
  // ---------------------------------------------------------
  $scope.parseEnrollmentReportData = function($data) {
    let $termData = [];
    // Extract data from object into array
    for(let i=0; i < $data.length; i++) {
      let $index = $months.indexOf($data[i].month);
      $termData[$index] = $data[i].terms;
    }

    return $termData;
  };

  $scope.parseCourseReportLabels = function() {
    let $data = $scope.studentCourseReportData;
    let $labels = [];
    for(let i=0; i < $data.length; i++) {
      let $str = $data[i].course_number
                  + ' - '
                  + $data[i].title;
      // Ensure labels are not too long
      if($str.length > 30) {
        $str = $str.substr(0, 27)
              + '...';
      }

      $labels[i] = $str;
    }

    return $labels;
  };

  $scope.parseCourseReportData = function() {
    let $handle = $scope.studentCourseReportData;
    let $data = [];
    for(let i=0; i < $handle.length; i++) {
      $data[i] = $handle[i].students;
    }

    return $data;
  };


  // Load data & setup charts
  $scope.loadCourseStatusReport();
  $scope.loadEnrollmentsReport();
  $scope.loadStudentCourseReport();

});
