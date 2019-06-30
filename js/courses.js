// Courses controller
// ----------------------------------------------
ang_app.controller("coursesCtrl", function($scope, $http, $location, $data, $toast)
{
  // GUI handlers
  // --------------------------------------------------------
  $scope.handleRemoveCourse = function($course) {
    // Set modal data
    $scope.deleteCourseName =
      $course.course_number
      + ' - '
      + $course.title;
    // Show confirmation modal
    $('#deleteCourseModal').dialog({
      title: 'Confirm delete course',
      draggable: false,
      resizable: false,
      modal: true,
      width: '50%',
      buttons: [{
        text: 'DELETE',
        click: function () {
          console.log("Removing course:", $course);
          $scope.deleteCourse($course.course_id);
          $(this).dialog("close");
          // Reload data
          $scope.loadAllCourses();
        }
      }, {
        text: 'Cancel',
        click: function () {
          $(this).dialog("close");
        }
      }]
    });
  };

  $scope.handleShowCourseData = function($course_id) {
    console.log("Showing course data for : " + $course_id);
    $data.course_id = $course_id;
    $location.path("/edit_course");
  };

  $scope.handleAddCourse = function() {
    // Ensure course ID has been cleared
    $data.course_id = null;
    $location.path("/edit_course");
  };

  // Server
  // ----------------------------------------------
  $scope.loadAllCourses = function () {
    const $request_url = $api.url + "courses/";
    let $request = {
      method: 'GET',
      url: $request_url,
      headers: {
        'Authorization': $data.uid + ":" + $data.token
      }
    };
    $http($request)
      .then(
        function successCallback(response) {
          $scope.courses = response.data;
        },
        function errorCallBack(response) {
          console.log("Error getting courses data: " + response.status);
        });
  };

  $scope.deleteCourse = function($course_id) {
    let $deleteUrl = $api.url + "courses/" + $course_id;
    let $request = {
      method: 'DELETE',
      url: $deleteUrl,
      headers: {
        'Authorization': $data.uid + ":" + $data.token
      }
    };

    // DELETE course from server
    $http($request)
      .then(
        function (response) {
          let $msg = "Successfully deleted course!";
          console.log($msg, response.data);
          $toast.toast($msg, 'success');
        },
        function (response) {
          let $msg = "Error deleting course from server!";
          console.log($msg, response.status);
          $toast.toast($msg);
        }
      );
  };

  $scope.loadAllCourses();
});

