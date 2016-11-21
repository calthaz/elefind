var GridView = function(service, type){
	this.type = type; 
	this.header = new Object();

	this.render = function() {
        var user = service.currentUser;
        var lang = new Lang(user.language);
        var isLoggedIn = user.name != "";

    	this.$el.html(this.template({lang:lang, user: user, isLoggedIn: isLoggedIn, header:this.header}));
    	$('main', this.$el).html(this.innerTpl({user:user, lang:lang, header:this.header}));
    	return this;
	};

	this.renderSideNav = function(){
        var user = service.currentUser;
        var lang = new Lang(user.language);
        var isLoggedIn = user.name != "";
        return this.sideNavTpl({lang:lang, user: user, isLoggedIn: isLoggedIn});
    }

  this.continueRendering = function(){
    var user = service.currentUser;
    var lang = new Lang(user.language);


  	$(".materialboxed").materialbox();

  	this.lastWidth = window.innerWidth; 

  	var that = this; 

  	$( window ).resize(function() {
			//console.log(window.innerWidth+"x"+window.innerHeight);
			/*var windowW = window.innerWidth;
			if(windowW<601){
				var containerW = windowW*0.90;
			}else if(windowW>992){
				var containerW = (windowW-300)*0.7; 
			}else{
				var containerW = (windowW*0.85);
			}*/
      resizeGallery(that); 
	  });	

		$("#gallery").on("click", ".card-image img", function(){
			var src =  $(this).attr("src");
			console.log(src); 			
			$("#image-view-wrapper").html(that.imageViewTpl({src: src, author: $(this).attr("data-author"), title: $(this).attr("data-caption"), date: $(this).attr("data-date"), lang}));
      renderImageView(); 
		});

		$(".row").on("click", ".exit-view", function(){
			$("#image-view-wrapper").removeClass("has-view"); 
			$("#image-view-wrapper").html("<span>onbajb</span>");
			$('.row#gallery').css("display", "block");
		}); 

  }

  this.initialize = function () {
  	var user = service.currentUser;
      var lang = new Lang(user.language);
      // Define a div wrapper for the view (used to attach events)
      this.$el = $('<div class="content-holder"/>');
      //this.$el.on('keyup', '.search-key', this.findByName);
      //this.render();
      var data = new Object();
      if(this.type == "publicGallery"){
      	this.header.main = lang.publicGallery;
      	//request photos
      	data.publicGallery = "want";

      }else if(this.type == "myGallery"){
      	this.header.main = lang.myGallery;
      	data.myGallery = "want";
      	data.user = service.currentUser; 
      }else if(this.type == "publicAlbum"){
      	this.header.main = lang.publicAlbum;
      	//request photos
      	data.publicAlbum = "want";
      	
      }else if(this.type == "myAlbum"){
      	this.header.main = lang.myAlbum;
      	data.myAlbum = "want";
      	data.user = service.currentUser; 
      }		

      var that = this; 
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
          	data=JSON.parse(data);
          	/*Example: 
          	files:[{filename: "zymdxlyx@sina.cn_1477030781.png", author: "zymdxlyx@sina.cn", title: null,…},…]
				0:{filename: "zymdxlyx@sina.cn_1477030781.png", author: "zymdxlyx@sina.cn", title: null,…}
					author:"zymdxlyx@sina.cn"
					date:"2016-10-21"
					filename:"zymdxlyx@sina.cn_1477030781.png"
					title:null
					visibility:"private"
				1:{filename: "zymdxlyx@sina.cn_1477035495.png", author: "zymdxlyx@sina.cn", title: null,…}
			msg:"success"
          	*/
          	
          	if(data.msg =="success"){

          		if(that.type=="publicAlbum"){
          			$(".row#gallery").append(that.uploadTileTpl());
          			$("div#upload-dropzone").dropzone({ 
                  url: "../server/UploadHandler.php", 
                  uploadMultiple:true, 
                  paramName:"uploadToPublicAlbum", 
                  params: {useremail:JSON.parse(window.localStorage.getItem("elefindUser")).email}, 
                  });//maxFileSize: 2 cause the browser to crash? 

      					var path = "../server/storage/"+"public_photos/";
      				}else if(that.type=="publicGallery"){
      					var path = "../server/storage/"+"public_sketches/";
      				}else if(that.type=="myGallery"){
      					var path = "../server/storage/users/"+service.currentUser.email+"/sketches/";
      				}else{
                $(".row#gallery").append(that.uploadTileTpl());
                $("div#upload-dropzone").dropzone({ 
                  url: "../server/UploadHandler.php", 
                  uploadMultiple:true, 
                  paramName:"uploadToMyAlbum", 
                  params: {useremail:JSON.parse(window.localStorage.getItem("elefindUser")).email}, 
                  });//maxFileSize: 2 cause the browser to crash?
      					var path = "../server/storage/users/"+service.currentUser.email+"/photos/";
      				}

              if(data.files.length == 0) return; 
          		var currentDate = data.files[0].date; 
          		$(".row#gallery").append(that.textTileTpl({text:{title: currentDate.substr(currentDate.indexOf("-")+1), body: currentDate.substr(0,currentDate.indexOf("-")) }, style: getRandomColor()}));

          		for(x in data.files){

          			var file = data.files[x];
        				if(file.date != currentDate){
        					currentDate = file.date; 
          				$(".row#gallery").append(that.textTileTpl({text:{title: currentDate.substr(currentDate.indexOf("-")+1), body: currentDate.substr(0,currentDate.indexOf("-"))}, style: getRandomColor()}));
        				}
          			//lastIndexOf()  从后向前搜索字符串。
                // Well, /./g matches with everything 
          			$(".row#gallery").append(that.imageTileTpl({image:{src: path+file.filename, title: file.title, filename: file.filename.replace("@","at").replace(/[.]/g, "dt")}, author:file.author, date: file.date, visibility: file.visibility}));

          		}
          		
          	}else{
          		console.log("sad..."); 
          	}
          
          },
          error: function(jqXHR, textStatus, errorThrown){

              console.log('ERRORS:' + textStatus +" | errorThrown: "+errorThrown);
              console.log("jqXHR"+jqXHR);
              window.alert("Can't get your drafts now!"); 
              
          },
          complete: function(data){ //No matter error or success.
              $("main .preloader-wrapper").remove();
              $(".materialboxed").materialbox();
              $(window).trigger('resize');
          }
      }); 
  };

  this.initialize();

}

