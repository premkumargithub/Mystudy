var APP = APP || {};
APP.keys = {
	"client_id": "16_34ys6pz89hq80cg8wg4cw444gko8g0ss484cc8c08swwck800g",
	"client_secret": "4bpop1c198cg8gcgo884wkck8cw4gkgs4ssc4wg8ksk8co0sg8",
	"grant_type": "password"
}

APP.contact_import = {
	// for sixthcontinent.com "key": "DMM6D83FM6UNRMZM5ZKA",
	// for working-sixtcontinent.rhcloud.com "key": "LD2G6P8JWU2E3BM3S63J",
	"key":"ZB68BRMGAJACEHMS2AXF",
	"provider": ["gmail", "facebook", "yahoo", "windowslive", "aol", "plaxo", "outlook", "addressbook", "terra", "bol"]
}

APP.currentUser = {};
APP.accessToken = {};
APP.base_url = "http://45.33.28.108/sixthcontinent_angular/";
APP.payment = {
	siteDomain : 'http://45.33.28.108/sixthcontinent_angular/'
};

APP.logoImg = 'https://www.sixthcontinent.com/external-link-mata-logo.png';
APP.metaDes = 'SixthContinent ÃƒÂ¨ un Social Network di Consumatori che attraverso i consumi modifica lÃ¢â‚¬â„¢economia mondiale.';
APP.metaUrl = 'https://www.sixthcontinent.com/';
APP.fbId = '699535040141026';


