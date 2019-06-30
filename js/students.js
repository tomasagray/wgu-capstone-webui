// Students controller
// ------------------------------------------------------
ang_app.controller('studentsCtrl', function($scope, $http, $location, $data, $toast, $uuid)
{
  // GUI handlers
  // ----------------------------------------------------------
  $scope.handleAddStudent = function() {
    console.log("Adding student...");
    let $student = $scope.generateStudent();
    let $postUrl = $api.url + 'students/';
    let $request = {
      method: 'POST',
      url: $postUrl,
      headers: {
        'Authorization': $data.uid + ":" + $data.token
      },
      data: $student
    };

    // POST new student to server
    $http($request)
      .then(
        function (response) {
          let $msg = "Successfully enrolled student!";
          console.log($msg, response.data);
          $toast.toast($msg, 'success');
          // Reload data
          $scope.loadAllStudentData();
        },
        function (response) {
          let $msg = "ERROR posting student to server";
          console.log($msg, response.status);
          $toast.toast($msg);
        }
      );
  };

  $scope.handleRemoveStudent = function($student) {
    console.log("Removing student....");
    // Set modal display name
    $scope.expelledName = $student.first_name + " " + $student.last_name;

    // Show confirm modal
    $('#confirmExpelModal').dialog({
      title: 'Confirm expulsion',
      draggable: false,
      resizable: false,
      modal: true,
      width: '50%',
      buttons: [{
        text: 'Expel!',
        click: function () {
          $scope.expelStudent($student.user_id);
          $(this).dialog("close");
        }
      }, {
        text: 'Cancel',
        click: function () {
          $(this).dialog("close");
        }
      }]
    });
  };

  $scope.showStudentData = function ($student_id) {
    console.log("Showing student data " + JSON.stringify($student_id));
    $data.student_id = $student_id;

    // Go to edit student page
    $location.path("/edit_student");
  };

  // Server
  // ---------------------------------------------------------
  $scope.loadAllStudentData = function () {
    const $request_url = $api.url + "students/";
    let $request = {
      method: 'GET',
      url: $request_url,
      headers: {
        'Authorization': $data.uid + ":" + $data.token
      }
    };

    // Fetch all student data
    $http($request)
      .then(
        function successCallback (response) {
          // console.log("Success! response: " + JSON.stringify(response.data));
          $scope.students = response.data;
        },
        function errorCallback(response) {
          console.log("Error response: " + response.data);
        }
      );
  };

  $scope.expelStudent = function($student_id) {
    let $deleteUrl = $api.url + "students/" + $student_id;
    let $request = {
      method: 'DELETE',
      url: $deleteUrl,
      headers: {
        'Authorization': $data.uid + ":" + $data.token
      }
    };

    $http($request)
      .then(
        function (response) {
          let $msg = "Successfully expelled student!";
          console.log($msg, response.data);
          $toast.toast($msg, 'success');
          // Reload data
          $scope.loadAllStudentData();
        },
        function (response) {
          let $msg = "Could not expel student!";
          $toast.toast($msg);
          console.log($msg, response.status);
        }
      );
  };

  // Generators
  // ------------------------------------------------------------
  $scope.generateStudent = function() {
    let $first_name = $uuid.generateFirstName();
    let $last_name = $uuid.generateLastName();
    let $email =
      $first_name.toLowerCase()
      + '_'
      + $last_name.toLowerCase()
      + '@hku.edu';
    return {
      user_id: $uuid.generateUUID(),
      user_type: 'student',
      first_name: $first_name,
      last_name: $last_name,
      email: $email,
      phone: '5555555555',
      password: 'pass',
      address: $uuid.generateAddress()
    };
  };


  // Load data
  $scope.loadAllStudentData();
});