var renderImageView = function(){
  $("#image-view-wrapper").addClass("has-view"); 
  if(window.innerWidth<600){
    $('.row#gallery').css("display", "none");
  } 
  var w = $('#image-view-wrapper').width();

  $(".image-view").css("width", w+'px');
  $(".image-self-wrapper").css("height", Math.floor(w*3/4)+'px');
  $(".image-details").css("height", Math.floor(w*1/4)+'px');
  var h=Math.floor(w*1/4);
  $("p.view-author").css("font-size", Math.floor(h/4)+'px');
  $("p.view-author").css("width", (w-75)+'px');
  $("p.view-title").css("font-size", Math.floor(h/5)+'px');
  $("span.view-date").css("font-size", Math.floor(h/6)+'px');

  //$(".image-actions").css("height", Math.floor(w*1/5)+'px'); 
  $(".image-self .hidden-image").css("max-width", w+"px");
  $(".image-self .hidden-image").css("max-height", Math.floor(w*3/4)+"px");
  
  $('.image-view').pushpin({ top: $('.image-view').offset().top, button:$('.page-footer').offset().top });
  $('.materialboxed').materialbox();

  $(".image-view button.search-by-this").click(function(){
    var img = this.parentNode.parentNode.children[0].children[0]; //[0] image-card
    console.log(img); 
    console.log($(img).css("background-image")); //url("http://localhost/elefind/server/storage/users/zymdxlyx@sina.cn/sketches/zymdxlyx@sina.cn_1477905731.png")
    window.localStorage.setItem("userSketch", JSON.stringify({type: 'old-sketch', src: $(img).css("background-image")})); 
    window.location.hash = "#searchSettings";
    $(window).trigger("hashChange"); 
  });

  $(".image-view a#delete-pic").click(function(){
    var img = this.parentNode.parentNode.children[0].children[0]; //[0] image-card
    console.log(img); 
    console.log($(img).css("background-image")); //url("http://localhost/elefind/server/storage/users/zymdxlyx@sina.cn/sketches/zymdxlyx@sina.cn_1477905731.png")
    var filename = $(img).css("background-image");
    filename = filename.substring(filename.lastIndexOf("/")+1, filename.indexOf('")'));
    filename = filename.replace("@","at").replace(/[.]/g, "dt"); 
    //lastIndexOf() 从后向前搜索字符串。
    //jQuery.post( url [, data ] [, success ] [, dataType ] )
    $.post("../server/ImageManager.php", {deletePic:$(img).css("background-image")}, function(data){
      if(data=="success"){
        console.log("deleted a pic: "+filename); 
        $(".image-view").remove();
        $("#"+filename).remove(); 
      }     
    }); 
  });

  $(".row").on("click", ".exit-view", function(){
    $("#image-view-wrapper").removeClass("has-view"); 
    $("#image-view-wrapper").html("<span>onbajb</span>");
    $('.row#gallery').css("display", "block");
    console.log("show gallery"); 
  }); 
   
}

var resizeGallery = function(that){
    containerW = $(".row#gallery").width()-20; //margin

      var w = 120;

      for(; w <= 150; w++){
        if(containerW%w < 20 ){
          break;
        }
      }

      //console.log(windowW+", "+containerW+", "+w); 
      $(".row#gallery .card, .row#gallery .card-panel").css("width", w+"px");
      $(".row#gallery .card, .row#gallery .card-panel").css("height", w+"px");
      $(".row .upload-tile").css("height", (w)+"px");
      $(".row .upload-tile").css("width", (w*2+4)+"px");
      $(".row#gallery .card img").css("width", (w-2)+"px");
      $(".row#gallery .card img").css("height", (w-2)+"px");

      if(window.innerWidth<600 && that.lastWidth>600 && $("#image-view-wrapper").hasClass("has-view") ){
        $('.row#gallery').css("display", "none");
      }

      if(window.innerWidth>600 && that.lastWidth<600){
        $('.row#gallery').css("display", "block");
      }

      that.lastWidth=window.innerWidth; 

      w = $('#image-view-wrapper').width();

      $(".image-view").css("width", w+'px');
      $(".image-self-wrapper").css("height", Math.floor(w*3/4)+'px');
      $(".image-details").css("height", Math.floor(w*1/4)+'px');
      var h=Math.floor(w*1/4);
      $("p.view-author").css("font-size", Math.floor(h/4)+'px');
      $("p.view-author").css("width", (w-75)+'px');
      $("p.view-title").css("font-size", Math.floor(h/5)+'px');
      $("span.view-date").css("font-size", Math.floor(h/6)+'px');

      //$(".image-actions").css("height", Math.floor(w*1/5)+'px'); 
      $(".image-self .hidden-image").css("max-width", w+"px");
      $(".image-self .hidden-image").css("max-height", Math.floor(w*3/4)+"px");
}