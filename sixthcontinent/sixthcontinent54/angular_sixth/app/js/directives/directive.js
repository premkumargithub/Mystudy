var linkDirectives = angular.module('linkDirectives', []);

//header directive
linkDirectives.directive('header', function() {
    return {
        templateUrl: 'app/views/header.html',
        restrict: 'E'
    };
});

linkDirectives.directive('publicHeader', function() {
    return {
        templateUrl: 'app/views/public_header.html',
        restrict: 'E'
    };
});

linkDirectives.directive('confirmClick', function() {
    return {
        link: function (scope, element, attrs) {
           
            // setup a confirmation action on the scope
            scope.confirmClick = function(msg) {
               msg = msg || attrs.confirmClick || scope.i18n.msg_directive.delete_item;
                // return true/false to continue/stop the ng-click
                return confirm(msg);
            }
        }
    }
});

linkDirectives.directive('elastic', [
    '$timeout',
    function($timeout) {
      return {
        restrict: 'A',
        link: function($scope, element) {
          var resize = function() {
            return element[0].style.height = "" + element[0].scrollHeight + "px";
          };
          element.on("blur keyup change", resize);
          $timeout(resize, 0);
        }
      };
    }
  ]);

linkDirectives.directive('headerLogout', function() {
    return {
        //controller: 'LoginController',
        controller : 'UserController',
        templateUrl: 'app/views/headerLogout.html',
        restrict: 'E'
    };
});

linkDirectives.directive('footerLogout', function() {
    return {
        templateUrl: 'app/views/logout_footer.html',
        restrict: 'E'
    };
});

linkDirectives.directive('topLink', function() {
    return {
        //controller : 'TopLinkController',
        templateUrl: 'app/views/toplinks.html',
        restrict: 'E'
    };
});

linkDirectives.directive('homeTopLink', function() {
    return {
        //controller : 'TopLinkController',
        templateUrl: 'app/views/home_toplink.html',
        restrict: 'E'
    };
});

linkDirectives.directive('publicRightPanel', function() {
    return {
        //controller : 'TopLinkController',
        templateUrl: 'app/views/public_right_panel.html',
        restrict: 'E'
    };
});

linkDirectives.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

//Displaying the group details: Directive
linkDirectives.directive('groupView', function() {
    return {
        templateUrl: 'app/views/group_detail.html',
        controller: 'GroupDetailController',
        restrict: 'E'
    };
});
 //Displaying the cover album  details: Directive
linkDirectives.directive('groupViewAlbum', function() {
    return {
        templateUrl: 'app/views/club_cover.html',
        controller: 'GroupDetailController',
        restrict: 'E'
    };
});
//Displaying the profile notfication
linkDirectives.directive('allNotificationPanel', function() {
  return {
    templateUrl: 'app/views/all_notification.html',
    controller : 'AllNotiController',
    restrict: 'E'
  }
});

//Displaying the profile notfication
linkDirectives.directive('groupNotificationPanel', function() {
  return {
    templateUrl: 'app/views/all_group_notification.html',
    controller : 'AllGroupNotiController',
    restrict: 'E'
  }
});

// Displaying the friend request in profile right panel
linkDirectives.directive('allNotificationFriendPanel', function() {
  return {
    templateUrl: 'app/views/all_notification_friend.html',
    controller : 'AllNotiFriendController',
    restrict: 'E'
  }
});

//Displaying the profile notfication
linkDirectives.directive('userCoverProfilePanel', function() {
  return {
    templateUrl: 'app/views/user_cover_profile.html',
    controller : 'UserCoverProfileController',
    restrict: 'E'
  }
});

//Displaying the profile notfication
linkDirectives.directive('groupCoverProfilePanel', function() {
  return {
    templateUrl: 'app/views/group_cover.html',
    controller : 'GroupDetailController',
    restrict: 'E'
  }
});

linkDirectives.directive('rightLink', function() {
  return {
    templateUrl: 'app/views/right_links.html',
    restrict: 'E'
  }
});

//Displaying the friend profile notfication
linkDirectives.directive('friendCoverProfilePanel', function() {
  return {
    templateUrl: 'app/views/friend_cover_page.html',
    controller : 'FriendCoverProfileController',
    restrict: 'E'
  }
});


//Displaying the profile notfication
linkDirectives.directive('friendList', function() {
  return {
    templateUrl: 'app/views/friend_list.html',
    controller : 'FriendController',
    restrict: 'E'
  }
});

linkDirectives.directive('myRefresh',function($location,$route){ 
    return function(scope, element, attrs) {
        element.bind('click',function(){
            if(element[0] && element[0].href && element[0].href === $location.absUrl()){
                window.location.reload(true);
            }
        });
    }
}); 

//Displaying the MY shop list: Directive
linkDirectives.directive('myshopList', function() {
    return {
        templateUrl: 'app/views/myshop_list.html',
        restrict: 'E'
    };
});

//Displaying the store list: Directive
linkDirectives.directive('storeList', function() {
    return {
        templateUrl: 'app/views/store_list.html',
        restrict: 'E'
    };
});
//Displaying the store list in home: Directive
linkDirectives.directive('storeListHome', function() {
    return {
        templateUrl: 'app/views/store_list_home.html',
        restrict: 'E'
    };
});

//Displaying the store grid in home: Directive
linkDirectives.directive('storeGridHome', function() {
    return {
        templateUrl: 'app/views/store_grid_home.html',
        restrict: 'E'
    };
});

//Displaying the store list: Directive
linkDirectives.directive('storeprofile', function() {
    return {
        controller:'DetailStoreCoverController',
        templateUrl: 'app/views/store_cover_profile.html',
        restrict: 'E'
    };
});
//Displaying the store cover page without login: Directive
linkDirectives.directive('storeprofilehome', function() {
    return {
        controller:'BLDetailCoverController',
        templateUrl: 'app/views/store_cover_home_profile.html',
        restrict: 'E'
    };
});