/*.......Service List ............*/
var domain = "http://45.33.15.158/sixthcontinent_symfony_dev/php/web/"; 
APP.service = {
	"getAccessToken" : domain+ "webapi/getaccesstoken",
	"logins" : domain+ "api/logins",
	"logout" : domain+ "api/logouts",
	"registration" : domain+ "webapi/register",
	"getProfile" : domain+ "api/shows",
	"viewMultiProfile" : domain+ "api/viewmultiprofiles",
	"editProfile" : domain+ "api/editmultiprofiles",
	"deleteProfile" : domain+ "api/deleteprofiles",
	"searchUser" : domain+ "api/searchusers",
	"searchFriend" : domain+ "api/searchfriends",
	"friendProfile" : domain+ "api/viewprofiles",
	"getUserGroups" : domain+ "api/getusergroups",
	"createGroup" : domain+ "api/creategroups",
	"updateGroup" : domain+ "api/updategroups",
	"deleteGroup" : domain+ "api/deleteusergroups",
	"getGroupDetail" : domain+ "api/getgroupdetails",
	"searchGroup" : domain+ "api/searchgroups",
	"joinPrivateGroup" : domain+ "api/joinprivategroups",
	"getGroupJoinNotifications" : domain+ "api/getgroupjoinnotifications",
	"joinPublicGroup" : domain+ "api/joinpublicgroups",
	"getGroupNotifications" : domain+ "api/getgroupnotifications",
	"responseGroupJoin" : domain+ "api/responsegroupjoins",
	"assignRoleToGroup" : domain+ "api/assignroletogroups",
	"sendEmailNotification" : domain+ "api/notifications",
	"getEmailNotification" : domain+ "api/getnotifications",
	"readUnreadEmailNotifications" : domain+ "api/readunreadnotifications",
	"deleteEmailNotifications" : domain+"api/deletenotifications",
	"searchEmailNotifications" : domain+"api/searchnotifications",
	"createGroupComment" : domain+"api/createcomments",
	"listGroupComments" : domain+"api/commentlists",
	"updateGroupComment" : domain+"api/commentupdates",
	"deleteGroupComment" : domain+"api/commentdeletes",
	"createGroupPost" : domain+"api/userposts",
	"listGroupPosts" : domain+"api/listposts",
	"updateGroupPost" : domain+"api/updateposts",
	"deleteGroupPost" : domain+"api/deleteposts",
	"createMessage" : domain+ "api/sends",
	"deleteMessage" : domain+ "api/deletemessages",
	"messageListing" : domain+ "api/inboxlists",
	"readMessage" : domain+ "api/readmessages",
	"replyMessage" : domain+ "api/replymessages",
	"searchMessage" : domain+ "api/listmessages",
	"updateMessage" : domain+ "api/updatemessages",
	"sendemailMessage" : domain+ "api/sendemails",
	"forgotPassword" : domain+ "webapi/forgetpassword",
	"uploadmedia" : domain+ "api/uploads",
	"listmedia" : domain+ "api/listmedia",
	"deletemedia" : domain+ "api/deletemedia",
	"searchmedia" : domain+ "api/searchmedia",
	"resetPassword" : domain+ "webapi/reset",
	"changePassword" : domain+ "api/changepasswords",
	"searchFriends" : domain+ "api/searchfriends",
	"messageInbox" : domain+ "api/listuserthreadmessages",
	"searchUserThread" : domain+ "api/searchuserthreads",
	"listusermessages" : domain+ "api/listusermessages",
	"createAlbum" : domain+ "api/createuseralbums",
	"uploadmediaAlbum" : domain+ "api/mediauploads",
	"albumListing" : domain+ "api/listuseralbums",
	"deleteAlbum" : domain+ "api/deleteuseralbums",
	"viewAlbum" : domain+ "api/viewuseralbums",
	"getStore" : domain + "api/getuserstores",
	"getStoreWithChild" : domain + "api/getuserallstores",
	"createStore" : domain + "api/createstores",
	"createChildStore" : domain + "api/createchildstores",
	"updateStore" : domain + "api/editstores",
	"deleteStore" : domain + "api/deletestores",
	"editStore" : domain + "api/editstores",
	"storeDetail" : domain + "api/storedetails",
	"searchStore" : domain + "api/searchstores",
	"countPhoto" : domain + "api/countmediauseralbums",
	"deleteMediaAlbum" : domain + "api/deletealbummedias",
	"dashboardpost" : domain + "api/dashboardposts",
	"getPendingFriendRequest" : domain + "api/pendingfriendrequests",
	"acceptDenyFriendReq" : domain + "api/responsefriendrequests",
	"deleteMediaAlbum" : domain + "api/deletealbummedias",
	"sendFriendRequests" : domain + "api/sendfriendrequests",
	"getStoreNotification" : domain + "storenotifications",
	"getStoreNotification" : domain + "storenotifications",
	"createstorealbums" : domain + "api/createstorealbums",
	"uploadstoremediaalbums" : domain + "api/uploadstoremediaalbums",
	"storealbumlists" : domain + "api/storealbumlists",
	"deletestorealbums" : domain + "api/deletestorealbums",
	"deletealbummedias" : domain + "api/deletestorealbummedias",
	"viewstorealbums" : domain + "api/viewstorealbums",
	"getStoreNotification" : domain + "api/storenotifications",
	"listDashboardPost" : domain + "api/getdashboardfeeds",
	"responseToStoreNoti" : domain + "api/responsestorejoins",
	"getPublicGroupNotification" : domain + "api/getgroupjoinnotifications",
	"getSpecificClubNotication" : domain + "api/getgroupnotifications",
	"responseClubNotification" : domain + "api/responsegroupjoins",
	"registerMultiProfile" : domain + "webapi/registermultiprofile",
	"joinPrivateGroups" : domain + "api/joinprivategroups",
	"brokerMultiprofile" : domain + "webapi/registermultiprofile", 
	"deleteDashboardPost" : domain + "api/removedashboardposts",
	"updateDashboardPost" : domain + "api/dashboardeditposts",
	"createDashboardComment" : domain + "api/dashboardcomments",
	"deleteDashboardComment" : domain + "api/dashboarddeletecomments",
	"updateDashboardComment" : domain + "api/dashboardeditcomments",
	"uploaduserprofileimages" : domain + "api/uploaduserprofileimages",
	"viewmultiprofiles" : domain + "api/viewmultiprofiles",
	"getCountryList" : domain + "webapi/countrylist",
	"deletePostMedia" : domain + "api/removemediaposts",
	"setStoreProfileImage" : domain + "api/setstoreprofileimages",
	"uploadStoreProfileimage" : domain + "api/uploadstoreprofileimages",
	"setuserprofileimages" : domain + "api/setuserprofileimages",
	"inviteUserOnStore" : domain + "api/invitestoreusers",
	"listunreadmessages" : domain + "api/listunreadmessages",
	"markreadallmessages" : domain + "api/markreadallmessages",
	"createStorePost" : domain + "api/storeposts",
	"listStorePost" : domain + "api/liststoreposts",
	"updateStorePost" : domain + "api/updatestoreposts",
	"deleteStorePost" : domain + "api/deletestoreposts",
	"createStoreComment" : domain + "api/storecomments",
	"listStoreComment" : domain + "api/liststorecomments",
	"updateStoreComment" : domain + "api/storeeditcomments",
	"deleteStoreComment" : domain + "api/removestorecomments",
	"deleteStoreMediaComment" : domain + "api/removemediacomments",
	"deleteStoreMediasPost" : domain + "api/deletepostmedias",
	"createClubAlbum" : domain + "api/creategroupalbums",
	"deleteClubAlbum" : domain + "api/deletegroupalbums",
	"getClubAlbums" : domain + "api/groupalbumlists",
	"viewClubAlbum" : domain + "api/viewgroupalbums",
	"deleteClubAlbumMedia" : domain + "api/deletegroupalbummedias",
	"uploadMediaInClubAlbum" : domain + "api/uploadgroupmediaalbums",
	"getDashboardComments" : domain + "api/getdashboardcomments",
	"setClubProfileImage" : domain + "api/setclubprofileimages",
	"uploadClubCover" : domain + "api/uploadclubprofileimages",
	"setUserProfileCover" : domain + "api/setusercoverimages",
	"dashboardMediaDeleteComments" : domain + "api/dashboardmedaideletecomments",
	"deleteGroupPostMedia" : domain + "api/deletegrouppostmedias",
	"getFollowers" : domain + "api/getfollowers",
	"getFollowings" : domain + "api/getfollowings",
	"getFollowUser" : domain + "api/followusers",
	"getUnFollowUser" : domain + "api/unfollowusers",
	"getCheckFollows" : domain + "api/checkfollows",
	"getTopLinkedCitizen" : domain + "webapi/linkedcitizen",
	"getCitizenAffiliates" : domain + "api/citizenaffiliations",
	"getBrokerAffiliates" : domain + "api/brokeraffiliations",
	"getShopAffiliates" : domain + "api/shopaffiliations",
	"getCitizenAffiliateCount" : domain + "api/citizenaffiliationcounts",
	"getShopAffiliateCount" : domain + "api/shopaffiliationcounts",
	"getBrokerAffiliateCount" : domain + "api/brokeraffiliationcounts",
	"getTopShopPerRevenue" : domain + "webapi/topshopsperrevenue",
	"getTopCitizenPerIncome" : domain + "webapi/topcitizenperincome",
	"getClientInformation" : domain + "api/shoppingplusclientes",
	"getTotalEconomy" : domain + "webapi/economs",
	"getCreditAndIncome" : domain + "webapi/cardsolds",
	"getConnectedProfile" :domain + "api/getconnectedprofiles",
	"createOneClickPaymentUrls" : domain + "api/createoneclickpaymenturls",
	"getFriendAcceptedNotification" : domain + "api/getapprovedfriendrequests",
	"getFacebookLogin" : domain + "webapi/facebooklogin",
	"getFacebookRegister" : domain + "webapi/facebookregister",
	"getClubAcceptedNotification" : domain + "api/getgroupresponsenotifications",
	"getIfShopRequestAccepted" : domain + "api/getshopresponsenotifications",
	"getIfBrokerRequestAccepted" : domain + "api/getbrokerresponsenotifications",
	"markReadNotification" : domain + "api/markreadnotifications",
	"mapfacebookuser" : domain + "webapi/mapfacebookuser",
	"linkMobileApp" : domain + "api/appurllogins",
	"getShopAprovalRejectNoti": domain + "api/getshopapprovalnotifications",
	"getAllTypeNotification": domain + "api/getallnotifications",
	"getAllcounts" : domain + "api/getallcounts",
	"getDashboardWallFeeds" : domain + "api/getdashboardwallfeeds",
	"inviteAffiliation" : domain + "api/sendaffiliationlinks",
	"unjoinclubs" : domain + "api/unjoinclubs",
	"creditCardLists" : domain + "api/creditcardlists",
	"checkValidUser" : domain + "webapi/checkreferralid",
	"markDefaultCard" : domain + "api/makedefaultcards",
	"digitalDeleteCard" : domain + "api/deletecreditcards",
	"getmapstores" : domain + "api/getmapstoreslists",
    "getblShops": domain + "webapi/listpublicuserstores",
    "getblDetailShops": domain + "webapi/viewpublicstoredetails",
    "getblAlbumDetailShops": domain + "webapi/listpublicstorealbums",
    "getblPostDetailShops": domain + "webapi/listpublicstoreposts" ,
    "getblPicturesList": domain + "webapi/viewpublicstorealbums" ,
    "getSearchStoreDetail": domain + "webapi/searchexternalstores" ,
    "getCommentsStoreDetail": domain + "webapi/externalliststorecomments",
    "getStoreHistory": domain + "api/shoptransactionhistorys",
    "getMapPublicDetail": domain + "webapi/getmapstores",
    "getStoreWallet" : domain + "api/shopwallets",
    "getPaymentHistory" : domain + "api/shoppaymenthistorys",
    "getCitizenWallets": domain + "api/citizenwallets",
    "getOnClickRecurringPayments": domain + "api/onclickrecurringpayments",
    "searchshoponmaps": domain + "api/searchshoponmaps",
    "getAllProfiles": domain + "api/searchallprofiles",
    "getInviteGroups": domain + "api/getinviteclubs" ,
    "deleteClubMember" : domain + "api/removeclubmembers",
    "suggestionmultiprofiles": domain + "api/suggestionmultiprofiles",
    "updatemultiprofiles" : domain + "api/updatemultiprofiles",
    "saveRelative" : domain + "api/updateuserrelatives",
    "selectFriend" : domain + "api/getnonrelationaluser",
    "searchCatagory" : domain + "api/getbusinesscategorylist",
    "searchCatagoryKeyword" : domain + "api/getkeywordlist",
    "saveCategory" : domain + "api/updateusercategorykeywords",
    "getCategory" : domain + "api/getbusinesscategorylist",
    "saveUserProfession" : domain + "api/updateuserjobs",
    "saveUserEducation" : domain + "api/updateusereducations",
    "deleteusercategorykeywords" : domain + "api/deleteusercategorykeywords",
    "deleteProfession" : domain + "api/deleteuserjobs",
    "deleteEducation" : domain + "api/deleteusereducations",
    "deleteRelative" : domain + "api/deleteuserrelatives",
    "getrelationtype"  : domain + "api/getrelationtype",
    "addUserSkills" : domain + "api/userskills",
    "getUserSkills" : domain + "api/listuserskills",
    "getUserFriendGroups" : domain + "api/getfriendgroups",
    "getBusinessCategoryList" : domain + "webapi/getbusinesscategorylist",
    "updateEducationVisibility" : domain + "api/updateusereducationvisibilities",
    "updateProfessionaVisibility" : domain + "api/updateuserjobvisibilities",
    "getCitizenIncomes" : domain + "api/citizenincomes",
    "cancelinvitationlink" : domain + "api/cancelclubinvitations",
    "groupMessageSends" : domain + "api/groupmessagesends",
    "listGroupMessages" : domain + "api/listgroupmessages",
    "listGroupInbox" : domain + "api/listgroups",
    "deleteGroupMessages" : domain + "api/deletegroupmessages",
    "readGroupMessages": domain + "api/readgroupmessages",
    "listGroupUnreadMessages": domain + "api/listgroupunreadmessages",
    "removeGroupUsers": domain + "api/removegroupusers",
    "searchThreadMessages": domain + "api/searchmessages",
    "cancelinvitationlink" : domain + "api/cancelclubinvitations",
    "getCitizenIncomes" : domain + "api/citizenincomes",
    "tagAblumPhoto" : domain + "api/mediauploads",
    "removeTaggedFriends" : domain + "api/removetaggedusers",
    "getTaggedPhoto" : domain + "api/gettaggedphotos",
    "removeTaggedPhoto" : domain + "api/removealbumphototaggedusers",
    "rateThis" : domain + "api/addrates",
    "updateRating" : domain + "api/editrates",
    "removeRating" : domain + "api/deleterates",
    "getLatestAlbumList": domain + "api/storelatestalbumlists",
    "getDashboardPostDetail" : domain + "api/getdashboardfeeddetails",
    "getImgModalComment" 	: domain + "",
    "addImgModalComment" 	: domain + "",
    "DeleteImgModalComment" : domain + "",
    "ModifyImgModalComment" : domain + "",
    "findPeople" : domain + "api/getratedusers",
    "updateAlbum": domain + "api/editalbums",
    "getAllTypeNotiCount" : domain + "api/getallnotificationscounts",
    "getAllGroupNotification" : domain + "api/getallgroupnotifications",
    "getShopPostDetail" : domain + "api/getstorepostdetails",
    "getClubPostDetail" : domain + "api/getclubpostdetails",
    "changeCurrentLanguages" : domain + "api/changecurrentlanguages",
    "getTaggingFriend" : domain + "api/getallfriends",
    "markDeleteNotification" : domain + "api/markdeletenotifications",
    "searchAllProfiles": domain + "api/getallsearchrecords",
    "friendRequestStatus": domain + "api/friendrequestdetails",
    "updateFbAccessToken": domain + "api/updatefacebookaccesstokens",
    "searchTransactionObjects": domain + "api/searchtransactionobjects",
    "paymentCredits": domain + "api/paymentcredits",
    "approveCredits": domain + "api/approvecredits",
    "getTransactionByIds": domain + "api/gettransactionbyids",
	"updateFbAccesToken": domain + "api/updatefacebookaccesstokens",
    "getMediaCoordinates" : domain + "api/getmediacoordinates",
    "getClubMediaCoordinate" : domain + "api/getclubcovermediacoordinates",
    "getStoreCoverMediaCoordinates" : domain + "api/getstorecovermediacoordinates",
    "favouritestores" : domain + "api/favouritestores",
    "unfavouritestores" : domain + "api/unfavouritestores",
    "myfavouritestores" : domain + "api/myfavouritestores",
    "addKeywords": domain + "api/addbusinesskeywords",
    "listcustomersreviews": domain + "api/listcustomersreviews",
	"getShops": domain + "api/searchstoreonfilters",
    "favouritestores": domain + "api/favouritestores",
    "unfavouritestores": domain + "api/unfavouritestores",
    "singlephotomediadetails": domain + "api/singlephotomediadetails",
    "getPublicPost": domain + "webapi/getpublicpostfeeddetails",
  	"saveLogToServer": domain + "webapi/saverequest",
  	"removeShopTagg": domain + "api/removeshopposttaggings",  
  	"getApplaneData" : domain + "api/appqueries",
    "addUpdateApplaneData" : domain + "api/appupdates",
    "batchApplane" : domain + "api/batchqueries",
  	"followshops": domain + "api/followshops",
   	"unfollowshops": domain + "api/unfollowshops",
   	"userfollowingshops": domain + "api/userfollowingshops",
  	"verifyAccount": domain + "webapi/accountverification",
  	"resendverificationmail": domain + "webapi/resendverificationmail",
  	"getfriendboughtonstores": domain + "api/getfriendboughtonstores",
  	"getApplaneData" : domain + "api/appqueries",
   	"addUpdateApplaneData" : domain + "api/appupdates",
  	"getfriendboughtonstores": domain + "api/getfriendboughtonstores",
  	"getApplaneData" : domain + "api/appqueries",
   	"addUpdateApplaneData" : domain + "api/appupdates",
   	"batchApplane" : domain + "api/batchqueries",
   	"getApplaneInvoke" : domain +"api/invokes",
	"getPaypalAccounts" : domain +"api/listpaypalaccounts",
    "deletePaypalAccount" : domain +"api/deletepaypals",
    "setDefaultPaypalAccount" : domain +"api/setdefaultpaypals",
	"uploadstoreofferimages": domain + "api/uploadstoreofferimages",
	"deleteShopOfferMedias" : domain + "api/deleteshopoffermedias",
	"verifiePaypals" : domain + "api/verifiepaypals",
	"getSubscriptionpaymentUrl" : domain + "api/getsubscriptionpaymenturls",
	"unSubscribes" : domain + "api/unsubscribeshops",
	"searchstoreondimensions":domain + "api/searchstoreondimensions",
	"updateDashboardPostACLs" : domain +"api/updatedashboardpostacls",
	"returnPaymentCancel" : domain + "api/updatesubscriptiontransactions",
	"buyshoppingcard" : domain + "api/buyshoppingcards",
   	"responsebuycards" : domain + "api/responsebuycards",
   	"getTotalPendingPayments" : domain + "api/gettotalpendingpayments",
   	"getTotalPaymentListing" : domain + "api/listpendingpayments",
   	"getRecurringPaymenturls" : domain + "api/getrecurringpaymenturls",
   	"updatePendingPayments" : domain + "api/updatependingpayments",
   	"sendContract" : domain + "api/sendcontracts"
};

