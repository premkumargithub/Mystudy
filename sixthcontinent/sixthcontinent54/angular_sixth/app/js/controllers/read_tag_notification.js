app.controller('PostTaggedDetail', ['$cookieStore', '$scope', '$rootScope', '$http', '$timeout', '$routeParams', 'ProfileService', function($cookieStore, $scope, $rootScope, $http, $timeout, $routeParams, ProfileService) {

	$scope.readNotification = function(id) {
	opts = {};
	opts.user_id = (APP.currentUser.id).toString();
	opts.notification_id = id;
	ProfileService.markReadNotification(opts, function(data) {
		if(data.code == 101) {
		} else {
		}
	});
	};
}]);

app.controller('ShopPostDetail', ['$cookieStore', '$modal', '$location', '$scope', '$rootScope', '$http', '$timeout', '$routeParams', 'StoreService' ,function($cookieStore, $modal, $location, $scope, $rootScope, $http, $timeout, $routeParams, StoreService) {
	$scope.storeId = $routeParams.shopId;
    $scope.posts = [];
	$scope.storePostLoading = true;
    $scope.textLimit = APP.post_charecter_limit;
	opts = {};
	opts.user_id = APP.currentUser.id;
	opts.store_id = $routeParams.shopId;
	opts.post_id = $routeParams.postId;
	StoreService.getStorePostDetail(opts, function(data) {
		if(data.code == 101) {
			$scope.posts = data.data;
		} else {
			$scope.posts = [];
		}
		$scope.storePostLoading = false;
	});
    $scope.showAllFriend = function(post_id, creater_info, allTagFriend){
            $scope.allTagFriends = allTagFriend;
            $scope.post_id = post_id;
            $scope.creater = creater_info;
            var modalInstance = $modal.open({
                template: '<div id="friendModal" class="modal-header"> <h3 class="modal-title">People</h3><div class="modal-popup-close" ng-click="closeModal()"></div> </div><div class="modal-body tag-frnd-modal"><ul><li data-ng-repeat="friend in allTagFriends"><span class="tag-img"><img title="" style="width:30px;height:30px" alt="No image available" data-ng-src="{{friend.profile_image_thumb}}" data-ng-if="friend.profile_image_thumb != null  && friend.profile_image_thumb != \'\'"><img title="" alt="No image available" src="app/assets/images/dummy32X32.jpg" data-ng-if="friend.profile_image_thumb == null || friend.profile_image_thumb == \'\'"></span><span class="tag-frnd-name"><a href ng-click="viewFriendProile(friend.id)">{{friend.first_name}} {{friend.last_name}}</a></span></li></ul></div><div class="modal-footer"></div>',
                controller: 'ModalController',
                size: 'lg',
                scope: $scope,
            });

            modalInstance.result.then(function (selectedItem) {
            }, function () {
                //$log.info('Modal dismissed at: ' + new Date());
            });
            $scope.viewFriendProile = function(friendId){
                modalInstance.dismiss('cancel');
                $location.path('/viewfriend/'+friendId);
            };
        };
  
}]);