//Displaying the my shop grid: Directive
linkDirectives.directive('myshopGrid', function() {
    return {
        templateUrl: 'app/views/myshop_grid.html',
        restrict: 'E'
    };
});

//Displaying the consumer post list for store detail
linkDirectives.directive('allconsumer', function() {
  return {
      templateUrl: 'app/views/consumer_post_list.html',
      restrict: 'E'
  }
});

//Displaying the store grid: Directive
linkDirectives.directive('storeGrid', function() {
    return {
        templateUrl: 'app/views/store_grid.html',
        restrict: 'E'
    };
});

//Displaying the store List: Directive
linkDirectives.directive('pshopListHome', function() {
    return {
        templateUrl: 'app/views/public_shop_list.html',
        restrict: 'E'
    };
});

//Displaying the store Grid: Directive
linkDirectives.directive('pshopGridHome', function() {
    return {
        templateUrl: 'app/views/public_shop_grid.html',
        restrict: 'E'
    };
});

//Displaying the linked citizen List: Directive
linkDirectives.directive('lcitizenListHome', function() {
    return {
        templateUrl: 'app/views/public_linked_citizen_list.html',
        restrict: 'E'
    };
});

//Displaying the linked citizen List: Directive
linkDirectives.directive('lcitizenGridHome', function() {
    return {
        templateUrl: 'app/views/public_linked_citizen_grid.html',
        restrict: 'E'
    };
});

//Displaying the linked citizen List: Directive
linkDirectives.directive('cincomeListHome', function() {
    return {
        templateUrl: 'app/views/public_citizen_income_list.html',
        restrict: 'E'
    };
});

//Displaying the linked citizen List: Directive
linkDirectives.directive('cincomeGridHome', function() {
    return {
        templateUrl: 'app/views/public_citizen_income_grid.html',
        restrict: 'E'
    };
});

//Displaying the profile notfication
app.directive('profileRightPanel', function() {
  return {
    restrict: 'E',
     templateUrl: 'app/views/profile_right_panel.html'
  }
});

//Displaying the profile notfication
app.directive('storeLeftPanel', function() {
  return {
    restrict: 'E',
     templateUrl: 'app/views/store_left_panel.html'
  }
});

//Displaying the profile notfication
app.directive('storeNotificationPanel', function() {
  return {
    restrict: 'E',
     templateUrl: 'app/views/store_notifications.html'
  }
});

//Displaying the profile notfication
app.directive('clubNotificationPanel', function() {
  return {
    restrict: 'E',
     templateUrl: 'app/views/club_notification.html'
  }
});
//Displaying the club notification on dashboard
app.directive('clubNotificationPanelDashboard', function() {
  return {
    restrict: 'E',
     templateUrl: 'app/views/club_notification_dashboard.html'
  }
});


//Displaying the profile notfication
app.directive('clubSpecificNotificationPanel', function() {
  return {
    restrict: 'E',
     templateUrl: 'app/views/clubsnotification.html'
  }
});

//Displaying the group grid: Directive
linkDirectives.directive('groupGrid', function() {
    return {
        restrict: 'E',
        templateUrl: 'app/views/group_grid.html'
    }
});

//Displaying the group list: Directive
linkDirectives.directive('groupList', function() {
    return {
        restrict: 'E',
        templateUrl: 'app/views/group_list.html'
    }
});

//Displaying the group list of friend: Directive
linkDirectives.directive('groupListFriend', function() {
    return {
        restrict: 'E',
        templateUrl: 'app/views/group_list_friend.html'
    }
});
//Displaying the group list of friend: Directive
linkDirectives.directive('groupGridFriend', function() {
    return {
        restrict: 'E',
        templateUrl: 'app/views/group_grid_friend.html'
    }
});

//To post form on enter: Directive
linkDirectives.directive('submitEnter', function() {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.bind("keydown keypress", function(event) {
                if(event.which === 13) {
                    scope.$apply(function(){
                        scope.$eval(attrs.submitEnter);
                    });
                    event.preventDefault();
                }
            });
        }
    };
});

//To close form on escp: Directive
linkDirectives.directive('cancelEsc', function() {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.bind("keydown keypress", function(event) {
                if(event.which === 27) {
                    scope.$apply(function(){
                        scope.$eval(attrs.cancelEsc);
                    });
                    event.preventDefault();
                }
            });
        }
    };
});

//map directive
linkDirectives.directive('map', function() {
    return {
        templateUrl: 'app/views/map.html',
        restrict: 'E'
    };
});

linkDirectives.directive('autocompleteMap', function() {
    return {
        templateUrl: 'app/views/google_map.html',
        restrict: 'E'
    };
});


linkDirectives.directive('messageNotification', function() {
    return {
        restrict: 'E',
        templateUrl: 'app/views/message_notification.html',
        controller: 'MessageNotifiController',
    };
});


//Displaying the post form for store detail
app.directive('storePostForm', function() {
  return {
      restrict: 'E',
      link: function (scope, iElement, iAttrs) {
        $($('#lp1').linkPreview()).appendTo(iElement[0]);
      },
      templateUrl: 'app/views/store_post_form.html'
  }
});