APP.group_pagination = {
	start : 0,
	end : 15
};

APP.affiliation = {
	start : 0,
	end : 12
};

APP.clubAlbum_pagination = {
	start : 0,
	end : 30
};

APP.user_list_pagination = {
	start : 0,
	end : 12
};

APP.store_list_pagination = {
	start : 0,
	end : 15
};

APP.message_list_pagination = {
	start : 0,
	end : 12
};

APP.friend_list_pagination = {
	start : 0,
	end : 12
};

APP.store_credit_card_pagination = {
	start : 0,
	end : 12
};

APP.store_payment_pagination = {
	start : 0,
	end : 12
};

var roleToGroupOptions = [
	{'name': 'Admin', 'id': '2'},
	{'name': 'Friend', 'id': '3'},
	];

APP.siteTitle = "SixthContinent";

APP.groupRole = [
    {roleValue: 0, roleTitle: 'Select'},
    {roleValue: 7, roleTitle: 'Admin'},
    {roleValue: 1, roleTitle: 'Friend'}
    ];

APP.groupTypes = [
    {groupTypeID: 0, groupTypeTitle: 'Select'},
    {groupTypeID: 1, groupTypeTitle: 'Public'},
    {groupTypeID: 2, groupTypeTitle: 'Private'}
    ];

