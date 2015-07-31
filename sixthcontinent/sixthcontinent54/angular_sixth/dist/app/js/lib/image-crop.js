angular.module('ImageCropper',[])
  .directive('imageCrop',['$rootScope', '$cookieStore', function($rootScope, $cookieStore) {

    return {
      templateUrl: 'app/views/cover_image_crop.html',
      replace: true,
      restrict: 'AE',
      scope: {
        width: '@',
        height: '@',
        shape: '@',
        state: '@',
        result: '=',
        step: '=',
        coverLoadHide: '=',
        imageXPosition: '=',
        imageYPosition: '=',
        file: '=',
        newImage: '=',
        setImageCordinate: '&'
      },
      link: function (scope, element, attributes) {

        scope.rand = Math.round(Math.random() * 99999);
        scope.step = scope.step || 1;
        scope.shape = scope.shape || 'square';
        scope.width = parseInt(scope.width, 10) || 300;
        scope.height = parseInt(scope.height, 10) || 300;

        scope.canvasWidth = scope.width + 100;
        scope.canvasHeight = scope.height + 100;

        var $elm = element[0];

        var $input = $elm.getElementsByClassName('image-crop-input')[0];
        var $canvas = $elm.getElementsByClassName('cropping-canvas')[0];
        var $handle = $elm.getElementsByClassName('zoom-handle')[0];
        var $finalImg = $elm.getElementsByClassName('image-crop-final')[0];
        var $img = new Image();
        var fileReader = new FileReader();

        var maxLeft = 0, minLeft = 0, maxTop = 0, minTop = 0, imgLoaded = false, imgWidth = 0, imgHeight = 0;
        var currentX = 0, currentY = 0, dragging = false, startX = 0, startY = 0, zooming = false;
        var newWidth = imgWidth, newHeight = imgHeight;
        var targetX = 0, targetY = 0;
        var zoom = 1;
        var maxZoomGestureLength = 0;
        var maxZoomedInLevel = 0, maxZoomedOutLevel = 2;
        var minXPos = 0, maxXPos = 0, minYPos = 0, maxYPos = 0; // for dragging bounds

        var zoomWeight = .4;
        var ctx = $canvas.getContext('2d');
        var exif = null;
        var files = [];

        // ---------- INLINE STYLES ----------- //
        scope.moduleStyles = {};

        scope.sectionStyles = {
          width: '0px',
          height: '0px'
        };

        scope.croppingGuideStyles = {};
        scope.firestload = false;
        // ---------- EVENT HANDLERS ---------- //
        scope.$watch('coverLoadHide',function(newval, oldval){
          if(newval == true){
            $img.src = scope.file;
            scope.step = 2;
            scope.firestload = true;
            if(scope.newImage == true){
              ctx.clearRect ( 0 , 0 ,  $canvas.width, $canvas.height);
              scope.imageXPosition = 0;
              scope.imageYPosition = 0;
            }
            scope.activeLanguage = $cookieStore.get("activeLanguage");
            if(scope.activeLanguage === 'it'){
              scope.cancel = "Annulla";
              scope.update = "Salva";
              scope.drag = "Trascina la foto per riposizionarla";
            }else{
              scope.cancel = "cancel";
              scope.update = "Update";
              scope.drag = "Drag to Reposition Cover";
            }
            scope.moduleStyles = {
              width: "100%",
              height: "100%"
            };
          }else{
            scope.clearObject();
          }
        });

        scope.clearObject = function(){
          files = [];
          zoom = 1;
          ctx.clearRect(0, 0, $canvas.width, $canvas.height);
          $img.src = '';
          scope.step = 1;
          scope.coverLoadHide = false;
          if(scope.state == 'club'){
            $rootScope.club.x_cord = 0;
            $rootScope.club.y_cord = 0;
          }
          if(scope.state == 'store'){
            $rootScope.shop.x_cord = 0;
            $rootScope.shop.y_cord = 0;
          }
        };
        scope.reset = function() {
          files = [];
          zoom = 1;
          ctx.clearRect(0, 0, $canvas.width, $canvas.height);
          $img.src = '';
          scope.step = 1;
          scope.coverLoadHide = false;
          if(scope.state == 'profile'){
            //$rootScope.currentUser.basicProfile.profile_cover_img.x_cord = scope.imageXPosition * -1;
            //$rootScope.currentUser.basicProfile.profile_cover_img.y_cord = scope.imageYPosition * -1;
          }
          if(scope.state == 'club'){
            $rootScope.club.x_cord = 0;
            $rootScope.club.y_cord = 0;
          }
          if(scope.state == 'store'){
            $rootScope.shop.x_cord = 0;
            $rootScope.shop.y_cord = 0;
          }
        };

        $img.onload = function() {
        if((scope.imageXPosition === '' || scope.imageXPosition === null) && (scope.imageYPosition === '' || scope.imageYPosition === null)){
            ctx.drawImage($img, 0, 0);
          }else{
            ctx.drawImage($img, scope.imageXPosition, scope.imageYPosition);
          }

          

          imgWidth = $img.width;
          imgHeight = $img.height;
          if (exif && exif.Orientation) {

            // change mobile orientation, if required
            switch(exif.Orientation){
              case 1:
                  // nothing
                  break;
              case 2:
                  // horizontal flip
                  ctx.translate(imgWidth, 0);
                  ctx.scale(0, 0);
                  break;
              case 3:
                  // 180 rotate left
                  ctx.translate(imgWidth, imgHeight);
                  ctx.rotate(Math.PI);
                  break;
              case 4:
                  // vertical flip
                  ctx.translate(0, imgHeight);
                  ctx.scale(0, 0);
                  break;
              case 5:
                  // vertical flip + 90 rotate right
                  ctx.rotate(0.5 * Math.PI);
                  ctx.scale(0, 0);
                  break;
              case 6:
                  // 90 rotate right
                  ctx.rotate(0.5 * Math.PI);
                  ctx.translate(0, -imgHeight);
                  break;
              case 7:
                  // horizontal flip + 90 rotate right
                  ctx.rotate(0.5 * Math.PI);
                  ctx.translate(imgWidth, -imgHeight);
                  ctx.scale(0, 0);
                  break;
              case 8:
                  // 90 rotate left
                  ctx.rotate(-0.5 * Math.PI);
                  ctx.translate(-imgWidth, 0);
                  break;
              default:
                  break;
            }
          }

          minLeft = 0;
          minTop = 0;
          newWidth = imgWidth;
          newHeight = imgHeight;
          maxZoomedInLevel = ($canvas.width - 100) / imgWidth;
          maxZoomGestureLength = to2Dp(Math.sqrt(Math.pow($canvas.width, 2) + Math.pow($canvas.height, 2)));
          updateDragBounds();

        };

        // ---------- PRIVATE FUNCTIONS ---------- //
      
        function moveImage(x, y) {
          if ((x < minXPos) || (x > maxXPos)) {
            x = targetX;
          }
          if ((y < minYPos) || (y > maxYPos)) {
            y = targetY;
          }
          targetX = x;
          targetY = y;
          ctx.clearRect(0, 0, $canvas.width, $canvas.height);
          ctx.drawImage($img, x, y, newWidth, newHeight);
        }

        function to2Dp(val) {
          return Math.round(val * 1000) / 1000;
        }

        function updateDragBounds() {
          minXPos = $canvas.width - ($img.width * zoom);
          minYPos = $canvas.height - ($img.height * zoom);

        }

        // ---------- SCOPE FUNCTIONS ---------- //

        $finalImg.onload = function() {
          var tempCanvas = document.createElement('canvas');
          tempCanvas.width = this.width - 100;
          tempCanvas.height = this.height - 100;
          tempCanvas.style.display = 'none';

          var tempCanvasContext = tempCanvas.getContext('2d');
          tempCanvasContext.drawImage($finalImg, -50, -50);

          $elm.getElementsByClassName('image-crop-section-final')[0].appendChild(tempCanvas);
          scope.result = tempCanvas.toDataURL();
          scope.$apply();

          reset();

        };
       
        scope.crop = function() {
          if(scope.state == 'profile'){
            $rootScope.currentUser.basicProfile.profile_cover_img.x_cord = currentX;
            $rootScope.currentUser.basicProfile.profile_cover_img.y_cord = currentY;
          }
          if(scope.state == 'club'){
            $rootScope.club.x_cord = currentX;
            $rootScope.club.y_cord = currentY;
          }
          if(scope.state == 'store'){
            $rootScope.shop.x_cord = currentX;
            $rootScope.shop.y_cord = currentY;
          }
          scope.imageXPosition = currentX;
          scope.imageYPosition = currentY;
          scope.setImageCordinate();
          scope.step = 3;
          scope.moduleStyles = {
            width: "0px",
            height: "0px"
          };
        };

        scope.onCanvasMouseUp = function(e) {
          if (!dragging) {
            return;
          }
          e.preventDefault();
          e.stopPropagation(); // if event was on canvas, stop it propagating up

          startX = 0;
          startY = 0;
          dragging = false;
          currentX = targetX;
          currentY = targetY;
          scope.imageXPosition = currentX;
          scope.imageYPosition = currentY;

          removeBodyEventListener('mouseup', scope.onCanvasMouseUp);
          removeBodyEventListener('touchend', scope.onCanvasMouseUp);
          removeBodyEventListener('mousemove', scope.onCanvasMouseMove);
          removeBodyEventListener('touchmove', scope.onCanvasMouseMove);
        };

        $canvas.addEventListener('touchend', scope.onCanvasMouseUp, false);

        scope.onCanvasMouseDown = function(e) {
          startX = e.type === 'touchstart' ? e.changedTouches[0].clientX : e.clientX;
          startY = e.type === 'touchstart' ? e.changedTouches[0].clientY : e.clientY;
          zooming = false;
          dragging = true;
          addBodyEventListener('mouseup', scope.onCanvasMouseUp);
          addBodyEventListener('mousemove', scope.onCanvasMouseMove);
        };

        $canvas.addEventListener('touchstart', scope.onCanvasMouseDown, false);

        function addBodyEventListener(eventName, func) {
          document.documentElement.addEventListener(eventName, func, false);
        }

        function removeBodyEventListener(eventName, func) {
          document.documentElement.removeEventListener(eventName, func);
        }

        scope.onHandleMouseDown = function(e) {

          e.preventDefault();
          e.stopPropagation(); // if event was on handle, stop it propagating up

          startX = lastHandleX = (e.type === 'touchstart') ? e.changedTouches[0].clientX : e.clientX;
          startY = lastHandleY = (e.type === 'touchstart') ? e.changedTouches[0].clientY : e.clientY;
          dragging = false;
          zooming = true;

          addBodyEventListener('mouseup', scope.onHandleMouseUp);
          addBodyEventListener('touchend', scope.onHandleMouseUp);
          addBodyEventListener('mousemove', scope.onHandleMouseMove);
          addBodyEventListener('touchmove', scope.onHandleMouseMove);
        };

        $handle.addEventListener('touchstart', scope.onHandleMouseDown, false);

        scope.onHandleMouseUp = function(e) {

          // this is applied on the whole section so check we're zooming
          if (!zooming) {
            return;
          }

          e.preventDefault();
          e.stopPropagation(); // if event was on canvas, stop it propagating up

          startX = 0;
          startY = 0;
          zooming = false;
          currentX = targetX;
          currentY = targetY;

          removeBodyEventListener('mouseup', scope.onHandleMouseUp);
          removeBodyEventListener('touchend', scope.onHandleMouseUp);
          removeBodyEventListener('mousemove', scope.onHandleMouseMove);
          removeBodyEventListener('touchmove', scope.onHandleMouseMove);
        };

        $handle.addEventListener('touchend', scope.onHandleMouseUp, false);


        scope.onCanvasMouseMove = function(e) {

          e.preventDefault();
          e.stopPropagation();

          if (!dragging) {
            return;
          }
          if(scope.firestload == true){
            if(e.type === 'touchmove'){
              if(scope.newImage == true){
                scope.newImage = false;
              }else{
                startX = (scope.imageXPosition * -1) + e.changedTouches[0].clientX ;
                startY = (scope.imageYPosition * -1) + e.changedTouches[0].clientY ;
              }
            }else{
              if(scope.newImage == true){
                scope.newImage = false;
              }else{
                startX = (scope.imageXPosition * -1) + e.clientX;
                startY = (scope.imageYPosition * -1) + e.clientY;
              }
            }
            currentX = 0;
            currentY = 0;
            scope.firestload = false;
          }
          
          var diffX = startX - ((e.type === 'touchmove') ? e.changedTouches[0].clientX : e.clientX); // how far mouse has moved in current drag
          var diffY = startY - ((e.type === 'touchmove') ? e.changedTouches[0].clientY : e.clientY); // how far mouse has moved in current drag
          moveImage(currentX - diffX, currentY - diffY);
        };

        $canvas.addEventListener('touchmove', scope.onCanvasMouseMove, false);


        var lastHandleX = null, lastHandleY = null;

        scope.onHandleMouseMove = function(e) {

          e.stopPropagation();
          e.preventDefault();

          // this is applied on the whole section so check we're zooming
          if (!zooming) {
            return false;
          }

          var diffX = lastHandleX - ((e.type === 'touchmove') ? e.changedTouches[0].clientX : e.clientX); // how far mouse has moved in current drag
          var diffY = lastHandleY - ((e.type === 'touchmove') ? e.changedTouches[0].clientY : e.clientY); // how far mouse has moved in current drag

          lastHandleX = (e.type === 'touchmove') ? e.changedTouches[0].clientX : e.clientX;
          lastHandleY = (e.type === 'touchmove') ? e.changedTouches[0].clientY : e.clientY;

          var zoomVal = calcZoomLevel(diffX, diffY);
          zoomImage(zoomVal);

        };

        $handle.addEventListener('touchmove', scope.onHandleMouseMove, false);

    }
  };
}]);