// Edit student controller
// ----------------------------------------------------------------
ang_app.controller('editStudentCtrl', function($scope, $data, $location, $http) {
  // Controller methods
  // -----------------------------------------------------------------------------

  // Enroll student in new term
  $scope.handleAddTerm = function() {
    $location.path("/add_edit_term");
    $data.student_id = $scope.student.user_id;
  };

  $scope.handleEditTerm = function($term_id) {
    // Find the term we want
    for(let i =0; i < $scope.terms.length; i++) {
      if($scope.terms[i].term_id === $term_id)
        $data.message = $scope.terms[i];
    }
  };

  // Un-enroll student from term
  $scope.handleDeleteTerm = function ($term_id) {
    // Show confirm modal
    $("#confirmModal").dialog({
      title: "Confirm",
      draggable: false,
      modal: true,
      width: '40%',
      buttons: [{
        text: "Cancel",
        click: function () {
          $(this).dialog("close");
        }
      }, {
        text: "OK",
        click: function () {
          console.log("Delete term: " + $term_id);
          $scope.unenrollTerm($term_id);
          $(this).dialog("close");
          // Update GUI
          $scope.getStudentTerms();
        }
     }]
    });
  };

  $scope.unenrollTerm = function($term_id) {
    let $studentId = $scope.student.user_id;
    const $deleteUrl =
      $api.url
      + "students/"
      + $studentId
      + "/terms/";
    let $request = {
      method: 'DELETE',
      url: $deleteUrl,
      headers: {
        'Authorization': $data.uid + ":" + $data.token
      },
      data: {
        term_id: $term_id
      }
    };

    $http($request)
      .then(
        function successCallback(response) {
          // We deleted the term
          console.log("Term deleted: " + response.status);
          // Update data
        },
        function errorCallback(response) {
          // Error
          console.log("Error deleting term: " + response.status);
        }
      );
  };

  $scope.getStudentData = function () {
    let $student_request = {
      method: 'GET',
      url: $student_request_url,
      headers: {
        'Authorization': $data.uid + ":" + $data.token
      }
    };

    // Fetch data for this student
    $http($student_request)
      .then(
        function successCallback (response) {
          $scope.student = response.data;
        },
        function errorCallBack(response) {
          console.log("Error getting student data: " + response.status);
        }
      );
  };
  $scope.getStudentTerms = function () {

    let $term_request = {
      method: 'GET',
      url: $term_request_url,
      headers: {
        'Authorization': $data.uid + ":" + $data.token
      }
    };

    // Get student terms
    $http($term_request)
      .then(
        function successCallback(response) {
          console.log("TERMS: got: " + JSON.stringify(response.data));
          $scope.terms = response.data;
        },
        function errorCallBack(response) {
          console.log("Error getting terms: "+ response.status);
        }
      );
  };

  // Populate GUI
  // --------------------------------------------------------------------
  // ID for student being edited
  let $student_id = $data.student_id;

  const $student_request_url = $api.url + "students/" + $student_id;
  const $term_request_url = $student_request_url + "/terms/";
  $scope.getStudentData();
  $scope.getStudentTerms();

  console.log("Edit student: ",$scope.student);
});