APP.dashbord_pagination = {
	start : 0,
	end : 8
};

APP.dashbord_comment = {
	start : 0,
	end : 100
};

APP.relationshipstatus =  [
							{id : 'SI' , status : 'Single'},
							{id : 'IR' , status : 'In a relationship'},
							{id : 'EN' , status : 'Engaged'},
							{id : 'MR' , status : 'Married'},							
							{id : 'IO' , status : 'In an open relationship'},
							{id : 'IC' , status : 'It\'s complicated'},
							{id : 'SP' , status : 'Separated'},
							{id : 'DI' , status : 'Divorced'},
							{id : 'WI' , status : 'Widowed'}
						];

APP.degree = [{ id : "BT", degree : "B. Tech"},
			  { id : "MT", degree : "M. Tech"},
			  { id : "BC", degree : "BCA"},
			  { id : "MC", degree : "MCA"}
			  ];

APP.countries = [
					{id :'IT' , country:"Italy"},
					{id :'US' , country:"United States of America"}
				];

APP.profileType = {
	citizenProfile : 1,
	brokerProfile : 2,
	basicProfile : 4
};


APP.postPrivacy = [
    {roleValue: 1, roleTitle: 'Public'},
    {roleValue: 2, roleTitle: 'Only Friends'},
    {roleValue: 3, roleTitle: 'Private'}
    ];

