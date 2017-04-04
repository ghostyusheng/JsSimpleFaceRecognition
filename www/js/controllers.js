angular.module('starter.controllers', ['ngCordova'])

.controller('DashCtrl', function($scope, $http) {
  
  	var fun = function () {
  		alert('1');
  	};
})

.controller('myCtrl', function($scope, $http, $cordovaCamera, $cordovaFileTransfer) {
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

	// $scope.fun = function () {
	// 	$http({
	// 		method: 'POST',
	// 		url: '/someUrl'
	// 	}).then(function successCallback(response) {
	// 			alert('success');
	// 		}, function errorCallback(response) {
	// 			alert('failed');
	// 	});
	// };

	$scope.face_distinguish = function () {
		$image_base64 = document.getElementById('myImage').getAttribute('src');

		$http({
			method: 'POST',
			url: 'http://121.42.38.165/face_server/app/Home/Api/face.php',
			headers:{'Content-Type': 'application/x-www-form-urlencoded'}, 
			// params: {
			// 	image_base64 : $image_base64
			// }
			data: {
				'image_base64': $image_base64
			},
			transformRequest: function(obj) {  
		     var str = [];  
		     for(var p in obj){  
		       str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));  
		     }  
		     return str.join("&");  
		   }  
		}).then(function successCallback(response) {
				// 请求成功执行代码
				console.log(response);
				alert(JSON.stringify(response));
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
