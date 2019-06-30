// Edit assessment controller
// ----------------------------------------------------------------
ang_app.controller("editAssessmentCtrl", function($scope, $http, $data, $location, $uuid, $toast)
{
  $scope.handleAddItem = function() {
    console.log("Adding item");
    $scope.assessment.items.push({});
  };

  $scope.handleDeleteItem = function($index) {
    console.log("Deleting item at index: " + $index);
    $scope.assessment.items.splice($index, 1);
  };

  $scope.handleSaveAssessment = function () {
    // Are we saving new or editing old?
    if($scope.editMode === 'new') {
      // TODO: Implement
      /*
      * For dynamically generated course.
       */
      /*
      console.log("Adding new assessment to in-memory cache");
      $data.assessments.push($scope.assessment);
      window.history.back();
       */
      $scope.saveNewAssessment();
    } else {
      // TODO: Implement
      /*
      * For adding assessments to dynamically generated (not yet
      * saved in DB) course.
       */
      /*
      console.log("Updating existing assessment in memory", $data.assessments);
      for(let i=0; i < $data.assessments.length; i++) {
        if($data.assessments[i].assessment_id === $scope.assessment.assessment_id) {
          // Copy data
          $data.assessments[i] = $scope.assessment;
          // Break loop
          break;
        }
      }
      window.history.back();
      */
      $scope.saveUpdateAssessment();
    }
  };

  $scope.saveUpdateAssessment = function() {
    const $patchUrl =
      $api.url
      + "courses/"
      + $scope.assessment.course_id
      + "/assessments/";

    let $request = {
      method: 'PATCH',
      url: $patchUrl,
      headers: {
        'Authorization': $data.uid + ":" + $data.token
      },
      data: $scope.assessment
    };

    $http($request)
      .then(
        function (response) {
          let $msg = "Successfully updated assessment!";
          console.log($msg, response.data);
          $toast.toast($msg, 'success');
          window.history.back();
        },
        function (response) {
          console.log("Error updating assessment!: " + response.status);
        }
      );
  };

  $scope.saveNewAssessment = function () {
    const $postUrl =
      $api.url
      + "courses/"
      + $scope.assessment.course_id
      + "/assessments/";

    let $request = {
      method: 'POST',
      url: $postUrl,
      headers: {
        'Authorization': $data.uid + ":" + $data.token
      },
      data: $scope.assessment
    };

    $http($request)
      .then(
        function (response) {
          console.log("Successfully saved assessment!: " + JSON.stringify(response.data));
          window.history.back();
        },
        function (response) {
          console.log("Error saving assessment!: " + response.status);
        }
      );
  };

  // Edit mode flag
  $scope.editMode = 'new';

  // Load data
  // ------------------------------------------------------------------------
  if($data.message.assessment !== undefined) {
    $scope.assessment = $data.message.assessment;
    $scope.editMode = 'update';

    console.log("Editing assessment: " + JSON.stringify($scope.assessment));
    // Clear message
    $data.message = '';
  } else {
    console.log("Creating new assessment for course: " + JSON.stringify($data.message.course_id));
    // Generate new assessment
    $scope.assessment = {
      assessment_id: $uuid.generateUUID(),
      course_id: $data.message.course_id,
      title: '',
      type: "objective",
      items: [{}]
    };
  }
});