APP.postFriendPrivacy = [
    {roleValue: 1, roleTitle: 'Public'},
    {roleValue: 2, roleTitle: 'Only Friends'}
    ];

APP.incomeTax = {
	total : 90,
	tax : 11.5
};

APP.card = {
	reg_type : 'REG_FEE',
	add_type : 'ADD_CARD',
	pending_type : 'PENDING_PAYMENT'
};

APP.shopWallet = {
	shots_needed : '1',
	purchase_card_needed : '1',
	momosy_card_needed : '1',
	discount_position_needed : '1',
	purchase_card_limit_start : '0',
	purchase_card_limit_size : '10',
	shots_card_limit_start : '0',
	shots_card_limit_size : '10',
	momosy_card_limit_start : '0',
	momosy_card_limit_size : '10'
};

APP.citizenWallet = {
	shots_needed : '1',
	purchase_card_needed : '1',
	momosy_card_needed : '1',
	total_credit_available_needed : '1',
	total_citizen_income_needed : '1',
	discount_position_needed : '1',
	purchase_card_limit_start : '0',
	purchase_card_limit_size : '10',
	shots_card_limit_start : '0',
	shots_card_limit_size : '10',
	momosy_card_limit_start : '0',
	momosy_card_limit_size : '10',
	limit_start : '0',
	limit_size : '10'
};

