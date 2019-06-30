// Controller for university data
// -----------------------------------------------
ang_app.controller('universityCtrl', function ($scope, $data, $location, $http, $toast, $fileUpload) {
  // Getters
  // -----------------------------------------
  $scope.loadDocuments = function () {
    let $getUrl = $api.url + "university/documents/";
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
          console.log("Successfully loaded documents: ", response.data);
          $scope.documents = response.data;
        },
        function (response) {
          console.log("Error getting documents: " + response.status);
        }
      )
  };
  $scope.loadAddress = function() {
    let $getUrl = $api.url + "university/address/";
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
          console.log("Loaded address data", response.data);
          let $response = JSON.parse(response.data);
          // Load data into GUI
          $scope.address1 = $response.address;
          $scope.address2 = $response.additional;
          $scope.city = $response.city;
          $scope.state = $response.state;
          $scope.post_code = $response.post_code;

          console.log("Loaded data:", $scope.address1, $scope.address2, $scope.city, $scope.state);
        },
        function (response) {
          console.log("Could not load address data!", response.status);
        }
      )
  };

  // GUI handlers
  // -------------------------------------------------
  $scope.handleAddDocument = function() {
    // Show dialog
    // Validate file
    //  |__if valid, upload
    //  |__else toast error
    $("#uploadModal").dialog({
      title: "Upload a document",
      draggable: false,
      modal: true,
      width: '60%',
      resizable: false,
      buttons: [{
        text: 'Cancel',
        click: function () {
          $(this).dialog("close");
        }
      }, {
        text: 'OK',
        click: function () {
          $scope.uploadDocument();
          $(this).dialog("close");
        }
      }]
    })
  };

  $scope.handleDeleteDoc = function($doc_id) {
    // Show modal
    // If yes, send delete request
    //  |__If delete successful, update
    //  |__else toast
    $("#confirmModal").dialog({
      title: "Confirm file delete",
      draggable: false,
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
          console.log("Deleting document from server: " + $doc_id);
          $scope.deleteDocument($doc_id);
          $(this).dialog("close");
        }
      }]
    })
  };

  $scope.handleUpdateAddress = function() {
    console.log("Address is NOW", $scope.address);
    console.log("Other data is:", $scope.address1, $scope.address2, $scope.city, $scope.state);
    // return null;
    // Define data object
    let $address = {
      address: $scope.address1,
      additional: $scope.address2,
      city: $scope.city,
      state: $scope.state,
      post_code: $scope.post_code
    };

    let $patchUrl = $api.url + "university/address/";
    let $request = {
      method: 'PATCH',
      url: $patchUrl,
      headers: {
        'Authorization': $data.uid + ":" + $data.token
      },
      data: $address
    };

    $http($request)
      .then(
        function (response) {
          let $msg = "Successfully updated address.";
          console.log($msg, response.data);
          $toast.toast($msg, 'success');
        },
        function (response) {
          $toast.toast("Error updating address!\nStatus code: " + response.status);
        }
      )
  };

  // AJAX operations
  // ------------------------------------------------
  $scope.uploadDocument = function() {

    console.log("Uploading file: " + $("#documentFile").val());
      let $formData = new FormData();
      $formData.append("title", $scope.docTitle );
      $formData.append("description", $scope.docDescription );
      $formData.append( "file", $scope.docFile);

      console.log("FOrm data is ", JSON.stringify($formData));

      let $postUrl = $api.url + "university/documents/";
      let $promise = $fileUpload.upload($formData, $postUrl);
      $promise.then(
        function (response) {
          let $msg = "Successfully uploaded document to server";
          console.log($msg, response.data);
          $toast.toast($msg, 'success');
          // Refresh data
          $scope.loadDocuments();
        },
        function (response) {
          let $msg = "Error uploading file to server!";
          if(response.status === 413) {
            $msg += "\nFile size limit exceeded";
          }
          console.log($msg, response.status);
          $toast.toast($msg);
        }
      );
  };

  $scope.deleteDocument = function($doc_id) {
    let $deleteUrl = $api.url + "university/documents/" + $doc_id;
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
          let $msg = "Successfully deleted document";
          console.log($msg, response.data);
          $toast.toast($msg, 'success');
          // Reload data
          $scope.loadDocuments();
        },
        function (response) {
          console.log("Error deleting document from server: " + response.status);
          $toast.toast("Error deleting document from remote server!");
        }
      )
  };

  $scope.loadAddress();
  $scope.loadDocuments();
});
