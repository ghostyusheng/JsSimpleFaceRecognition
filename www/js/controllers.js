angular.module('starter.controllers', ['ngCordova'])

.controller('DashCtrl', function($scope, $http) {

    
})

.controller('myCtrl', function($scope, $http, $cordovaCamera,$cordovaImagePicker,$cordovaFileTransfer, $cordovaFile, $cordovaSocialSharing) {
       

        $scope.take_photo = function() {
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
                correctOrientation: true
            };

            $cordovaCamera.getPicture(options).then(function(imageData) {
                var image = document.getElementById('myImage');
                image.src = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                // error
            });
        };

        $scope.ImagePicke=function(){
        	var options = {
	            maximumImagesCount: 1,
	            width: 800,
	            height: 800,
	            quality: 100
        	};
            
        	$cordovaImagePicker.getPictures(options)
            .then(function (results) {
				// alert(document.getElementById('myImage').getAttribute('src'));

				  results = String(results);
				  var imagePath = results.substr(0, results.lastIndexOf('/') + 1);
      			  var imageName = results.substr(results.lastIndexOf('/') + 1);
				  // alert(results);
				  // alert(imagePath);
				  // alert(imageName);

                  $cordovaFile.readAsDataURL(imagePath, imageName)
                 .then(function (success) {
			        // success
			        document.getElementById('myImage').setAttribute('src', success);
			      }, function (error) {
			        // error
			        alert('error');
			      });
			      
            }, function (error) {
                // error getting photos
            });
        };
        	
        $scope.get_photo = function() {
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

        $scope.share_sms = function() {
        	$cordovaSocialSharing
		    .shareViaSMS('111', '13023150103')
		    .then(function(result) {
		      // Success!
		    }, function(err) {
		      // An error occurred. Show a message to the user
		    });
        }


        $scope.face_distinguish = function() {

            $image_base64 = document.getElementById('myImage').getAttribute('src');

            $http({
                method: 'POST',
                url: 'http://121.42.38.165/face_server/app/Home/Api/face.php',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                // params: {
                // 	image_base64 : $image_base64
                // }
                data: {
                    'image_base64': $image_base64
                },
                transformRequest: function(obj) {
                    var str = [];
                    for (var p in obj) {
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    }
                    return str.join("&");
                }
            }).then(function successCallback(response) {
                
                // 请求成功执行代码
                // console.log(response);
                //  layer.msg('Hello layer');
                // alert(JSON.stringify(response));
                var res = JSON.stringify(response);
                var response = JSON.parse(res);
                console.log(response);
                var age = response.data.faces[0].attributes.age.value;
                var sex = response.data.faces[0].attributes.gender.value;
                var ethnicity = response.data.faces[0].attributes.ethnicity.value;
                var glassType = response.data.faces[0].attributes.glass.value;
                var smileValue = response.data.faces[0].attributes.smile.value;
                var facequalityValue = response.data.faces[0].attributes.facequality.value;
                //微笑分析
                var smile;
                if (smileValue > 30.1) {
                    smile = "Smile";
                } else {
                    smile = "No";
                }
                //眼镜类型
                var glass;
                	switch(glassType){
                		case "None":
                			glass="无";
                		break;
                		case "Dark":
                		glass="墨镜";
                		break;
                		case "Normal":
                		glass="普通眼镜";
                		break;
                	}

                //弹层显示分析结果
                layer.open({
                    title: '分析结果',
                    content: '您的性别是：' + sex + '<br/>' 
                    + '您的年龄是：' + age + '<br/>' 
                    + '您的种族是：' + ethnicity + '<br/>' 
                    + '是否佩戴眼镜：' + glass + '<br/>' 
                    + '是否微笑：' + smile + '<br/>' 
                    + '皮肤质量：' + facequalityValue + '<br/>'
                });

                $scope.save_user_info(age, sex, ethnicity, glass, smile, facequalityValue);
                
            }, function errorCallback(response) {
                // 请求失败执行代码
                layer.msg('服务器出错！');
            });
        };

        $scope.save_user_info = function (age, sex, ethnicity, glass, smile, facequalityValue) {
            var username = localStorage.getItem("username");

            var param = {
                'username' : username,
                'sex'      : sex,
                'age'      : age,
                'ethnicity' : ethnicity,
                'wearGlass'  : glass,
                'isSmile' : smile,
                'skinQuality' : facequalityValue
            };

            // console.log(param);

            $http({
            method: 'POST',
            url: 'http://121.42.38.165/face_server/app/Admin/Api/doSaveFaceInfo.php',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: param,
            transformRequest: function(obj) {
                var str = [];
                for (var p in obj) {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
                return str.join("&");
            }
            }).then(function successCallback(response) {
                // console.log(response);
                // alert(JSON.stringify(response));

            }, function errorCallback(response) {
                // 请求失败执行代码
                layer.msg('服务器出错！');
            });
        }

    })
    .controller('floginCtrl', ['$scope', '$http', function($scope, $http) {
        // $scope.formModel = {};
        $scope.submitted = false;
        $scope.onSubmit = function(form) {
            
                var param = {
                     username: form.username.$viewValue,
                	 password: form.password.$viewValue
                }

            $http({
            method: 'POST',
            url: 'http://121.42.38.165/face_server/app/Admin/Api/doLogin.php',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: param,
            transformRequest: function(obj) {
                var str = [];
                for (var p in obj) {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
                return str.join("&");
            }
            }).then(function successCallback(response) {
                if (response.data.status == "success") {
                    localStorage.setItem("username", response.data.data.username);
                    layer.msg('尊敬的 ' + response.data.data.username 
                        +   ' 欢迎您！');
                    window.location.href='#/tab/dash';
                } else {
                    layer.msg('登录失败！');
                }

            }, function errorCallback(response) {
                // 请求失败执行代码
                layer.msg('服务器出错！');
            });
        }
    }])

.controller('registerCtrl', ['$scope', '$http', function($scope, $http) {
    // $scope.formModel = {};
    $scope.submitted = false;
    $scope.onSubmit = function(form) {
        var param = {
            username: form.username.$viewValue,
            password: form.password1.$viewValue
        }

        $http({
                method: 'POST',
                url: 'http://121.42.38.165/face_server/app/Admin/Api/doReg.php',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                // params: {
                // 	image_base64 : $image_base64
                // }
                data: param,
                transformRequest: function(obj) {
                    var str = [];
                    for (var p in obj) {
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    }
                    return str.join("&");
                }
            }).then(function successCallback(response) {
                    console.log(response);

                if (response.data.status == "success") {
                    layer.msg('注册成功！');
                    window.location.href='#/flogin.html';
                } else {
                     layer.msg('用户名已存在！');
                }

            }, function errorCallback(response) {
                // 请求失败执行代码
                layer.msg('服务器出错！');
            });
    }

}])

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

.controller('SettingCtrl', function($scope, $cordovaSocialSharing) {

    $scope.share_sms = function() {
        var phone =prompt('分享的号码？', '');

        if (phone) {
            $cordovaSocialSharing
            .shareViaSMS('小伙伴你好，我的人脸结果是xxx，你也快来参与吧', phone)
            .then(function(result) {
              // Success!
            }, function(err) {
              // An error occurred. Show a message to the user
            });
        }
    }

    $scope.exitApp = function() {
        ionic.Platform.exitApp();
    }

})

.controller('AccountCtrl', function($scope, $http) {

    var username = localStorage.getItem("username");
    // console.log(username);

    var param = {
        'username' : username
    };

    $http({
        method: 'POST',
        url: 'http://121.42.38.165/face_server/app/Admin/Api/doGetFaceInfo.php',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: param,
        transformRequest: function(obj) {
            var str = [];
            for (var p in obj) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
            return str.join("&");
        }
    }).then(function successCallback(response) {
        console.log(response);
        document.getElementById("user").innerText = username;
        document.getElementById("sex").innerText = response.data.data.sex;
        document.getElementById("age").innerText = response.data.data.age;
        document.getElementById("ethnicity").innerText = response.data.data.ethnicity;
        document.getElementById("wearGlass").innerText = response.data.data.wearGlass;
        document.getElementById("isSmile").innerText = response.data.data.isSmile;
        document.getElementById("skinQuality").innerText = response.data.data.skinQuality;
    }, function errorCallback(response) {
        layer.msg('服务器出错！');
    });


     // document.getElementById("user").innerText = localStorage.getItem("username");
});
