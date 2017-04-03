angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $http) {
  
  	var fun = function () {
  		alert('1');
  	};
})

.controller('myCtrl', function($scope, $http) {
	    $scope.firstName = "John";
	    $scope.lastName = "Doe";
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
