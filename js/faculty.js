// Faculty controller
// ------------------------------------------------------
ang_app.controller('facultyCtrl', function($scope, $http, $location, $data, $uuid, $toast)
{
  // GUI handlers
  // -------------------------------------------------
  $scope.handleAddFaculty = function() {
    console.log("Adding faculty...");
    // Generate random faculty member
    let $faculty = $scope.generateFaculty();
    let $postUrl = $api.url + 'faculty/';
    let $request = {
      method: 'POST',
      url: $postUrl,
      headers: {
        'Authorization': $data.uid + ":" + $data.token
      },
      data: $faculty
    };

    // POST new faculty member to server
    $http($request)
      .then(
        function (response) {
          let $msg = "Successfully added faculty member";
          console.log($msg, response.data);
          $toast.toast($msg, 'success');
          // Reload data
          $scope.loadAllFacultyData();
        },
        function (response) {
          let $msg = "ERROR posting faculty to server";
          console.log($msg, response.status);
          $toast.toast($msg);
        }
      );
  };

  $scope.handleFireFaculty = function($faculty) {
    // Set modal display name
    $scope.firedName = $faculty.first_name + " " + $faculty.last_name;

    // Show confirm modal
    $('#confirmFireModal').dialog({
      title: 'Confirm termination',
      draggable: false,
      resizable: false,
      modal: true,
      width: '50%',
      buttons: [{
        text: 'Fire!',
        click: function () {
          $scope.fireFaculty($faculty.user_id);
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

  $scope.handleShowFacultyData = function ($faculty_id) {
    console.log("Showing faculty data: " + $faculty_id );
    $data.message = $faculty_id;

    $location.path("/edit_faculty");
  };

  // Server
  // ----------------------------------------------------------
  $scope.loadAllFacultyData = function () {
    const $request_url = $api.url + "faculty/";
    let $faculty_request = {
      method: 'GET',
      url: $request_url,
      headers: {
        'Authorization': $data.uid + ":" + $data.token
      }
    };
    $http($faculty_request)
      .then(
        function successCallback(response) {
          console.log("Success response: " + response.statusText);
          $scope.faculty = response.data;
        },
        function errorCallback(response) {
          console.log("Error response: " + response.data);
        });

  };

  $scope.fireFaculty = function($faculty_id) {
    console.log("Firing faculty...", $faculty_id);
    let $deleteUrl = $api.url + "faculty/" + $faculty_id;
    let $request = {
      method: 'DELETE',
      url: $deleteUrl,
      headers: {
        'Authorization': $data.uid + ":" + $data.token
      }
    };

    // Delete faculty member from server
    $http($request)
      .then(
        function (response) {
          let $msg = "Successfully fired faculty member!";
          console.log($msg, response.data);
          $toast.toast($msg, 'success');
          // Reload data
          $scope.loadAllFacultyData();
        },
        function (response) {
          let $msg = "Could not fire faculty member! ";
          $toast.toast($msg);
        }
      );
  };

  // Generators
  // ---------------------------------------------------------
  $scope.generateFaculty = function() {
    let $first_name = $uuid.generateFirstName();
    let $last_name = $uuid.generateLastName();
    let $email =
      $first_name.toLowerCase()
        + '_'
        + $last_name.toLowerCase()
        + '@hku.edu';
    return {
      user_id: $uuid.generateUUID(),
      user_type: 'faculty',
      first_name: $first_name,
      last_name: $last_name,
      email: $email,
      phone: '5555555555',
      password: 'pass',
      address: $uuid.generateAddress()
    };
  };

  // Init page
  $scope.loadAllFacultyData();
});

// Edit faculty controller
// -----------------------------------------------
ang_app.controller('editFacultyCtrl', function ($scope, $http, $location, $data, $toast, filterFilter) {

  // Faculty member ID
  let $faculty_id = $data.message;

  // Populate GUI
  // --------------------------------------------------------
  $scope.loadAllCourseData = function() {
    const $getUrl = $api.url + "courses/";
    let $request = {
      method: 'GET',
      url: $getUrl,
      headers: {
        'Authorization': $data.uid + ":" + $data.token
      }
    };

    $http($request)
      .then(
        function successCallback(response) {
          console.log("Got all course data: " + JSON.stringify(response.data));
          $scope.all_courses = response.data;
        },
        function errorCallback(response) {
          let $msg = "Error fetching all course data";
          console.log($msg, response.status);
          $toast.toast($msg);
        }
      );
  };

  $scope.loadFacultyData = function() {
    console.log("Message: " + $data.message);
    const $getUrl = $api.url + "faculty/" + $faculty_id;
    let $faculty_request = {
      method: 'GET',
      url: $getUrl,
      headers: {
        'Authorization': $data.uid + ":" + $data.token
      }
    };

    $http($faculty_request)
      .then(
        function successCallback(response) {
          $scope.faculty = response.data;
          console.log("Got faculty data: " + JSON.stringify(response.data));
        },
        function errorCallback(response) {
          console.log("Error getting faculty data: " + response.status);
        }
      );
  };

  $scope.loadFacultyCourses = function() {
    const $getUrl = $api.url + "faculty/" + $faculty_id + "/courses/";
    let $request = {
      method: 'GET',
      url: $getUrl,
      headers: {
        'Authorization': $data.uid + ":" + $data.token
      }
    };

    $http($request)
      .then(
        function successCallback(response) {
          console.log("Got courses for faculty:");
          console.log(response.data);
          $scope.faculty_courses = response.data;
        },
        function errorCallback(response) {
          console.log("Error: Could get courses for faculty: " + response.status);
        }
      );
  };

  $scope.handleAddCourses = function() {
    // Show modal
    $("#courseMentorList").dialog({
      title: "Assign faculty to course mentorship",
      draggable: false,
      modal: true,
      width: '50%',
      buttons: [{
        text: 'ADD',
        click: function () {
          console.log("Assigning mentorships");
          $scope.updateMentorships();
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

  $scope.getMentorships = function() {
    return filterFilter($scope.all_courses, {selected: true});
  };

  $scope.updateMentorships = function() {
    const $patchUrl = $api.url + "faculty/" + $faculty_id;
    let $request = {
      method: 'PATCH',
      url: $patchUrl,
      headers: {
        'Authorization': $data.uid + ":" + $data.token
      },
      data: $scope.getMentorships()
    };

    $http($request)
      .then(
        function (response) {
          console.log("Successfully patched mentorships: " + response.data);
          $scope.loadFacultyCourses();
        },
        function (response) {
          console.log("Error patching mentorships! " + response.status);
        }
      );

    $scope.$digest();
  };

  $scope.loadAllCourseData();
  $scope.loadFacultyData();
  $scope.loadFacultyCourses();

});
