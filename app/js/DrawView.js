var DrawView = function (service) {

	var findCommonFactor = function(a,b){
      var c=b;
      if(a<b){
        c=a;
        a=b;
        b=c;
      }
      while(a%b!=0){
        c=a%b;
        a=b;
        b=c;
      }
      return c;
    }

	this.render = function() {
        var user = service.currentUser;
        var lang = new Lang(user.language);
        var isLoggedIn = user.name != "";

    	this.$el.html(this.template({lang:lang, user: user, isLoggedIn: isLoggedIn, header: {main:lang.drawingHeader}}));
    	$('main', this.$el).html(this.innerTpl({user:user, lang:lang}));
    	return this;
	};

  this.renderSideNav = function(){
        var user = service.currentUser;
        var lang = new Lang(user.language);
        var isLoggedIn = user.name != "";
        return this.sideNavTpl({lang:lang, user: user, isLoggedIn: isLoggedIn});
  }

  this.initialize = function () {
        // Define a div wrapper for the view (used to attach events)
        this.$el = $('<div class="content-holder"/>');
        //this.$el.on('keyup', '.search-key', this.findByName);
        //this.render();
  };

  this.initialize();


  this.continueRendering = function(){
    var myBoard = new DrawingBoard.Board('custom-board', {
          controls: [
          //'Color',
          {  Size: { type: "range", min: 5, max: 42 } },
          { DrawingMode: { filler: false } },
          'Navigation',
          //'Download'
          ],
          background:false,
          size: 5,
          webStorage: false,
          enlargeYourContainer: true,
      //droppable: true, //try dropping an image on the canvas!
      //stretchImg: true //the dropped image can be automatically ugly resized to to take the canvas size
    }, "my-board");

    this.board = myBoard; 

    var width = $("canvas").innerWidth();
    var height = $("canvas").innerHeight();

    var f = findCommonFactor(width,height);
    $("#width-ratio").val(width/f);
    $("#height-ratio").val(height/f);

    $("#reset-canvas-size").click(function(){
        var w=$("#width-ratio").val();
        var h=$("#height-ratio").val();
        //TODO: input check!!!
        if(w==0||h==0||h/w>10){
            window.alert("Naughty!");
            return;
        }
        var r = $("canvas").parent(".drawing-board-canvas-wrapper").innerWidth()/w;
        $("#custom-board").children().remove();
        $("#custom-board").css("width", Math.floor(w*r));
        $("#custom-board").css("height", Math.floor(h*r));
        myBoard = new DrawingBoard.Board('custom-board', {
            controls: [
            //'Color',
            {  Size: { type: "range", min: 5, max: 42 } },
            { DrawingMode: { filler: false } },
            'Navigation',
            //'Download'
            ],
            background:false,
            size: 5,
            webStorage: false,
            enlargeYourContainer: true,
            //color: 
            //droppable: true, //try dropping an image on the canvas!
            //stretchImg: true //the dropped image can be automatically ugly resized to to take the canvas size
        }, "my-board");
        $("#farbtastic-color-picker #color-lens").css("color","#000000");
        var f = findCommonFactor(w,h);
        $("#width-ratio").val(w/f);
        $("#height-ratio").val(h/f);
    });

    var colorChanged = function(color){
        //console.log(DrawingBoard.Utils.isColor(color));
        myBoard.setColor(color);
    
        myBoard.$el.find('.drawing-board-control-colors-current')
            .css('background-color', color)
            .attr('data-color', color);

        myBoard.ev.trigger('color:changed', color);
        myBoard.$el.find('.drawing-board-control-colors-rainbows').addClass('drawing-board-utils-hidden');
    }

    var farbCallback = function(color){
        $("#farbtastic-color-picker #color").val(color);
        $("#farbtastic-color-picker #color").css("background-color",color);
        $("#farbtastic-color-picker #color-lens").css("color",color);
        colorChanged(color);
    }

    $('#colorpicker').farbtastic(farbCallback);

      $('.dropdown-button').dropdown({
          inDuration: 300,
          outDuration: 225,
          constrain_width: false, // Does not change width of dropdown to that of the activator
          hover: true, // Activate on hover
          gutter: 0, // Spacing from edge
          beloworigin: true, // Displays dropdown below the button
          alignment: 'left', // Displays dropdown with edge aligned to the left of button
          stoppropagation: true
      });

      $("form#farbtastic-color-picker #color-lens").click(function(e){
          console.log(event.target);
          /*if(event.target == document.getElementById("color-lens")){
              if($("ul#picker-wrapper").hasClass("active")){
                  $("ul#picker-wrapper").removeClass("active");
              }else{
                  $("ul#picker-wrapper").addClass("active");
                  $("ul#picker-wrapper").css('top', event.target.offsetTop-200);
                  $("ul#picker-wrapper").css('left', event.target.offsetLeft);
              }*/
              
              //e.stopPropagation();
          //}
          
      });

      $("main").on("click mousePressed", "canvas", function(){
          $("ul#picker-wrapper").removeClass("active");
      });

      //Hey, very important!!!
      $("#picker-wrapper.dropdown-content").on("click", function(e){
          //window.alert("Clicked!")
          e.stopPropagation();
          e.preventDefault();
      });

      $("#picker-wrapper.dropdown-content").on("touchstart", function(e){
      //window.alert("Touched!")
          e.stopPropagation();
      //e.preventDefault();
      });

      $("#save-to-phone").on("click", function(){
          var img = myBoard.getImg();
          //window.alert(img.substring(0,25));
          //img = img.replace("image/png", "image/octet-stream");
          //console.log(img);
          if(window.imageSaver){
              //window.alert("Using cordova-save-image-gallery");
              var params = {data: img, prefix: 'myBoard_', format: 'png', quality: 80, mediaScanner: true};
              window.imageSaver.saveBase64Image(params,
                  function (filePath) {
                      navigator.notification.confirm('File saved on ' + filePath, null, "Image Saved","OK");
                      //window.alert();
                  },
                  function (msg) {
                      window.alert(msg);
                  }
              );
          }else{
              img=img.replace("image/png", "image/octet-stream");
              window.location.href = img;
          }
      });

      var that = this; 

      $("#save-to-server").on("click", function(event){
          //read search config from user
          that.saveDraftToServer();
      });

      $("main").on("click", ".next", function(){
        console.log("next"); 
        var draft = {
          type:"new-sketch", 
          title: $("#sketch-title").val(),
          base64str: that.board.getImg(), 
          publish: false, 
        }

        window.localStorage.setItem("userSketch", JSON.stringify(draft));
        window.location.hash = "searchSettings"; 

      });

      $('input#sketch-title').characterCounter();

  }

  this.saveDraftToServer = function(){
    var that = this; 
    var user = service.currentUser;
    var lang = new Lang(user.language);
    var draft = {
      title: $("#sketch-title").val(),
      base64str: this.board.getImg(), 
      publish: false, //TODO　grab from the form             
    }

    var data = {saveDraft: true, user: JSON.parse(window.localStorage.getItem("elefindUser")), draft:draft};

    $.ajax({
        url: '../server/ImageManager.php',  //creat get =xxx.php
        //beforeSend: function (request) //must have ??
        //{
            //request.setRequestHeader("X-CSRF-TOKEN",$('input[name=_token]').val());
        //},
        type: 'POST',
        data: data,
        cache: false,
        dataType: 'text',
        //processData: false,
        //contentType: false,
        success:function(data, textStatus, jqXHR){
            console.log(data);  
            Materialize.toast(lang.imageSaved, 4000);               
        },
        error: function(jqXHR, textStatus, errorThrown){
            window.alert("Upload Settings failed. Try again");//+lang.uploadErrorMsg
            console.log("Error: "+ textStatus+"|"+errorThrown);
        },
        complete: function(data){ //No matter error or success. 
        //so what is the data?   
            //            
        }
    });
  }

}