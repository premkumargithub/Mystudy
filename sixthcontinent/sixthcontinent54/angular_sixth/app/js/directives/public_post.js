/**
* List the pulic post for unauth user 
*/
app.directive('publicPostList', function() {
	return {
		restrict: 'E',
		templateUrl: './app/views/public_post_list.html'
	}
});

app.directive('publicShopPostList', function() {
	return {
		restrict: 'E',
		templateUrl: './app/views/public_shop_post_list.html'
	}
});