//Displaying the post list for store detail
app.directive('storePostList', function() {
  return {
      restrict: 'E',
      controller: function ($scope, StorePostService, $location, $timeout, $routeParams, StoreService, StoreCommentService, FileUploader ,ProfileService,$modal ,$log){
        //funciton to delete single comment
        $scope.delCommentErrMsg = [];
        $scope.delCommentErrCls = [];
        $scope.editCommentText = [];
        $scope.activeCommentEdit = [];
        $scope.isEditComment = [];
        $scope.commentErrorMsg = [];
        $scope.commentErrorCls = [];
        $scope.commentInProcess = [];
        $scope.showComments = [];
       
        $(document).click(function(){
             $("ul.actions-drop-action").hide();
        });

        $scope.toggleEdit = function($event){
            $event.stopPropagation();
            if($($event.currentTarget).next('ul.actions-drop-action').is(':visible')){
                $($event.currentTarget).next('ul.actions-drop-action').hide();
            }else{
                $("ul.actions-drop-action").hide();
                $($event.currentTarget).next('ul.actions-drop-action').show(); 
            }
        };

        $scope.deleteComment = function(postIndx, indx) {
            var indx = indx;
            var commentData = $scope.posts[postIndx].comments[indx];
            var comments = [];
            $scope.deleteCommentIndx = commentData.id;
            var post = $scope.posts[postIndx];

            var formData = {};
            formData.user_id = $scope.currentUser.id;
            formData.comment_id = commentData.id;

            //calling the comment service to delete the selected comment 
            StoreCommentService.deleteComment(formData, function(data){
                if(data.code == 101) {
                    $scope.delCommentErrMsg[commentData.id] = '';
                    $scope.delCommentErrCls[commentData.id] = '';
                    $scope.deleteCommentIndx = -1;
                    var opts = {};
                    opts.post_id = post.post_id;
                    opts.user_id = $scope.currentUser.id;
                    $scope.posts[postIndx].comments.splice(indx,1);
                    $scope.posts[postIndx].comment_count--;
                }
                else {
                    $scope.delCommentErrMsg[commentData.id] = $scope.i18n.dashboard.postcomment.delete_comment_fail;
                    $scope.delCommentErrCls[commentData.id] = 'text-red';
                    $scope.deleteCommentIndx = -1;
                    $scope.posts;
                }
                $timeout(function(){
                    $scope.delCommentErrCls[commentData.id] = '';
                    $scope.delCommentErrMsg[commentData.id] = '';
                }, 15000);
            });
        };
        //funciton to delete single comment
        $scope.deleteMediaComment = function(comment, postIndx, mediaIndx) {
            //TODO:: media index need to be come dynamic for multiple medias
            var commentData = comment;
            var post = $scope.posts[postIndx];
            $scope.deleteCommentIndx = commentData.id;
            
            var formData = {};
            formData.user_id = $scope.currentUser.id;
            formData.comment_id = commentData.id;
            formData.comment_media_id = commentData.comment_media_info[0].id;

            //calling the comment service to delete the selected comment 
            StoreCommentService.deleteMediaComment(formData, function(data){
                if(data.code == 101) {
                    $scope.deleteCommentIndx = -1;
                    var opts = {};
                    opts.post_id = post.post_id;
                    opts.user_id = $scope.currentUser.id;
                    $scope.getComments(opts, postIndx);
                }
                else {
                    $scope.deleteCommentIndx = -1;
                    $scope.posts;
                }
            });
        };

        //funtion to open form to update comment
    $scope.updateComment = function(postIndx, indx) {
        $("#commentBoxId-"+postIndx).hide();
        $scope.commentInProcess[postIndx] = true;
        $scope.commentErrorMsg[postIndx] = '';
        $scope.commentErrorCls[postIndx]= '';
        var comment = $scope.posts[postIndx].comments[indx];
        var indx = indx;
        $scope.activeCommentEdit[postIndx]= comment.id;
        $scope.isEditComment[postIndx] = false;
        $scope.editCommentText[postIndx]=comment.comment_text;
    }

        //function to edit a comment
        $scope.editComment = function(postIndx, indx) {
            var opts = {};
            var post = $scope.posts[postIndx];
            var comment = $scope.posts[postIndx].comments[indx];
            var newText = $scope.editCommentText[postIndx];
            var indx = indx;
            $scope.isEditComment[postIndx] = true;
            $scope.commentErrorMsg[postIndx]= '';
            
            if(newText == undefined || newText == '') {
                $scope.isEditComment[postIndx]= false;
                $scope.commentErrorCls[postIndx] = 'text-red';
                $scope.commentErrorMsg[postIndx] = $scope.i18n.editprofile.no_empty_comment;
                $timeout(function(){
                    $scope.commentErrorCls[postIndx] = '';
                    $scope.commentErrorMsg[postIndx] = '';
                }, 15000);
                return false;
            } 

            opts.user_id = $scope.currentUser.id;
            opts.post_id = post.post_id;
            opts.comment_id = comment.id;
            opts.comment_author = comment.comment_user_info.id;
            opts.youtube_url = comment.youtube_url;
            opts.comment_text = newText;
            
            StoreCommentService.updateComment(opts, function(data){
                if(data.code == 101) {
                    $scope.posts[postIndx].comments[indx].comment_text = newText;
                    $scope.activeCommentEdit[postIndx] = '';
                    $scope.commentErrorCls[postIndx] = '';
                    $scope.commentErrorMsg[postIndx] = '';
                    $scope.commentInProcess[postIndx] = false;
                    $scope.editCommentText[postIndx] = '';
                    $("#commentBoxId-"+postIndx).show();
                    $scope.isEditComment[postIndx] = false;
                } else {
                    $scope.commentInProcess[postIndx] = false;
                    $scope.isEditComment[postIndx] = false;
                    $scope.commentErrorCls[postIndx] = 'text-red';
                    $scope.commentErrorMsg[postIndx]= $scope.i18n.editprofile.not_posted;
                    $("#commentBoxId-"+postIndx).show();
                }
                $timeout(function(){
                        $scope.commentErrorCls[postIndx] = '';
                        $scope.commentErrorMsg[postIndx] = '';
                    }, 15000);
            });
        };

        //funtion to close the edit form to cancel comment
        $scope.cancelEditComment = function(postIndx, indx) {
            $scope.commentInProcess = [];
            $scope.commentInProcess[postIndx] = false;
            $scope.activeCommentEdit[postIndx] = [];
            $scope.activeCommentEdit[postIndx][indx] = -1;
            $scope.editCommentText[postIndx]='';
            $scope.commentErrorCls[postIndx] = '';
            $scope.commentErrorMsg[postIndx] = '';
            $("#commentBoxId-"+postIndx).show();
        };

        $scope.allCommentLoad = [];
        $scope.showAllComments = function(postIndx) {
            $scope.allCommentLoad[postIndx] = true;
            var post = $scope.posts[postIndx];
            var opts = {};
            opts.post_id = post.post_id;
            opts.user_id = $scope.currentUser.id;
            $scope.getComments(opts, postIndx);
            $scope.showComments[postIndx] = true;
        };
        // function to get the post and comment of the post
        $scope.comments = [];
        $scope.getComments = function(opts, postIndx) {
            $scope.comments[postIndx] = [];
            
            // This service's function returns post
            StoreCommentService.listComment(opts, function(data){
                if(data.code == 100)
                {
                    $scope.posts[postIndx].comments = data.data.comment;
                    $scope.allCommentLoad[postIndx] = false;
                        if($scope.comments[postIndx].length  != 0 ) {
                            $scope.noComment = true;
                        }
                } else {
                    $scope.allCommentLoad[postIndx] = true;
                }
            });
        };


      },
      templateUrl: 'app/views/store_post_list.html'
  }
});

