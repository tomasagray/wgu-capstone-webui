// Server URL
const $base_url = "http://24.17.109.70/capstone/api/";

ang_app.controller("loginController", function($scope, $http, $location, $data, $toast) {

  // GUI handlers
  // -----------------------------------------------------------------
  $scope.handleLoginAttempt = function() {
    console.log("Button clicked");
    // Validate login form
    if ($scope.validateLoginForm()) {
      $scope.lockLoginForm();

      // Attempt login
      let $login_result = $scope.login();

      if ($login_result) {
        $scope.showNavigation();
        $location.path("students");

      } else {
        $scope.unlockLoginForm();
        $toast.toast("Login failed! Please check user name & password");
        console.log("Login failed");
      }
    } else {
      console.log("Form validation failed");
    }
  };

  $scope.handleLogout = function() {
    // Show confirm modal
    $('#logoutConfirmModal').dialog({
      title: 'Logout',
      width: '40%',
      draggable: false,
      resizable: false,
      modal: true,
      buttons: [{
        text: 'Cancel',
        click: function () {
          $(this).dialog("close");
        }
      }, {
        text: 'Logout',
        click: function () {
          $scope.logout();
          $(this).dialog("close");
          // Hide navigation
          $scope.hideNavigation();
        }
      }]
    })
  };

  $scope.showNavigation = function() {
    // Show top bar
    $("#topBar").css('display', 'inline-block');
    // Show side nav
    $("#menuBar").css('display', 'inline-block');
    $("#uiContainer").css('margin-left', '20%');
  };
  $scope.hideNavigation = function() {
    // Hide top bar
    $("#topBar").css('display', 'none');
    // Hide side nav
    $("#menuBar").css('display', 'none');
    $("#uiContainer").css('margin-left', 0);
  };

  // Login / logout
  // -----------------------------------------------------------------
  $scope.login = function () {
    let $login_result = false;

    let $l_url = $base_url + "login/";
    let $xhr = new XMLHttpRequest();
    $xhr.open("POST", $l_url, false);
    $xhr.onreadystatechange = function () {
      if (this.readyState !== 4)
        return null;

      if (this.status === 200) {
        // On success
        let $response_data = JSON.parse(this.responseText);
        $data.uid = $response_data['user_id'];
        $data.token = $response_data['token'];
        $login_result = true;
      }
    };

    // Get login data from GUI
    let $username = document.getElementById("username").value;
    let $pass = document.getElementById("password").value;
    // Create hash
    let $hash = CryptoJS.HmacSHA256($username, $pass);
    // Base64
    let $hash64 = CryptoJS.enc.Base64.stringify($hash);
    let $login_data = $username + ":" + $hash64;
    console.log("Logging in with: " + $login_data);

    $xhr.setRequestHeader("Authorization", $login_data);
    $xhr.send();

    return $login_result;
  };

  $scope.logout = function() {
    console.log("Logging out user:", $data.uid);

    // Reset login data
    $data.uid = '';
    $data.token = '';

    console.log("Data is now:", $data);
    // Send to login form
    $location.path("/").replace();
    $scope.$apply();
    console.log("Location is: ", $location)
  };


  // Login form
  // -----------------------------------------------------------
  $scope.validateLoginForm = function() {
    const $username = $("#username").val();
    const $password = $("#password").val();
    const $keep = $("#keep").prop("checked");

    // Validate username
    if ($username === "" || $username.match(/[!@#$%^&*()-_=+]/g) == null) {
      // Check for admin
      if($username !== "admin") {
        $toast.toast("Please enter a valid username");
        console.log($username + ": username invalid");
        return false;
      }
    }

    // Validate password
    if ($password === "" || $password.length < 4 || $password.length > 32) {
      $toast.toast("Please enter a valid password");
      console.log($password + ": password invalid");
      return false;
    }

    // We made it! Form validated
    return true;
  };

  $scope.lockLoginForm = function() {
    // Disable form
    $("#username").attr("disabled", true).addClass("disabled");
    $("#password").attr("disabled", true).addClass("disabled");
    // Swap button for loader
    $("#loginButton").css('display', 'none');
    $("#loginSpinner").css('display', 'block');
  };

  $scope.unlockLoginForm = function() {
    // Disable form
    $("#username").attr("disabled", false).removeClass("disabled");
    $("#password").attr("disabled", false).removeClass("disabled");
    // Swap loader back to button
    $("#loginButton").css('display', 'block');
    $("#loginSpinner").css('display', 'none');
  };
});