// Edit course controller
// ---------------------------------------------
ang_app.controller("editCourseCtrl", function ($scope, $http, $location, $data, $toast, $uuid)
{
  // GUI handlers
  // ---------------------------------------------------------------------
  // Assessments
  $scope.handleAssessmentClick = function($assessment) {
    $data.message = {
      assessment: $assessment
    };
    $location.path("/edit_assessment");
  };

  $scope.handleAddAssessment = function() {
    $data.message = {
      course_id: $course_id
    };
    // Scroll to top
    window.scrollTo(0,0);
    $location.path("/edit_assessment");
  };

  $scope.handleRemoveAssessment = function($assessment_id) {
    // Show confirm modal
    $("#confirmModal").dialog({
      title: "Remove assessment from course?",
      draggable: false,
      resizable: false,
      modal: true,
      width: '50%',
      buttons: [{
        text: 'Cancel',
        click: function () {
          $(this).dialog("close");
        }
      }, {
        text: 'OK',
        click: function () {
          $scope.removeAssessment($assessment_id);
          $(this).dialog("close");
        }
      }]
    })
  };

  // Mentors
  $scope.handleEditMentor = function() {
    // Show dialog
    $("#mentorListModal").dialog({
      title: "Select course mentor",
      draggable: false,
      resizable: false,
      modal: true,
      width: '50%',
      height: 'auto',
      buttons: [{
        text: 'OK',
        click: function () {
          console.log("Assigning mentor to course: " + JSON.stringify($scope.dlg_mentor));
          // Assign data
          $scope.course.mentor = $scope.dlg_mentor;
          $scope.course.mentor_id = $scope.dlg_mentor.user_id;
          $scope.course.mentor_name = $scope.dlg_mentor.first_name + " " + $scope.dlg_mentor.last_name;
          $scope.course.mentor_email = $scope.dlg_mentor.email;
          $scope.course.mentor_phone = $scope.dlg_mentor.phone;
          $scope.$apply();
          $(this).dialog("close");
        }
      }, {
        text: 'Cancel',
        click: function () {
          $(this).dialog("close");
        }
      }]
    });
    // Get choice
    // Assign to course
  };

  $scope.handleSetMentor = function($index) {
    console.log("index clicked:", $index);
  };


  // Getters
  // ---------------------------------------------------------------------
  // Load course data
  $scope.loadCourseData = function() {
    const $getUrl = $api.url + "courses/" + $course_id;
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
          console.log("Got course data: " + JSON.stringify(response.data));
          $scope.course = response.data;
          // Initialize mentor list modal
          $scope.dlg_mentor = {
            user_id: $scope.course.mentor_id,
            name: $scope.course.mentor_name,
            email: $scope.course.mentor_email,
            phone: $scope.course.mentor_phone
          };
          console.log("dlg_mentor:", $scope.dlg_mentor);
        },
        function (response) {
          console.log("Error getting course data: " + response.status);
        }
      );
  };

  // Get assessments for this course
  $scope.loadAssessmentData = function() {
    let $assessUrl = $api.url + "courses/" + $course_id + "/assessments/";
    let $assess_request = {
      method: 'GET',
      url: $assessUrl,
      headers: {
        'Authorization': $data.uid + ":" + $data.token
      }
    };

    $http($assess_request)
      .then(
        function (response) {
          // Local copy
          $scope.assessments = response.data;
        },
        function (response) {
          console.log(
            "Error getting assessments for course: "
            + $scope.course.course_id + ": "
            + response.status
          );
        }
      );
  };

  // Get list of faculty (mentors)
  $scope.loadMentorData = function() {
    let $getUrl = $api.url + "faculty/";
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
          console.log("Got all faculty data", response.data);
          $scope.mentors = response.data;
        },
        function (response) {
          console.log("Error getting faculty data!: " + response.status);
        }
      );
  };

  // Server
  // ---------------------------------------------------------------------
  $scope.handleSubmitCourse = function() {
    // Editing existing course...
    if($course_id !== undefined) {
      $scope.updateCourse();
    // Adding new course...
    } else {
      console.log("Uploading new course: ", $scope.course);
      $scope.addCourse();
    }
  };

  $scope.addCourse = function() {
    let $postUrl = $api.url + "courses/";
    let $request = {
      method: 'POST',
      url: $postUrl,
      headers: {
        'Authorization': $data.uid + ":" + $data.token
      },
      data: $scope.course
    };

    // POST course to server
    $http($request)
      .then(
        function (response) {
          let $msg = "Successfully uploaded course";
          console.log($msg, response.data);
          $toast.toast($msg, 'success');
          // Go back to course list
          window.history.back();
        },
        function (response) {
          let $msg = "Error uploading course to server!";
          console.log($msg, response.status);
          $toast.toast($msg);
        }
      );
  };

  $scope.updateCourse = function() {
    let $patchUrl = $api.url + "courses/" + $course_id;
    let $request = {
      method: 'PATCH',
      url: $patchUrl,
      headers: {
        'Authorization': $data.uid + ":" + $data.token
      },
      data: $scope.course
    };

    $http($request)
      .then(
        function (response) {
          let $msg = "Successfully updated course";
          console.log($msg, response.data);
          $toast.toast($msg, 'success');
          // Go back to course list
          window.history.back();
        },
        function (response) {
          let $msg = "Error updating course!";
          console.log($msg, response.status);
          $toast.toast($msg);
        }
      );
  };

  $scope.removeAssessment = function($assessment_id) {
    console.log("Removing assessment: " + $assessment_id);

    let $deleteUrl =
      $api.url
      + "courses/"
      + $course_id
      + "/assessments/"
      + $assessment_id;

    const $request = {
      method: 'DELETE',
      url: $deleteUrl,
      headers: {
        'Authorization': $data.uid + ":" + $data.token
      }
    };

    $http($request)
      .then(
        function (response) {
          console.log("Successfully deleted assessment!");
          console.log(response.data);
          // Reload assessment data
          $scope.loadAssessmentData();
        },
        function (response) {
          console.log("Error deleting assessment: " + response.status);
        }
      );
  };



  // Course ID for course being modelled
  let $course_id;
  // New/edit flag
  $scope.edit_mode = true;  // default: edit
                          // set to false for new mode
  $scope.dlg_mentor = '';

  // Load mentors list
  $scope.loadMentorData();

  // Determine if editing existing or creating new
  if($data.course_id !== undefined && $data.course_id !== null) {
    // ID for course being modelled
     $course_id = $data.course_id;

    // Set course to be edited
    $scope.loadCourseData();
    // Load assessments for this course
    $scope.loadAssessmentData();
  } else {
    // Creating a new course
    $scope.edit_mode = false;
    // Create course
    $scope.course = {
      course_id: $uuid.generateUUID(),
      title: '',
      course_number: '',
      credits: 3
    };
  }
});