//Displaying the comment post form for store detail
app.directive('storeCommentForm',['StoreCommentService', 'fileReader', '$timeout', function(StoreCommentService, fileReader, $timeout) {
  return {
    restrict: 'E',
    templateUrl: 'app/views/store_comment_form.html',
    scope : false,
    link : function(scope, elem, attrs){
      scope.showPreview = false;
      scope.comment_id = '';
      scope.image_id = [];
      scope.imgSrc = [];
      scope.isInProgress = [];
      scope.commentFiles = [];
      scope.selectInProgress = [];
      scope.commentErrMsg = '';
      scope.commentErrCls = '';
      scope.imgRes = 1;
      scope.getFile = function () {
        var tempopts = {};
        tempopts.comment_author = APP.currentUser.id;
        tempopts.post_id = attrs.postId;
        tempopts.session_id = APP.currentUser.id;
        tempopts.body = scope.i18n.editprofile.comment_image_test;
        tempopts.post_type = '0';
        tempopts.comment_id = '';
        var len = scope.commentFiles.length;
        StoreCommentService.createCommentWithImage(tempopts, scope.commentFiles[0], function(data){
            if(data.code == 101) {
                scope.comment_id = data.data.comment_id;
                scope.imgSrc.push(data.data);
                scope.image_id.push(data.data.media_id);
                tempopts.comment_id = scope.comment_id;
                scope.selectInProgress.splice(0,1);
                for(j=1; j < len; j++){
                    StoreCommentService.createCommentWithImage(tempopts, scope.commentFiles[j], function(data){
                        if(data.code == 101) {
                            scope.comment_id = data.data.comment_id;
                            scope.imgSrc.push(data.data);
                            scope.image_id.push(data.data.media_id);
                            scope.selectInProgress.splice(0,1);
                        }else{
                          scope.commentErrCls = 'text-red';
                          scope.commentErrMsg = scope.i18n.dashboard.postcomment.upload_media_fail;
                        }
                    });
                }
            }else{
              scope.commentErrCls = 'text-red';
              scope.commentErrMsg = scope.i18n.dashboard.postcomment.upload_media_fail;
            }
        });
        setTimeout(function(){
            scope.commentErrCls = '';
            scope.commentErrMsg = '';
        }, 15000);
      };
      //remove iamge from preview array
      scope.removeImage = function(index) {
        scope.imgSrc.splice(index, 1);
        scope.isInProgress.splice(index, 1);
        if(scope.imgSrc.length == 0){
          scope.commentFiles == [];
          scope.file = [];
          scope.showImgSelect = true;
          scope.showPreview = false;
        }
      };

      scope.res = 0;
      scope.addComment = function(){
        scope.postIndx = attrs.postIndx;
        scope.comments = attrs.loadComment;
        scope.finalCommentInProcess = true;
        scope.commentErrMsg = "";
        scope.commentErrMsg = "";
        scope.commentErrCls = '';
        var filescount = scope.imgSrc.length;

        if ((scope.commentText === undefined || scope.commentText === '') && filescount === 0) {
            scope.finalCommentInProcess = false;
            scope.commentErrCls = 'text-red';
            scope.commentErrMsg = scope.i18n.editprofile.photo_update;
            setTimeout(function(){
              scope.commentErrCls = '';
              scope.commentErrMsg = '';
            }, 15000);
            return false;
        } 

        var opts = {};
        opts.comment_author = APP.currentUser.id;
        opts.post_id = attrs.postId;
        opts.comment_text = scope.commentText;
        opts.media_id = [];
        opts.session_id = APP.currentUser.id;
        opts.youtube_url='';
        opts.comment_id = "";
        if(scope.image_id.length != 0){
          opts.media_id = scope.image_id;
        }
        if(scope.comment_id != ''){
          opts.comment_id = scope.comment_id;  
        }
        opts.post_type = '1';

        opts.tagging = scope.taggedObject; // for taggedObject
        if(scope.res == 0){
            scope.res = 1;
            StoreCommentService.createComment(opts, function(data){
                scope.res = 0;
              if(data.code == 101) {
                scope.finalCommentInProcess = false;
                scope.commentErrMsg = '';
                scope.commentErrCls = '';
                scope.commentText = '';
                scope.post.comments.push(data.data.comment);
                scope.post.comment_count++;
                scope.commentFiles = [];
                scope.imgSrc = [];
                scope.showPreview = false;
                scope.showImgSelect = true;
                scope.comment_id = '';
              } else {
                scope.finalCommentInProcess = false;
                scope.commentErrCls = 'text-red';
                scope.commentErrMsg = scope.i18n.editprofile.comment_no_post;
                scope.commentFiles = [];
                scope.imgSrc = [];
                scope.showPreview = false;
                scope.showImgSelect = true;
                scope.comment_id = '';
              }
            });
            $timeout(function(){
                scope.commentErrCls = '';
                scope.commentErrMsg = '';
            }, 15000);
          };
        }
    }
  };
}]);

