// Create AngularJS application
const ang_app =
  angular
    .module("uhnApp", ["ngRoute"])
    // Services
    .service("$data", function data() {
      let $data = this;
      $data.message = '';
      $data.uid = '';
      $data.token = '';
    })
    .service("$fileUpload", function($http, $data, $q) {
      // File upload service
      this.upload = function ($formData, $url) {
        let $deferred = $q.defer();

        $http.post($url, $formData, {
          transformRequest: angular.identity,
          headers: {
            'Content-Type': undefined,
            'Authorization': $data.uid + ":" + $data.token
          }
        }).then(
          function (response) {
            $deferred.resolve(response);
          }, function (response) {
            $deferred.reject(response)
          });

        return $deferred.promise;
      }
    })
    // Directives
    .directive('uhnFileModel', function($parse) {
      return {
        restrict: 'A',  // use as attribute
        link: function (scope, element, attrs) {
          let $model = $parse(attrs.uhnFileModel);
          let $modelSetter = $model.assign;

          element.bind('change', function () {
            scope.$apply(function () {
              $modelSetter(scope, element[0].files[0]);
            });
          });
        }
      };
    })
    // Factories
    .factory("$uuid", function() {
      return {
        generateUUID: function() {
          let dt = new Date().getTime();
          return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
          });
        },
        generateFirstName: function () {
          const $first_names = [
            'Gloria', 'Otelia', 'Erlene',
            'Ashlyn', 'Joyce', 'Deedra',
            'Princess', 'Elva', 'Steven',
            'Nenita', 'Tomoko', 'Spring',
            'Brett', 'Charles', 'Matt',
            'Angelo', 'Erick', 'Floy',
            'Normand', 'Marketta', 'Sheri',
            'Eliana', 'Emerson', 'Libby',
            'Tenesha', 'Mana', 'Malcolm',
            'Sheridan', 'Renato', 'Jefferey'
          ];
          return getRandomIndex($first_names);
        },
        generateLastName: function () {
          const $last_names = [
            'Abraham', 'Allan', 'Alsop',
            'Butler', 'Cameron', 'Campbell',
            'Carr', 'Chapman', 'Churchill',
            'Clark', 'Clarkson', 'Coleman',
            'Gibson', 'Gill', 'Glover',
            'Graham', 'Grant', 'Gray',
            'Greene', 'Hamilton', 'Hardacre',
            'Johnston', 'Jones', 'Kelly',
            'Kerr', 'King', 'Knox',
            'Mackenzie', 'MacLeod', 'Manning',
            'Marshall', 'Martin', 'Mathis',
            'May', 'Morgan', 'Morrison',
            'Murray', 'Nash', 'Newman', 'Nolan',
            'North', 'Peters', 'Piper', 'Poole',
            'Powell', 'Pullman', 'Quinn',
            'Rampling', 'Randall', 'Rafford', 'Smith',
            'Springer', 'Stewart', 'Sutherland',
            'Taylor', 'Wallace', 'Walsh', 'Watson',
            'Wilkins', 'Wilson', 'Wright', 'Young'
          ];
          return getRandomIndex($last_names);
        },
        generateAddress: function () {
          const $streets = [
            'Indian Spring St.', 'Elmwood St.', 'SE. Cleveland Dr.',
            'Prince Street', 'Somerset Ave.', 'Olive Ave.',
            'Amherst Drive', 'Swanson Avenue', 'Hillside Dr.',
            'Ridgewood St.', 'Lantern Street', 'Pulaski Rd.',
            'Lilac Drive', 'SW. Iroquois Ave.', 'Pennsylvania Drive',
            'Broad Circle', 'Arch St.', 'Military Court',
            'Windsor Drive', 'Sunset Rd.', 'Fordham Dr.',
            'South Locust Drive'
          ];
          const $cities = [
            'Atlantic City', 'Rosedale', 'Middle River',
            'Charlottesville', 'Suffolk', 'Hollywood',
            'Abingdon', 'Milford', 'Pittsburgh', 'Hackensack',
            'Bowie', 'Paterson', 'Ronkonkoma', 'Severna Park',
            'Morganton', 'Fresh Meadows', 'Tualatin', 'Homestead',
            'Oakland', 'Dawsonville'
          ];
          const $states = [
            'AL', 'AK', 'AZ', 'AR',
            'CA', 'CO', 'CT', 'DE',
            'DC', 'FL', 'GA', 'HA',
            'ID', 'IN', 'IL', 'IA',
            'KS', 'KY', 'LA', 'ME',
            'MD', 'MA', 'MI', 'MS',
            'MN', 'MO', 'MT', 'NE',
            'NV', 'NH', 'NM', 'NY',
            'NC', 'ND', 'OH', 'OK',
            'OR', 'PA', 'RI', 'SC',
            'SD', 'TN', 'TX', 'UT',
            'VT', 'VA', 'WA', 'WV',
            'WI', 'WY'
          ];

          return {
            address_id: this.generateUUID(),
            building_number: rand(100, 999),
            street: getRandomIndex($streets),
            unit_number: rand(1, 100),
            city: getRandomIndex($cities),
            state: getRandomIndex($states),
            post_code: rand(10000, 99999)
          }
        }
      };
    })
    .factory("$toast", function () {
      return {
        toast: function ($msg, $type) {
          console.log("Toasing", $msg, $type);

          let $bg_color = '#aa0000';  // default
          if($type !== undefined) {
            switch ($type) {
              case 'warning':
                $bg_color = '#ff6d00';
                break;
              case 'success':
                $bg_color = '#1fc367';
                break;
              default:
                $bg_color = 'red';
                break;
            }
          }

          $("#toastContainer")
            .css('background-color', $bg_color)
            .text($msg)
            .animate({
              opacity: 100
            }, 1000)
            .delay(3000)
            .animate({
              opacity: 0
            }, 1000, function () {
              $(this).text(""); // reset to empty
            });
        }
      }
    });

