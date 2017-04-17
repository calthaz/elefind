var SearchView = function (service) {

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

    
    this.sayHello = function(){
        console.log("hello!"); 
    }

	this.render = function() {
        var user = service.currentUser;
        var lang = new Lang(user.language);
        var isLoggedIn = user.name != "";
        var settings = JSON.parse(window.localStorage.getItem("userSettings")); 
        //"centerX":0.5,"centerY":0.5,"searchW":0.2,"searchH":0.2,
        settings.centerX *= 10;
        settings.centerY *= 10;
        settings.searchW *= 10;
        settings.searchH *= 10;
    	this.$el.html(this.template({lang:lang, user: user, isLoggedIn: isLoggedIn, header:{main:lang.searchSettingsHeader}}));
    	$('main', this.$el).html(this.innerTpl({user:user, lang:lang, settings: settings}));
    	return this;
	};

    this.continueRendering = function(){

        //----------------initializes -------------------------

       // $('#search-breadcrumbs.row').pushpin({ top: $("#search-breadcrumbs.row").offset().top}); //so strange

        $('select').material_select();

        $('.datepicker').pickadate({
            selectMonths: true, // Creates a dropdown to control month
            selectYears: 15 // Creates a dropdown of 15 years to control year
        });

        //-------------------events-----------------------------------------------------------------------

        
        var that = this; 

        $("#submit-settings-scope").on("click", function(event){
            //read search config from user
            that.submitDataForSearching();
        });  

        $(".settings-option").on("click mousePressed", function(event){
            //this != event.target. This is always ".settings-option.row"
            //console.log("clicked" + $(this));
            //if($(this).hasClass("row")){
                event.stopPropagation();
                $(".settings-option").removeClass("active");
                $(this).addClass("active");
            //}
        });  
        
        $("form #show-advanced-settings").change(function(){
            if (this.checked) {
                // the checkbox is now checked 
                $("#advanced-settings").css("display", "block");
            } else {
                // the checkbox is now no longer checked
                $("#advanced-settings").css("display", "none");
            }
        });

        
        //------------------------------------------------------------------
    }

    this.isSearching = false;
    this.unfinishedCall = 0;
    this.draftPath="";
    this.relatingFileName = "";


    this.submitDataForSearching = function(){
        if(this.isSearching){
                window.alert("Please wait. Current Search unfinished.");
                return;
            }

            this.isSearching = true; 
            
            $("#submit-settings-scope").addClass("disabled");
            window.location.hash = "#searchProgress"; 
            //grab user settings as well as th draft
            
            var searchData = {
                searchConfig: JSON.parse(window.localStorage.getItem("userSettings")), 
                user: JSON.parse(window.localStorage.getItem("elefindUser")), 
                draft: JSON.parse(window.localStorage.getItem("userSketch"))
            };

            var that = this; 

            $.ajax({
                url: '../server/NewSearch.php',  //creat get =xxx.php
                //beforeSend: function (request) //must have ??
                //{
                    //request.setRequestHeader("X-CSRF-TOKEN",$('input[name=_token]').val());
                //},
                type: 'POST',
                data: searchData,
                cache: false,
                dataType: 'text',
                //processData: false,
                //contentType: false,
                success:function(data, textStatus, jqXHR){
                    console.log(data);
                    data = JSON.parse(data);
                    that.draftPath = data.draftPath;
                    that.relatingFileName = data.relatingFileName; 
                    that.startSearch();
                },
                error: function(jqXHR, textStatus, errorThrown){
                    window.alert("Upload Settings failed. Try again");//+lang.uploadErrorMsg
                    console.log("Error: "+ textStatus+"|"+errorThrown);
                    that.isSearching = false; 
                },
                complete: function(data){ //No matter error or success. 
                //so what is the data?   
                    //            
                }
            });
    }
    this.lastClassName = ""; 

    this.requestProgress = function(){
        var user = service.currentUser;
        var lang = new Lang(user.language);
        var that = this; 
        $.ajax({
                url: '../server/NewSearch.php',  //creat get =xxx.php
                type: 'POST',
                data: {getProgress: "getProgress", relatingFileName: that.relatingFileName },
                cache: false,
                dataType: 'text',
                //processData: false,
                //contentType: false,
                success:function(data, textStatus, jqXHR){
                    console.log(data);
                    if(data.indexOf("<")==-1){
                        data = JSON.parse(data);
                        //expect data = {"status":"Progress","stage":"processing file No.17 out of 21\r\n","processed":"17","total":"21"}

                        var h = $("div#progress").css("height"); 
                        $("#"+that.lastClassName).css("top", h); 

                        $("div#progress").removeClass();

                        var className = ""; 
                        if(data.status == "Start"){                        
                            className= "thread-start";
                            $("div#progress-field").append(that.stageLabelTpl({icon:lang.startProcessingSketchIcon, text:lang.startProcessingSketch, id: className, top:h}));

                        }else if(data.status == "Progress" && data.stage.indexOf("gotten")!=-1){                   
                            className="typical-gotten";
                            $("div#progress-field").append(that.stageLabelTpl({icon:lang.typicalMapGottenIcon, text:lang.typicalMapGotten, id: className, top:h}));

                        }else if(data.status == "Progress" && (data.stage.indexOf("comparing")!=-1)||(data.stage.indexOf("processing finished")!=-1)){
                            className="start";
                            $("div#progress-field").append(that.stageLabelTpl({icon:lang.startComparingIcon, text:lang.startComparing, id: className, top:h}));

                        }else if(data.status == "Progress" && data.stage.indexOf("No.")!=-1){                       
                            var percent = Math.floor((parseInt(data.processed)/parseInt(data.total))*100); 
                            className="searching-"+percent;
                            //percent = percent.toFixed(3); 
                            console.log(percent);                             
                            $("div#progress-field").append(that.stageLabelTpl({icon:lang.comparingIcon, text:lang.comparing+" "+percent+"%...", id: className, top:h}));

                        }else{                       
                            className="finish";
                            $("div#progress-field").append(that.stageLabelTpl({icon:lang.finishedComparingIcon, text:lang.finishedComparing, id: className, top:h}));

                        }

                        $("div#progress").addClass(className);
                        
                         //'<div class = "stage-label" style="top:'+h+'" id = "'+className+'">Label:'+className+' </div>'
                        //document.getElementById(className).scrollIntoView(); //too ugly 
                        $('html, body').animate({
                            scrollTop: $("#"+className).offset().top
                        }, 800);
                        that.lastClassName = className; 
                        //$("#progress-wrapper").append("<p>"+data.status+"|"+data.stage+"|"+(parseInt(data.processed)/parseInt(data.total))+"| . yeah</p>"); 
                    }
                },
                error: function(jqXHR, textStatus, errorThrown){
                    console.log("Request Porgress failed");//+lang.uploadErrorMsg
                    console.log("Error: "+ textStatus+"|"+errorThrown);
                },
                complete: function(data){ //No matter error or success. 
                    
                }
        });
/*
["thread-start", "typical-gotten", "start", "searching-", finish]; 
"status":"Start","stage":"Thread start\r\n"}
SearchView.js:148 {"status":"Progress","stage":"Start comparing\r\n"}
SearchView.js:148 {"status":"Progress","stage":"processing file No.3 out of 21\r\n","processed":"3","total":"21"}
SearchView.js:148 {"status":"Progress","stage":"processing file No.5 out of 21\r\n","processed":"5","total":"21"}
..................................
SearchView.js:148 {"status":"Progress","stage":"processing file No.18 out of 21\r\n","processed":"18","total":"21"}
SearchView.js:148 {"status":"Progress","stage":"processing file No.20 out of 21\r\n","processed":"20","total":"21"}
SearchView.js:148 {"status":"Finished","stage":"Comparing finished in 3827 seconds\r\n"}
Start: Thread start
Progress: typical map gotten
Progress: draft processing finished
Progress: Start comparing
Progress: processing file No.1 out of 21
Progress: processing file No.2 out of 21
.......................................
Progress: processing file No.21 out of 21
Finished: Comparing finished in 3827 seconds

*/
        
    }

    this.startSearch = function(){
        var user = service.currentUser;
        var lang = new Lang(user.language);
        var that = this; //what's this????
        $.ajax({
                url: '../server/NewSearch.php',  //creat get =xxx.php
                type: 'POST',
                data: {startSearch: "start", relatingFileName: that.relatingFileName },
                cache: false,
                dataType: 'text',
                //processData: false,
                //contentType: false,
                success:function(data, textStatus, jqXHR){
                    console.log(data);

                },
                error: function(jqXHR, textStatus, errorThrown){
                    console.log("Request Porgress failed");//+lang.uploadErrorMsg
                    console.log("Error: "+ textStatus+"|"+errorThrown);
                    
                },
                complete: function(data){ //No matter error or success. AND THIS DATA　IS NOT THAT DATA IN SUCCESS...
                    clearInterval(that.unfinishedCall);
                    that.isSearching = false; 
                    ResultView.prototype.resultData = JSON.parse(data.responseText);
                     $("div#progress").removeClass();
                     $("div#progress").addClass("finish");
                     //$("div#progress-field").append('<div class = "stage-label" style="top:'+h+'" id = "'+className+'">Label: Finished! </div>'); 
                     var h = $("div#progress").css("height"); 
                     
                    $("div#progress-field").append(that.stageLabelTpl({icon:lang.finishedComparingIcon, text:lang.finishedComparing, id: "finish-tag", top:h}));
                    $("#to-result").css("display", "inline-block"); 
                     $("#progress-field").addClass("stop-animation"); 
                    console.log("SEARCH FINISHED"); 
                    //window.location.hash = "#searchResult"; 
                    /*
                    //well. the document is not loaded yet. so ...
                    $(document).one('ready',function(){
                        // Perform something here...
                        renderResults(JSON.parse(data.responseText)); //ResultView.
                    });*/ 
                }
        });
        this.unfinishedCall = setInterval(function(){that.requestProgress();}, 500);
    }



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
}