//Displaying the comment post form for store detail
app.directive('clickEdit',['$compile', function($compile) {
  return {
    restrict: 'E',
    link : function(scope, elem, attrs){
        elem.bind('click', function() {
        var newtemp;
        newtemp = angular.element('<edit-form></edit-form>');
        elem.parent().parent().find('.store-comment-profile-upload').html($compile(newtemp)(scope));
      });
    }
  }
}]);

//Displaying the comment post form for store detail
app.directive('editForm', function($compile) {
  return {
    restrict: 'E',
    templateUrl: 'app/views/store_post_editform.html'
  }
});

//Displaying the comment post form for store detail
app.directive('clickDelete',[function($compile) {
  return {
    restrict: 'A',
    scope:{
      deleteMethod:'&'
    },
    link : function(scope, elem, attrs){
        elem.bind('click', function() {
         scope.$apply(scope.deleteMethod); 
      });
    }
  }
}]);

app.directive('infiniteScrolls', [ "$window", function ($window) {
        return {
            link:function (scope, element, attrs) {
                var offset = parseInt(attrs.threshold) || 0;
                var e = element[0];
                element.bind('scroll', function () {
                  if (e.scrollTop  == 0 && e.scrollHeight != e.offsetHeight) {
                      scope.$apply(attrs.infiniteScrolls);
                  }
                });
            }
        };
}]);

app.directive("ngFileSelect",function(){
  return {
    link: function($scope,el){
     el.bind("change", function(e){
        $scope.file = (e.srcElement || e.target).files[0];
        $scope.getFile();
      })
    }
  }
});

app.directive("ngCoverSelect",function(){
  return {
    link: function($scope,el){
     el.bind("change", function(e){
        $scope.file = (e.srcElement || e.target).files[0];
        //$scope.getFile();
      })
    }
  }
});

app.directive("ngIdCardFile",function(){
  return {
    link: function($scope,el){
     el.bind("change", function(e){
        $scope.idCardFile = (e.srcElement || e.target).files[0];
        $scope.getIdCardFile();
      })
    }
  }
});

app.directive("ngSsnFileSelect",function(){
  return {
    link: function($scope,el){
     el.bind("change", function(e){
        $scope.ssnFile = (e.srcElement || e.target).files[0];
        $scope.getSsnFile();
      })
    }
  }
});

//directive for multifileselect
app.directive("ngMultiFileSelect",function(){
  return {
    link: function($scope,el){
     el.bind("change", function(e){
        $scope.file = (e.srcElement || e.target).files;
        $scope.getFile();
      })
    }
  }
});

// //directive for profile post section 
// //it is rediscribed because it the ngfileselect is override in profile view page
app.directive("ngProfileFileSelect",function(){
  return {
    link: function($scope,el){
     el.bind("change", function(e){
        $scope.files = (e.srcElement || e.target).files;
        $scope.inputEl = e.target;
        $scope.getProfileFile();
      })
    }
  }
});

//directive for multifileselect
app.directive("ngProfileCommentMultiFileSelect",function(){
  return {
    link: function($scope,el){
     el.bind("change", function(e){
        $scope.file = (e.srcElement || e.target).files[0];
        $scope.getFile();
      })
    }
  }
});

app.directive('fileSelect',['$timeout', function($timeout) {
  var template = '<input type="file" name="files" class="search-botton" multiple />';
  return function( scope, elem, attrs ) {
    scope.showImgSelect = true;
    var selector = $( template );
    elem.append(selector);
    selector.bind('click', function( event ) {
      scope.fileUpload = [];
      scope.showPreview = false;
      scope.comment_id = '';
      scope.image_id = [];
      scope.imgSrc = [];
      scope.isInProgress = [];
      scope.selectInProgress = [];
      scope.commentFiles = []
      scope.commentErrMsg = '';
      this.value = null;
    });
    selector.bind('change', function( event ) {
      scope.$apply(function() {
        scope[ attrs.fileSelect ] = event.originalEvent.target.files;
        var imgFileCount = scope[ attrs.fileSelect ].length;
        var reject = 0;
        var correct = 0;
        if(imgFileCount >= 1) {
          for(var i = 0; i < imgFileCount; i++) {
            var imageType = scope[ attrs.fileSelect ][i]['name'].substring(scope[ attrs.fileSelect ][i]['name'].lastIndexOf(".") + 1).toLowerCase();
            if (!(imageType == "gif" || imageType == "png" || imageType == "jpg" || imageType == "jpeg")) {
              scope.commentErrCls = 'text-red';
              scope.commentErrMsg = scope.i18n.editprofile.media_incorrect;
              reject++;
            }else {
                correct++;
                scope.first = true;
                scope.imgRes = 1;
                scope.showPreview = true;
                scope.isInProgress.push(true);
                scope.selectInProgress.push(true);
                scope.commentFiles.push(scope[ attrs.fileSelect ][i]);
            }
            if((reject + correct) == imgFileCount && correct != 0){
                  scope.getFile(scope.commentFiles);
            }
          }
        }
      });
      setTimeout(function(){
        scope.commentErrCls = '';
        scope.commentErrMsg = '';
      }, 15000);
    });
  };
}]);

//focus directive
app.directive('focusMe', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            scope.$watch(attr.focusMe, function (n, o) {
                if (n != 0 && n) {
                    element[0].focus();
                }
            });
        }
    };
});

/*app.directive('eventFocus', function(focus) {
    return function(scope, elem, attr) {
      elem.on(attr.eventFocus, function() {
        focus(attr.eventFocusId);
      });
      scope.$on('$destroy', function() {
        element.off(attr.eventFocus);
      });
    };
  });*/

