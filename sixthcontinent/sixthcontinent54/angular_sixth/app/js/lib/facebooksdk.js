// This is called with the results from from FB.getLoginStatus().
  window.fbAsyncInit = function() {
                  FB.init({
                    appId      : APP.fbId,
                    cookie     : true,  // enable cookies to allow the server to access 
                                        // the session
                    xfbml      : true,  // parse social plugins on this page
                    version    : 'v2.1' // use version 2.1
                  });

                  };
                  
  function statusChangeCallback(response) {
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      fbAPI();
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    } else {
  angular.element(document.getElementById('UserController')).scope().facebookReg();

    }
  }

  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      if(response.status === 'connected') {
        fbAPI();
      } else {
        FB.login(function(response) {
          statusChangeCallback(response);
        },{ scope : 'publish_actions, email, user_friends' });
      }
    })
  }

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  function fbAPI() {

    FB.api('/me', function(response) {

      var fbId = response.id;
      var fname = response.first_name;
      var lname = response.last_name;
      if(typeof response.email === 'undefined' ) {
       var email = ''; 
      } else {
        var email = response.email; 
      }

      var gender;
      if(response.gender == "female") {
        var gender = "f";
        //document.getElementById('genreg').value="f";
      } else {
        var gender = "m";
        //document.getElementById('genreg').value="m";
      }
      FB.getLoginStatus(function(response) {
        var accessToken = response.authResponse.accessToken;
        angular.element(document.getElementById('UserController')).scope().facebookLoginChk(fbId,email,fname,lname,accessToken);
      })
  
    });
  }
  
  function nonuserAccessToken (callback){
    var accessToken,fbId = "";
    FB.getLoginStatus(function(response) {
      if(response.status === 'connected') {
        accessToken = response.authResponse.accessToken;
        fbId = response.authResponse.userID;
        callback(accessToken,fbId)
      } else {
        FB.login(function(response) {
          if(response.authResponse){
            accessToken = response.authResponse.accessToken;
            fbId = response.authResponse.userID;
            callback(accessToken,fbId)
          }else{
            callback(null);
          }
        },{ scope : 'publish_actions', auth_type: 'rerequest' });
      }
    })
 }

 function checkLoginForInvite(callback){
    FB.getLoginStatus(function(response) {
      if(response.status === 'connected') {
        invite(callback)
      } else {
        FB.login(function(response) {
          invite(callback)
        },{ scope : 'publish_actions, email, user_friends' });
      }
    })
 }

 function invite(callback){
  //   FB.ui({
  //     method: 'apprequests',
  //     message: 'Checkout www.sixthcontinent.com'
  //   }, 
  //   function(data){

  //   }
  // );

    FB.api('/me/friends?fields=name,link',function(response){
      if(response.data && response.data.length > 0){
          callback(response)
      }else{
        callback(null);
      }
    })
 }


  function getImageOfFriends(callback){
    FB.api('/me/taggable_friends',function(response){
      if(response.data && response.data.length > 0){
          callback(response)
      }else{
        callback(null);
      }
    })
  }

  function check_and_delete_fb_permissions(callback){
    FB.api('/me/permissions', function(response){
      if(response.data){
        for(var i=0; i<response.data.length; i++){
          if(response.data[i].permission === 'publish_actions' && response.data[i].status === 'granted'){
            callback('got_permission');
            return;
          }
        }
        FB.api('/me/permissions', 'delete', function(response){
          callback('not_granted');
        })
        FB.logout(function () {  });   
      }
    })
  }
  function Logout() {
    if(FB.getAccessToken() != null){
      FB.logout(function () {  }); 
    }
}
  