app.controller('ClubPostDetail', ['$cookieStore', '$scope', '$rootScope', '$http', '$timeout', '$routeParams', 'GroupService', function($cookieStore, $scope, $rootScope, $http, $timeout, $routeParams, GroupService) {
	$scope.posts = [];
	$scope.groupPostDetailLoading = false;
    $scope.textLimit = APP.post_charecter_limit;
	opts = {};
	opts.user_id = APP.currentUser.id;
	opts.user_group_id = $routeParams.clubId;
	opts.post_id = $routeParams.postId;
	GroupService.getClubPostDetail(opts, function(data) {
		if(data.code == 101) {
			$scope.posts = data.data;
		} else {
			$scope.posts = [];
		}
		$scope.groupPostDetailLoading = true;
	});

}]);
app.controller('GroupDetailNotiController',['$scope', '$http', '$rootScope', '$location', '$routeParams', '$interval', 'GroupService', 'ProfileService', 'fileReader', '$timeout','$modal', '$log', function ($scope, $http, $rootScope, $location, $routeParams, $interval, GroupService, ProfileService, fileReader, $timeout ,$modal ,$log) {
   $scope.displayGroupNotiDetail = function() {
        var groupId = $routeParams.clubId;
        var groupStatus = $routeParams.status;
        opts = {};
        opts.user_id = APP.currentUser.id;
        opts.group_id = groupId; 
        opts.group_status = groupStatus;
        GroupService.getGroupDetail(opts, function(data) {
            $scope.groupViewLoader = false;
            if( data.code == 101) {
                $scope.groupDetail = data.data;
                $scope.editGroupObject = $scope.groupDetail;
            } else {

            }
        });
    };
    $scope.displayGroupNotiDetail();

}]);
app.directive('rateCommonClubPost',['$modal', '$log', '$location', 'ProfileService', function($modal, $log, $location, ProfileService){
    return {
        templateUrl: 'app/views/rating_star_post.html',
        restrict: "E",
        scope: true,
        controller : function($scope, $modal, $log, ProfileService){
            $scope.hoveringOver = function(value) {
            $scope.overStar = value;
            $scope.percent = 100 * (value / $scope.max);
            };
            $scope.avg_rate = true;
            $scope.averageVoting = 0;
            $scope.vote_count = 0;
            $scope.waitRateResponse = false;
            $scope.showPeopleLoader = false;
            $scope.max = 5;
            $scope.isReadonly = false;
            $scope.WaitDeleteResponse = false;
            $scope.stars = [];

          $scope.findPeople = function(id,count_Vote){
            if(count_Vote === 0 ){
                return false;
            }
            var opts = {};
            $scope.ratedUsers = {};
            $scope.showPeopleLoader = true;

            var modalInstance = $modal.open({
                        templateUrl: 'app/views/find_people.html',
                        controller: 'ModalController',
                        size: 'lg',
                        scope: $scope,
            });
            opts.type = "club_post";
            opts.type_id = id;
            opts.session_id = APP.currentUser.id;
            ProfileService.findPeople(opts,function(data){
                if(data.code == 101 && data.message == "SUCCESS"){
                    $scope.showPeopleLoader = false;
                    $scope.ratedUsers = data.data.users_rated;
                    if(data.data.users_rated.length == 0){
                        $scope.message = $scope.i18n.dashboard.no_vote;
                    }
                }else{
                    $scope.showPeopleLoader = false;
                }
            });
            modalInstance.result.then(function (selectedItem) {
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
            $scope.viewFriendProile = function(friendId){
                modalInstance.dismiss('cancel');
                $location.path('/viewfriend/'+friendId);
            };
        };

            $scope.ratePost = function(rating, post_id, index){
            var update = "";
            var opts = {};
            opts.user_id = APP.currentUser.id;
            opts.type = "club_post";
            opts.type_id = post_id;
            opts.rate = rating;
            $scope.waitRateResponse = true;
            if($scope.posts[index].is_rated){
                update = "update";
            }else{
                update = "add";
            }
            waitRequest = ProfileService.rateThis(opts, update, function(data){
                if(data.code === 101 && data.message === "SUCCESS"){
                    $scope.posts[index].avg_rate = data.data.avg_rate;
                    $scope.posts[index].no_of_votes = data.data.no_of_votes;
                    $scope.posts[index].is_rated = true;
                }else if(data.code === 100 && data.message === "ERROR_OCCURED"){
                    //$scope.userPostList[index].avg_rate = 0;
                    //$scope.userPostList[index].no_of_votes = 0;
                    $scope.posts[index].is_rated = false;
                    $scope.posts[index].current_user_rate = 0;
                }
                $scope.waitRateResponse = false;
            });
        };
             $scope.removeRating = function(post_id, postIndx){
            var opts = {};
            opts.user_id = APP.currentUser.id;
            opts.type = "club_post";
            opts.type_id = post_id;
            if($scope.WaitDeleteResponse === false){
                $scope.WaitDeleteResponse = true;
                $scope.waitRateResponse = true;
            }else{
                return;
            }
            ProfileService.removeRating(opts,function(data){
                if(data.code == 101 && data.message == "SUCCESS"){
                    $scope.posts[postIndx].current_user_rate = 0;
                    $scope.posts[postIndx].is_rated = false;
                    $scope.posts[postIndx].no_of_votes = data.data.no_of_votes;
                    $scope.posts[postIndx].avg_rate =  data.data.avg_rate;
                }else if(data.code === 100 && data.message === "ERROR_OCCURED"){
                    $scope.posts[postIndx].current_user_rate = 0;
                    $scope.posts[postIndx].is_rated = false;
                    //$scope.userPostList[postIndx].no_of_votes =0;
                    //$scope.userPostList[postIndx].avg_rate =  0;
                }
                $scope.WaitDeleteResponse = false;
                $scope.waitRateResponse = false;
            });
        };
         $scope.averageRating = function(rating){
            return new Array(Math.ceil(rating));
        };
        $scope.rateThis = function(value, id, index){
            $scope.ratePost(value, id, index);
        };

        $scope.blankStar = function(rating){
            if((5-Math.ceil(rating)) > 0){
                return new Array(5-Math.ceil(rating));
            }else{
                return 0;
            }
        };
         $scope.ratingStates = [
            {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
        ];
    },
        link: function (scope, element, attrs) {
            

        }
    }
}]);
app.directive('rateCommonStorePost',['$modal', '$log', '$location', 'ProfileService', function($modal, $log, $location, ProfileService){
    return {
        templateUrl: 'app/views/rating_star_post.html',
        restrict: "E",
        scope: true,
        controller : function($scope, $modal, $log, ProfileService){
            $scope.hoveringOver = function(value) {
            $scope.overStar = value;
            $scope.percent = 100 * (value / $scope.max);
            };
            $scope.avg_rate = true;
            $scope.averageVoting = 0;
            $scope.vote_count = 0;
            $scope.waitRateResponse = false;
            $scope.showPeopleLoader = false;
            $scope.max = 5;
            $scope.isReadonly = false;
            $scope.WaitDeleteResponse = false;
            $scope.stars = [];

         $scope.findPeople = function(id, count_Vote){
            if(count_Vote === 0 ){
                return false;
            }
            var opts = {};
            $scope.ratedUsers = {};
            $scope.showPeopleLoader = true;
            var modalInstance = $modal.open({
                        templateUrl: 'app/views/find_people.html',
                        controller: 'ModalController',
                        size: 'lg',
                        scope: $scope,
            });
            opts.type = "store_post";
            opts.type_id = id;
            opts.session_id = APP.currentUser.id;
            ProfileService.findPeople(opts,function(data){
                if(data.code == 101 && data.message == "SUCCESS"){
                    $scope.showPeopleLoader = false;
                    $scope.ratedUsers = data.data.users_rated;
                    if(data.data.users_rated.length == 0){
                        $scope.message = $scope.i18n.dashboard.no_vote;
                    }
                }else{
                    $scope.showPeopleLoader = false;
                }
            });
            modalInstance.result.then(function (selectedItem) {
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
            $scope.viewFriendProile = function(friendId){
                modalInstance.dismiss('cancel');
                $location.path('/viewfriend/'+friendId);
            };
        };
            $scope.ratePost = function(rating, post_id, index){
            var update = "";
            var opts = {};
            opts.user_id = APP.currentUser.id;
            opts.type = "store_post";
            opts.type_id = post_id;
            opts.rate = rating;
            $scope.waitRateResponse = true;
            if($scope.posts[index].is_rated){
                update = "update";
            }else{
                update = "add";
            }
            waitRequest = ProfileService.rateThis(opts, update, function(data){
                if(data.code === 101 && data.message === "SUCCESS"){
                    $scope.posts[index].avg_rate = data.data.avg_rate;
                    $scope.posts[index].no_of_votes = data.data.no_of_votes;
                    $scope.posts[index].is_rated = true;
                }else if(data.code === 100 && data.message === "ERROR_OCCURED"){
                    //$scope.userPostList[index].avg_rate = 0;
                    //$scope.userPostList[index].no_of_votes = 0;
                    $scope.posts[index].is_rated = false;
                    $scope.posts[index].current_user_rate = 0;
                }
                $scope.waitRateResponse = false;
            });
        };
            $scope.removeRating = function(post_id, postIndx){
            var opts = {};
            opts.user_id = APP.currentUser.id;
            opts.type = "store_post";
            opts.type_id = post_id;
            if($scope.WaitDeleteResponse === false){
                $scope.WaitDeleteResponse = true;
                $scope.waitRateResponse = true;
            }else{
                return;
            }
            ProfileService.removeRating(opts,function(data){
                if(data.code == 101 && data.message == "SUCCESS"){
                    $scope.posts[postIndx].current_user_rate = 0;
                    $scope.posts[postIndx].is_rated = false;
                    $scope.posts[postIndx].no_of_votes = data.data.no_of_votes;
                    $scope.posts[postIndx].avg_rate =  data.data.avg_rate;
                }else if(data.code === 100 && data.message === "ERROR_OCCURED"){
                    $scope.posts[postIndx].current_user_rate = 0;
                    $scope.posts[postIndx].is_rated = false;
                    //$scope.userPostList[postIndx].no_of_votes =0;
                    //$scope.userPostList[postIndx].avg_rate =  0;
                }
                $scope.WaitDeleteResponse = false;
                $scope.waitRateResponse = false;
            });
        };
       $scope.averageRating = function(rating){
            return new Array(Math.ceil(rating));
        };

        $scope.blankStar = function(rating){
            if((5-Math.ceil(rating)) > 0){
                return new Array(5-Math.ceil(rating));
            }else{
                return 0;
            }
        };
        $scope.rateThis = function(value, id, index){
            $scope.ratePost(value, id, index);
        };
        $scope.ratingStates = [
            {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
        ];
    },
        link: function (scope, element, attrs) {
            

        }
    }
}]);