app.directive('eventFocus', function(focus) {
    return function(scope, elem, attr) {
      elem.on(attr.eventFocus, function() {
        console.log(attr.eventFocus);alert('a');
        //focus(attr.eventFocusId);
      });
      scope.$on('$destroy', function() {
        element.off(attr.eventFocus);
      });
    };
  });

// directive for post form in shop on home page
app.directive('storePostHomeList', function() {
  return {
      restrict: 'E',
      templateUrl: 'app/views/store_post_home.html'
  }
});

app.directive('infiniteScrollsDown', [ "$window", function ($window) {
        return {
            link:function (scope, element, attrs) {
                var offset = parseInt(attrs.cardshold) || 0;
                var e = element[0];
                element.bind('scroll', function () {
                  if(e.scrollTop + e.offsetHeight >= e.scrollHeight) {
                    scope.$apply(attrs.infiniteScrollsDown);
                  }
                });
            }
        };
}]);

//directive for search shop in map using store name
app.directive('ngsearchtext', function () {
    return function (scope, element, attrs) {
        element.bind("keyup", function (event) {
            if (event.which !== 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngsearchtext);
                });

                event.preventDefault();
            }
        });
    };
});

/*directive to confirm from the user before the payment done*/
app.directive('confirmPayment', function() {
    return {
        link: function (scope, element, attrs) {
           
            // setup a confirmation action on the scope
            scope.confirmPayment = function(msg) {
               msg = msg || attrs.confirmPayment || scope.i18n.msg_directive.confirm_payment;
                // return true/false to continue/stop the ng-click
                return confirm(msg);
            }
        }
    }
});

/*directive to confirm from the user before the payment done*/
app.directive('styleParent', function ($document, $window) {
    return function (scope, element, attr) {
        var container = $document.find('div.post-img');
        var w = angular.element($window);
        // Get accurate measurements from that.
        var imgWidth = '';
        var imgHeight = '';
        var newValue = {};
        element.on('load', function() {
                $(this).parent().removeClass('imgHHWL');
                $(this).parent().removeClass('imgHHWH');
                $(this).parent().removeClass('imgHLWH');
                $(this).parent().removeClass('imgHLWL');
                var theImage = new Image();
                theImage.src = $(this).attr("src");
                // Get accurate measurements from that.
                imgWidth = theImage.width;
                imgHeight = theImage.height;
                newValue.h = $('div.post-img').height(); 
                newValue.w = $('div.post-img').width();
                var cls = '';
                if(imgWidth > newValue.w && imgHeight > newValue.h) {
                    cls = 'imgHHWH';
                } else if(imgWidth <= newValue.w && imgHeight >= newValue.h){
                    cls = 'imgHHWL';
                } else if(imgWidth >= newValue.w && imgHeight <= newValue.h){
                    cls = 'imgHLWH';
                } else if(imgWidth <= newValue.w && imgHeight <= newValue.h){
                    cls = 'imgHLWL';
                }
                $(this).parent().addClass(cls);
         });

        scope.$watch(function () {
            return {
                'h': container.height(), 
                'w': container.width()
            };
        }, function (newValue, oldValue) {
            if(newValue.w != oldValue.w){
                var cls = '';
                if(imgWidth > newValue.w && imgHeight > newValue.h) {
                    cls = 'imgHHWH';
                } else if(imgWidth <= newValue.w && imgHeight >= newValue.h){
                    cls = 'imgHHWL';
                } else if(imgWidth >= newValue.w && imgHeight <= newValue.h){
                    cls = 'imgHLWH';
                } else if(imgWidth <= newValue.w && imgHeight <= newValue.h){
                    cls = 'imgHLWL';
                }
                $(this).parent().addClass(cls);
            }
        }, true);

        w.bind('resize', function () {
            scope.$apply();
        });
    }
}); 

linkDirectives.directive('confirmClickMember', function() {
    return {
        link: function (scope, element, attrs) {
           
            // setup a confirmation action on the scope
            scope.confirmClick = function(msg) {
               msg = msg || attrs.confirmClick || scope.i18n.msg_directive.delete_member;
                // return true/false to continue/stop the ng-click
                return confirm(msg);
            }
        }
    }
});

linkDirectives.directive('confirmClickUnsubscribe', function() {
    return {
        link: function (scope, element, attrs) {
           
            // setup a confirmation action on the scope
            scope.confirmClick = function(msg) {
               msg = msg || attrs.confirmClick || scope.i18n.coupon.confirm_unsub;
                // return true/false to continue/stop the ng-click
                return confirm(msg);
            }
        }
    }
});

linkDirectives.directive('datePicker', function() {
    return {
        controller : 'DateController',
        templateUrl: 'app/views/date_picker.html',
        restrict: 'E'
    };
});

linkDirectives.directive('createCoupon', function() {
    return {
        controller : 'CouponController',
        templateUrl: 'app/views/create_coupon.html',
        restrict: 'E'
    };
});

app.directive('shopTransactionCustomer', function() {
    return {
        templateUrl: 'app/views/shop_transaction_customer.html',
        restrict: 'E'
    };
}); 

app.directive('shopTransactionProgress', function() {
    return {
        templateUrl: 'app/views/shop_transaction_progress.html',
        restrict: 'E'
    };
});

linkDirectives.directive('createAward', function() {
    return {
        controller : 'AwardsController',
        templateUrl: 'app/views/create_awards.html',
        restrict: 'E'
    };
});

app.directive('shopTransactionAmount', function() {
    return {
        templateUrl: 'app/views/shop_transaction_amount.html',
        restrict: 'E'
    };
});

linkDirectives.directive('campaignWork', function() {
    return {
        controller : 'WorkCampaignController',
        templateUrl: 'app/views/campaign_work.html',
        restrict: 'E'
    };
});

app.directive('shopTransactionConfirm', function() {
    return {
        templateUrl: 'app/views/shop_transaction_confirm.html',
        restrict: 'E'
    };
});

linkDirectives.directive('createCampaign', function() {
    return {
        controller : 'CreateCampaignController',
        templateUrl: 'app/views/create_campaign.html',
        restrict: 'E'
    };
});