// Setup AngularJS filters
// ---------------------------------------------------------------------------
ang_app.filter('usDateFormat', function() {
  return function (input) {
    if(input === undefined)
      return null;

    let date = new Date(input);
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let year = date.getFullYear();

    return month + "/" + day + "/" + year;
  }
});
ang_app.filter('phoneFormat', function () {
  return function (input) {
    if(input === undefined || input == null || input.length !== 10)
      return null;

    return '('
      + input.substr(0, 3)
      + ') '
      + input.substr(3, 3)
      + '-'
      + input.substr(6, 4);
  }
});
ang_app.filter('fileSize', function () {
  return function (input) {
    if(input === undefined || input == null)
      return null;

    let $i = parseInt(input);
    if($i < 10000) {
      return $i + "b";
    } else if($i < 1000000) {
      return Math.round($i / 1000)  + "KB";
    } else if($i < 1000000000) {
      return Math.round($i / 1000000) + "MB";
    } else {
      return input;
    }
  }
});

// Location Watcher
// ---------------------------------------------------------------------------
ang_app.run(function ($rootScope, $data, $location) {
  $rootScope.$on("$locationChangeStart", function(event, next, current)
  {
    console.log("Location change detected: ", next, current);
    // Check auth state; kick out if unauthorized
    if($data.uid === '' || $data.token === '') {
      console.log("Auth invalid, routing to login");
      $location.path("/");
    }

    let $location_stub = next.substring(next.lastIndexOf('/')+1);
    console.log("Login", $data.uid, $data.token);

    // Set menu highlight
    switch ($location_stub) {
      case 'students':
        $('#menuStudents')
          .siblings()
          .removeClass("selected");
        $('#menuStudents').addClass("selected");
        break;

      case 'faculty':
        $('#menuFaculty')
          .siblings()
          .removeClass("selected");
        $('#menuFaculty').addClass("selected");
        break;

      case 'courses':
        $('#menuCourses')
          .siblings()
          .removeClass("selected");
        $('#menuCourses').addClass("selected");
        break;

      case 'university':
        $('#menuUniversity')
          .siblings()
          .removeClass("selected");
        $('#menuUniversity').addClass("selected");
        break;

      case 'reports':
        $('#menuReports')
          .siblings()
          .removeClass("selected");
        $('#menuReports').addClass("selected");
        break;
    }
  });
});

// Set default UI state
$("#topBar").css("display", "none");
$("#menuBar").css("display", "none");

// Helper functions
// -----------------------------------------------------------------------------
function getRandomIndex($arr) {
  let $index = rand(0, ($arr.length -1));
  return $arr[$index];
}
function rand($min, $max) {
  let min = Math.ceil($min);
  let max = Math.floor($max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