APP.languageOptions = [
	{key: "en", value:"English", flag: "app/assets/images/english.png"},
	{key: "it", value:"Italian", flag: "app/assets/images/italy.png"},
];

APP.defaultLanguage = "en";

APP.currency = {
	dollor : {
		value : '1.22'
	}
};

APP.legalForms = [
{"id":"1","value":"Altra forma di ente privato senza personalitÃ   giuridica"},
{"id":"2","value":"Altro"},
{"id":"3","value":"Altra forma di ente privato con personalitÃ   giuridica"},
{"id":"4","value":"Associazione non riconosciuta"},
{"id":"5","value":"Associazione o raggruppamento temporaneo di imprese"},
{"id":"6","value":"Associazione riconosciuta"},
{"id":"7","value":"Azienda speciale ai sensi del t.u. 267/2000"},
{"id":"8","value":"Azienda pubblica di servizi alle persone ai sensi del d.lgs n. 207/2001"},
{"id":"9","value":"Comitato"},
{"id":"10","value":"Condominio"},
{"id":"11","value":"Consorzio di diritto privato"},
{"id":"12","value":"Ente ecclesiastico"},
{"id":"13","value":"Ente pubblico economico"},
{"id":"14","value":"Fondazione (esclusa fondazione bancaria)"},
{"id":"15","value":"Fondazione bancaria"},
{"id":"16","value":"Gruppo europeo di interesse economico"},
{"id":"17","value":"Imprenditore Individuale Agricolo"},
{"id":"18","value":"Imprenditore Individuale NON Agricolo"},
{"id":"19","value":"Libero Professionista"},
{"id":"20","value":"Lavoratore Autonomo"},
{"id":"21","value":"SocietÃ   Semplice"},
{"id":"22","value":"SocietÃ   in Nome Collettivo"},
{"id":"23","value":"SocietÃ   in Accomandata Semplice"},
{"id":"24","value":"Studio associato e societÃ   di professionisti"},
{"id":"25","value":"SocietÃ   di fatto o irregolare, comunione ereditaria"},
{"id":"26","value":"SocietÃ   per azioni"},
{"id":"27","value":"SocietÃ   a responsabilitÃ   limitata"},
{"id":"28","value":"SocietÃ   a responsabilitÃ   limitata con un unico socio"},
{"id":"30","value":"SocietÃ   in accomandita per azioni"},
{"id":"31","value":"SocietÃ   cooperativa a mutualitÃ   prevalente"},
{"id":"32","value":"SocietÃ   cooperativa diversa"},
{"id":"33","value":"SocietÃ   cooperativa sociale"},
{"id":"34","value":"SocietÃ   di mutua assicurazione"},
{"id":"35","value":"SocietÃ   consortile"},
{"id":"36","value":"SocietÃ   di mutuo soccorso"}
]
APP.store_latest_images = {
	start : 0,
	end : 9
};

APP.post_charecter_limit = "1000";
APP.store_transaction = {
       start : 0,
       end : 4 // get total 5 record in mongo
};

//Email patern regression 
APP.emailPattern = /^[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;

APP.sale_history = {
     start : 0,
     end : 10 // get total 5 record in mongo
};