linkDirectives.directive('offerList', function() {
    return {
        templateUrl: 'app/views/offer-list.html',
        restrict: 'E'
    };
});

linkDirectives.directive('offerGrid', function() {
    return {
        templateUrl: 'app/views/offer-grid.html',
        restrict: 'E'
    };
});

linkDirectives.directive('offerTop', function() {
    return {
        templateUrl: 'app/views/offer_top.html',
        restrict: 'E'
    };
});

app.directive('shopTransactionCancel', function() {
    return {
        templateUrl: 'app/views/shop_transaction_cancel.html',
        restrict: 'E'
    };
});
//directive to show transaction detail of approve or Rejected transactio
app.directive('shopTransactionDetail', function() {
    return {
        templateUrl: 'app/views/shop_transaction_detail.html',
        restrict: 'E'
    };
});

app.directive('shopTransactionHistoryList', function() {
    return {
        templateUrl: 'app/views/shop_transaction_history_list.html',
        restrict: 'E'
    };
});
app.directive('shopTransactionHistoryDetail', function() {
    return {
        templateUrl: 'app/views/shop_transaction_history_detail.html',
        restrict: 'E'
    };
}); 
// infinit scrolling from div not on body
app.directive('whenScrolled', function() {
    return function(scope, elm, attr) {
        var raw = elm[0];
        elm.bind('scroll', function() {
            if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                scope.$apply(attr.whenScrolled);
            }
        });
    };
});

linkDirectives.directive('confirmClickRemove', function() {
    return {
        link: function (scope, element, attrs) {
           
            // setup a confirmation action on the scope
            scope.confirmClick = function(msg) {
               msg = msg || attrs.confirmClick || scope.i18n.msg_directive.remove_club;
                // return true/false to continue/stop the ng-click
                return confirm(msg);
            };
        }
    };
});

linkDirectives.directive('couponsList', function() {
    return {
        templateUrl: 'app/views/coupons-list.html',
        restrict: 'E'
    };
});

linkDirectives.directive('couponsGrid', function() {
    return {
        templateUrl: 'app/views/coupons-grid.html',
        restrict: 'E'
    };
});

app.directive("dateRange", function () {
    return {
        restrict: 'AE',
        replace: false,
        link: function (scope, elem, attrs) {
            jQuery(elem).daterangepicker({
                opens: "left",
                format: 'MM/DD/YY',
                startDate: moment().subtract('days', 364),
                endDate: moment(),
                showDropdowns: true,
                ranges: {
                    'Last 7 Days': [moment().subtract('days', 6), moment()],
                    'Last 30 Days': [moment().subtract('days', 29), moment()],
                    'Last 90 Days': [moment().subtract('days', 89), moment()],
                    'Last 12 Months': [moment().subtract('days', 364), moment()]
                }
            });
            jQuery(elem).on('apply.daterangepicker', function (ev, picker) {
                jQuery(elem).find('#startDate').text(picker.startDate.format('MM/DD/YYYY'));
                jQuery(elem).find('#endDate').text(picker.endDate.format('MM/DD/YYYY'));
                scope[attrs.start] = picker.startDate;
                scope[attrs.end] = picker.endDate;
                scope.$apply();
            });
        }
    };
    });

app.directive('datePickers', function() {

  return {
    restrict: 'E',
    transclude: true,
    scope: {
      date: '='
    },
    link: function(scope, element, attrs) {
      element.datepicker({
        dateFormat: 'dd-mm-yy',
        onSelect: function(dateText, datepicker) {
          scope.date = dateText;
          scope.$apply();
        }
      });
    },
    template: '<input type="text" class="span2" ng-model="date"/>',
    replace: true
  }

});