// Add/edit term controller
ang_app.controller('addEditTermCtrl', function ($scope, $data, $location, $http, $uuid, $toast, usDateFormatFilter)
{
  // Edit/new flag
  let $pristineTerm = null;
  // Load passed-in data
  if($data.message !== '') {
    $scope.term = $data.message;
    // Maintain original copy
    $pristineTerm = $data.message;

    let $termCourseUrl =
      $api.url
      + "students/"
      + $scope.term.studentId
      + "/terms/"
      + $scope.term.term_id
      + "/courses/";

    let $term_course_request = {
      method: 'GET',
      url:    $termCourseUrl,
      headers: {
        'Authorization': $data.uid + ":" + $data.token
      }
    };

    $http($term_course_request)
      .then(
        function successCallback (response) {
          console.log("Success: " + JSON.stringify(response.data));
          $scope.term.courses = response.data;
        },
        function errorCallback(response) {
          console.log("No courses for term: " + response.status);
          $scope.term.courses = [];
        }
      );
  } else {
    // Create new term
    $scope.term = {
      term_id: $uuid.generateUUID(),
      student_id: $data.student_id,
      start_date: usDateFormatFilter(new Date()),
      end_date: usDateFormatFilter(new Date()),
      courses: []
    };
  }

  // Clear message
  $data.message = '';

  // Data loaders
  // --------------------------------------------------------------
  $scope.loadAllCourseData = function() {
    let $course_request = {
      method: 'GET',
      url: $api.url + "courses/",
      headers: {
        'Authorization': $data.uid + ":" + $data.token
      }
    };
    $http($course_request)
      .then(
        function successCallback(response) {
          $scope.courses = response.data;
          console.log("Got courses: " + JSON.stringify($scope.courses));
        },
        function errorCallback(response) {
          console.log("Error getting all courses; " + response.status);
        }
      );
  };

  $scope.handleAddCourse = function() {
      $("#addCourseModal").dialog({
        title: "Select course to add",
        draggable: false,
        modal: true,
        width: '40%',
        buttons: [{
          text: "ADD",
          click: function () {
            $scope.addCourseToTerm();
            // $scope.addCourseToTerm($course);
            $(this).dialog("close");
            // Update GUI
            $scope.$digest();
          }
        },
          {
            text: "Cancel",
            click: function () {
              $(this).dialog("close");
            }
          }]
      });
  };

  $scope.handleRemoveCourse = function ($index) {
    $("#confirmModal").dialog({
      title: "Confirm",
      draggable: false,
      modal: true,
      width: '40%',
      buttons: [{
        text: "OK",
        click: function () {
          // Remove from list of courses
          $scope.term.courses.splice($index, 1);
          console.log("Removed course at index: " + $index);
          $(this).dialog("close");
          // Update GUI
          $scope.$digest();
        }
      }]
    });
  };

  $scope.handleSubmitTerm = function() {
    console.log("Submitting term");
    // Are we editing or creating new?
    if($pristineTerm == null) {
      // INSERT new term
      console.log("STUDENT ID:  " + $data.student_id);
      $scope.addNewTerm();
      // INSERT course list
    } else {
      console.log("Editing old term:" + JSON.stringify($pristineTerm));
      // Update term data
      $scope.updateTerm();
      // Compare course list
    }
  };

  $scope.addCourseToTerm = function() {
    // Prepare data
    console.log("selectedCourse is", $scope.selectedCourse);
    let $course = $scope.selectedCourse; //$scope.getCourse($scope.selectedCourse);
    $course.start_date = $scope.courseStart;
    $course.end_date = $scope.courseEnd;
    $course.course_status = $scope.courseStatus;

    // Check if courses has been created
    if($scope.term.courses === undefined) {
      $scope.term.courses = [];
    }

    // Add course to term
    $scope.term.courses.push($course);

    console.log("Now term courses: " + $scope.term.courses.length);
    console.log("Adding course to term: " + JSON.stringify($course));
  };

  $scope.addNewTerm = function() {
    let $postUrl = $api.url + "students/" + $data.student_id + "/terms/";
    let $add_term_request = {
      method: 'POST',
      url: $postUrl,
      headers: {
        'Authorization': $data.uid + ":" + $data.token
      },
      data: $scope.term
    };

    $http($add_term_request)
      .then(
        function successCallback(response) {
          let $msg = "Successfully added new term!";
          $toast.toast($msg, 'success');
          window.history.back();
        },
        function errorCallback(response) {
          console.log("Error saving new term!: " + response.status);
          $toast.toast("Could not save term. Duplicate ID?");
        }
      )
  };

  $scope.updateTerm = function() {
    let $patchUrl = $api.url + "students/" + $data.student_id + "/terms/";
    let $update_term_request = {
      method: 'PATCH',
      url: $patchUrl,
      headers: {
        'Authorization': $data.uid + ":" + $data.token
      },
      data: $scope.term
    };

    $http($update_term_request)
      .then(
        function successCallback(response) {
          let $msg = "Successfully updated term";
          console.log($msg, response.data);
          $toast.toast($msg, 'success');
          window.history.back();
        },
        function errorCallback(response) {
          console.log("Error: " + response.status);
          if(response.status === 409) {
            $toast.toast("Could not update term: there is a duplicate course");
          } else {
            $toast.toast("Error updating term");
          }
        }
      )
  };

  $scope.getCourse = function($course_id) {
    let $course = null;
    for(let i=0; i < $scope.courses.length; i++) {
      if($scope.courses[i].course_id === $course_id) {
        $course = $scope.courses[i];
      }
    }

    return $course;
  };

  $scope.loadAllCourseData();

});
