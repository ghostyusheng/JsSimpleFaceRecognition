angular.module('starter.controllers', ['ngCordova'])

.controller('DashCtrl', function($scope, $http) {
  
  	var fun = function () {
  		alert('1');
  	};
})

.controller('myCtrl', function($scope, $http, $cordovaCamera) {
    $scope.firstName = "John";
    $scope.lastName = "Doe";

	$scope.take_photo =  function () {
	    var options = {
	      quality: 100,
	      destinationType: Camera.DestinationType.DATA_URL,
	      sourceType: Camera.PictureSourceType.CAMERA,
	      allowEdit: true,
	      encodingType: Camera.EncodingType.JPEG,
	      targetWidth: 800,
	      targetHeight: 800,
	      popoverOptions: CameraPopoverOptions,
	      saveToPhotoAlbum: true,
		  correctOrientation:true
	    };

	    $cordovaCamera.getPicture(options).then(function(imageData) {
	      var image = document.getElementById('myImage');
	      image.src = "data:image/jpeg;base64," + imageData;
	    }, function(err) {
	      // error
	    });
	};

	$scope.get_photo = function () {
	    var options = {
	      destinationType: Camera.DestinationType.FILE_URI,
	      sourceType: Camera.PictureSourceType.CAMERA,
	    };

	    $cordovaCamera.getPicture(options).then(function(imageURI) {
	      var image = document.getElementById('myImage');
	      image.src = imageURI;
	    }, function(err) {
	      // error
	    });
	    // $cordovaCamera.cleanup().then(...); // only for FILE_URI
	};

	$scope.fun = function () {
		$http({
			method: 'GET',
			url: '/someUrl'
		}).then(function successCallback(response) {
				// 请求成功执行代码
			}, function errorCallback(response) {
				// 请求失败执行代码
		});
	};
})


.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
	Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
	enableFriends: true
  };
});