linkDirectives.directive('paypalForm', ['CommerialService', 'StoreService', function(CommerialService, StoreService){
    return {
        templateUrl: 'app/views/paypal_form.html',
        restrict: 'E',
        controller: function ($scope, $timeout){
            // function to validate phone number in paypal form
            $scope.checkPno=function(pnumber){
                if(pnumber != undefined){
                    var regex=/[^a-z^A-Z]$/;
                    return regex.test(pnumber);
                }
            };

            // function to validate email in paypal form
            $scope.checkEmail=function(email){
               var regex=/^[A-Za-z0-9._-]+@[A-Za-z]+\.[A-Za-z.]{2,5}$/;
               return regex.test(email);
            };
            /* function to register the user paypal information
            * @accept user paypalform information
            * @return the status of apaypal account 0 for no paypal account 1 for paypal account created
            */
            $scope.submitPaypalForm  = function(paypal){
                $scope.inProgress = true;
                $scope.is_paypal_added = 0;
                var shop_id = StoreService.getStoreData().id;
                $scope.is_paypal_added = StoreService.getStoreData().is_paypal_added;
                var opts = {};
                opts.session_id = APP.currentUser.id;
                opts.shop_id = shop_id;
                opts.first_name = paypal.fname;
                opts.last_name = paypal.lname;
                opts.email_address = angular.lowercase(paypal.email);
                opts.mobile_number = paypal.pnumber;
                //opts.account_id = paypal.accountid; not in current use
                $scope.paypalErrMsg = '';
                $scope.paypalErrCls = '';
                
                //calling the service to send request to varify and save paypal account
                CommerialService.varifyPaypal(opts, function(data){
                    $scope.inProgress = false;
                    if(data.code == 101) {
                        $scope.is_paypal_added = 1;
                        $scope.paypalErrMsg = $scope.i18n.Campaign_work.paypal_varify.success;
                        $scope.paypalErrCls = 'text-success';
                        if($scope.currentSubTab !== undefined && $scope.currentSubTab === 2){
                            $scope.closeForm();    
                        } else {
                            $scope.paypal = {};
                            $scope.paypalForm.$setPristine();
                            $scope.isShowForm = false;
                            $scope.isOpenBottomForm = false;
                            $scope.isOpenTopForm = false;
                        }
                        
                        $timeout(function(){
                            $scope.paypalErrMsg = '';
                            $scope.paypalErrCls = '';
                        }, 15000);
                    } else if(data.code == 500000) {
                        $scope.paypalErrMsg = $scope.i18n.Campaign_work.paypal_varify.system_error;
                        $scope.paypalErrCls = 'text-red';
                        $timeout(function(){
                            $scope.paypalErrMsg = '';
                            $scope.paypalErrCls = '';
                        }, 15000);
                    } else if(data.code == 520002) {
                        $scope.paypalErrMsg = $scope.i18n.Campaign_work.paypal_varify.internal_error;
                        $scope.paypalErrCls = 'text-red';
                        $timeout(function(){
                            $scope.paypalErrMsg = '';
                            $scope.paypalErrCls = '';
                        }, 15000);
                    } else if(data.code == 520003) {
                        $scope.paypalErrMsg = $scope.i18n.Campaign_work.paypal_varify.username_incorrect;
                        $scope.paypalErrCls = 'text-red';
                        $timeout(function(){
                            $scope.paypalErrMsg = '';
                            $scope.paypalErrCls = '';
                        }, 15000);
                    } else if(data.code == 550001) {
                        $scope.paypalErrMsg = $scope.i18n.Campaign_work.paypal_varify.not_allowed;
                        $scope.paypalErrCls = 'text-red';
                        $timeout(function(){
                            $scope.paypalErrMsg = '';
                            $scope.paypalErrCls = '';
                        }, 15000);
                    } else if(data.code == 560027) {
                        $scope.paypalErrMsg = $scope.i18n.Campaign_work.paypal_varify.value_unsupported;
                        $scope.paypalErrCls = 'text-red';
                        $timeout(function(){
                            $scope.paypalErrMsg = '';
                            $scope.paypalErrCls = '';
                        }, 15000);
                    } else if(data.code == 560029) {
                        $scope.paypalErrMsg = $scope.i18n.Campaign_work.paypal_varify.header_missing;
                        $scope.paypalErrCls = 'text-red';
                        $timeout(function(){
                            $scope.paypalErrMsg = '';
                            $scope.paypalErrCls = '';
                        }, 15000);
                    } else if(data.code == 580001) {
                        $scope.paypalErrMsg = $scope.i18n.Campaign_work.paypal_varify.invalid_request;
                        $scope.paypalErrCls = 'text-red';
                        $timeout(function(){
                            $scope.paypalErrMsg = '';
                            $scope.paypalErrCls = '';
                        }, 15000);
                    } else if(data.code == 580022) {
                        $scope.paypalErrMsg = $scope.i18n.Campaign_work.paypal_varify.invalid_request_param;
                        $scope.paypalErrCls = 'text-red';
                        $timeout(function(){
                            $scope.paypalErrMsg = '';
                            $scope.paypalErrCls = '';
                        }, 15000);
                    } else if(data.code == 580023) {
                        $scope.paypalErrMsg = $scope.i18n.Campaign_work.paypal_varify.determine_status;
                        $scope.paypalErrCls = 'text-red';
                        $timeout(function(){
                            $scope.paypalErrMsg = '';
                            $scope.paypalErrCls = '';
                        }, 15000);
                    } else if(data.code == 580029) {
                        $scope.paypalErrMsg = $scope.i18n.Campaign_work.paypal_varify.param_missing;
                        $scope.paypalErrCls = 'text-red';
                        $timeout(function(){
                            $scope.paypalErrMsg = '';
                            $scope.paypalErrCls = '';
                        }, 15000);
                    } else if(data.code == 100) {
                        $scope.paypalErrMsg = $scope.i18n.Campaign_work.paypal_varify.missed_param;
                        $scope.paypalErrCls = 'text-red';
                        $timeout(function(){
                            $scope.paypalErrMsg = '';
                            $scope.paypalErrCls = '';
                        }, 15000);
                    } else if(data.code == 1053) {
                        $scope.paypalErrMsg = $scope.i18n.Campaign_work.paypal_varify.already_exist;
                        $scope.paypalErrCls = 'text-red';
                        $timeout(function(){
                            $scope.paypalErrMsg = '';
                            $scope.paypalErrCls = '';
                        }, 15000);
                    } else if(data.code == 1054) {
                        $scope.paypalErrMsg = $scope.i18n.Campaign_work.paypal_varify.access_voilation;
                        $scope.paypalErrCls = 'text-red';
                        $timeout(function(){
                            $scope.paypalErrMsg = '';
                            $scope.paypalErrCls = '';
                        }, 15000);
                    } else if(data.code == 1029) {
                        $scope.paypalErrMsg = $scope.i18n.Campaign_work.paypal_varify.failure;
                        $scope.paypalErrCls = 'text-red';
                        $timeout(function(){
                            $scope.paypalErrMsg = '';
                            $scope.paypalErrCls = '';
                        }, 15000);
                    } 

                });
            }
        }
    };
}]);

linkDirectives.directive('businessApp', ['StoreService', '$cookieStore', function(StoreService, $cookieStore){
    return {
        templateUrl: 'app/views/businessApp.html',
        restrict: 'E',
        controller: function ($scope, StoreService, $cookieStore){
            $scope.currentLanguage = $cookieStore.get("activeLanguage");
            $scope.businessApp     = [];
            
            $scope.myStoreList = function() {
                var opts = {};
                    opts.user_id = APP.currentUser.id;
                    opts.store_type  = 2; 
                    opts.limit_start = 0;
                    opts.limit_size  = 50;
                    opts.lang_code   = $scope.currentLanguage;
                    opts.filter_type = 1;
           
                StoreService.getStore(opts, function(data) {
                    if(data.code === 101) {
                        $scope.businessApp = data.data.stores;
                    }
                });
            };
            $scope.myStoreList();
        }       
    };
}]);
