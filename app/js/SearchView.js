var SearchView = function (service) {

    var findCommonFactor = function(a,b){
      var c=b;
      if(a<b){
        c=a;
        a=b;
        b=c;
      }
      while(a%b!==0){
        c=a%b;
        a=b;
        b=c;
      }
      return c;
    };

    
    this.sayHello = function(){
        console.log("hello!"); 
    };

    this.render = function() {
        var user = service.currentUser;
        var lang = new Lang(user.language);
        var isLoggedIn = user.name !== "";
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

        var settings = JSON.parse(window.localStorage.getItem("userSettings"));
        /*var defaultSettings = {
            //MANAGER_TYPE:"ImprSearch",
            searchMethod:1,
            preprocessing:3,
            maxPatchSize:1250,
            maxAmRate:2,
            maxFolds:2,
            centerX:0.5,
            centerY:0.5,
            searchW:0.2,
            searchH:0.2,
            slidingStep:4
        };*/

        $("#submit-settings-scope").on("click", function(event){
            //read search config from user
            var select=document.getElementById("st-patch-size");
            var index=select.selectedIndex; //序号，取当前选中选项的序号
            settings.maxPatchSize = select.options[index].value;

            settings.centerX = parseInt($("#center-x").val())/10;

            settings.centerY = parseInt($("#center-y").val())/10;

            //settings.maxAmRate = parseInt($("#max-am-rate").val()); //no use
            settings.maxFolds = parseInt($("#max-folds").val());

            settings.searchW = parseInt($("#search-w").val())/10;
            settings.searchH = parseInt($("#search-h").val())/10;

            settings.slidingStep = parseInt($("#sliding-step").val());

            settings.searchAlbums = [];
            $("#st-scope-by-folder option:selected").each(function(){
                settings.searchAlbums.push($(this).val()); //这里得到的就是
            }); 
            settings.startDate = $("#start-date").val();
            settings.endDate = $("#end-date").val();

            console.log(settings);

            that.submitDataForSearching(settings);
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
    };

    this.isSearching = false;
    this.unfinishedCall = 0;
    this.draftPath="";
    this.relatingFileName = "";


    this.submitDataForSearching = function(settings){
        if(this.isSearching){
                window.alert("Please wait. Current Search unfinished.");
                return;
            }

            this.isSearching = true; 
            window.localStorage.setItem("userSettings", JSON.stringify(settings)); 
            $("#submit-settings-scope").addClass("disabled");
            window.location.hash = "#searchProgress"; 
            //grab user settings as well as th draft
            
            var searchData = {
                searchConfig: settings, 
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
                    try{
                        data = JSON.parse(data);
                        if(data.msg==="success"){
                            that.draftPath = data.draftPath;
                            that.relatingFileName = data.relatingFileName; 
                            that.startSearch();
                            return
                        }else{
                            window.alert(data.msg); //TODO language
                        }
                    }catch(e){
                    }                   
                    this.isSearching = false; 
                    window.location.hash = "#searchSettings"; 

                },
                error: function(jqXHR, textStatus, errorThrown){
                    window.alert("Upload Settings failed. Try again");//+lang.uploadErrorMsg
                    console.log("Error: "+ textStatus+"|"+errorThrown);
                    that.isSearching = false; 
                    window.location.hash = "#searchSettings"; 
                },
                complete: function(data){ //No matter error or success. 
                //so what is the data?   
                    //            
                }
            });
    };
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
                    if(data.indexOf("<")==-1 && that.isSearching){
                        data = JSON.parse(data);
                        //expect data = {"status":"Progress","stage":"processing file No.17 out of 21\r\n","processed":"17","total":"21"}
                        //or data = {"status":false,"stage":false}
                        if(!data.status)return; 
                    
                        var h = $("div#progress").css("height"); 
                        $("#"+that.lastClassName).css("top", h); 

                        $("div#progress").removeClass();
                        $(".stage-label").remove();

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

                        }else if(data.status == "Error" || data.status == "Fatal Error"){ 
                            className = "error-tag";
                            $("div#progress-field").append(that.stageLabelTpl({icon:lang.errorComparingIcon, text:data.stage, id: "error-tag", top:h}));      
                        }else{                       
                            className="finish";
                            $("div#progress-field").append(that.stageLabelTpl({icon:lang.finishedComparingIcon, text:lang.finishedComparing, id: className, top:h}));
                        }

                        $("div#progress").addClass(className);
                        
                         //'<div class = "stage-label" style="top:'+h+'" id = "'+className+'">Label:'+className+' </div>'
                        //document.getElementById(className).scrollIntoView(); //too ugly 
                        $('html, body').animate({
                            scrollTop: $("#"+className).offset().top
                        }, 400);
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
        
    };

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
                    //console.log(data);

                },
                error: function(jqXHR, textStatus, errorThrown){
                    console.log("Request Porgress failed");//+lang.uploadErrorMsg
                    console.log("Error: "+ textStatus+"|"+errorThrown);
                    
                },
                complete: function(data){ //No matter error or success. AND THIS DATA　IS NOT THAT DATA IN SUCCESS...
                    clearInterval(that.unfinishedCall);
                    that.isSearching = false; 
                  
                    var h = $("div#progress").css("height"); 
                    try{
                        ResultView.prototype.resultData = JSON.parse(data.responseText);
                        window.localStorage.setItem("elefindResult", data.responseText);
                        $("div#progress").removeClass();
                        $("div#progress").addClass("finish");
                        //$("div#progress-field").append('<div class = "stage-label" style="top:'+h+'" id = "'+className+'">Label: Finished! </div>'); 
                        $(".stage-label").remove();
                        $("div#progress-field").append(that.stageLabelTpl({icon:lang.finishedComparingIcon, text:lang.finishedComparing, id: "finish-tag", top:h}));
                        $("#to-result").css("display", "inline-block"); 
                        $("#progress-field").addClass("stop-animation"); 
                        console.log("SEARCH FINISHED"); 
                    }catch(error){
                        $("div#progress").removeClass();
                        $("div#progress").addClass("finish");
                        $(".stage-label:not(#error-tag)").remove();
                        if(data.responseText.indexOf("Empty Draft")!==-1){
                            $("div#progress-field").append(that.stageLabelTpl({icon:lang.errorComparingIcon, text:lang.emptyDraftError, id: "finish-tag", top:h})); 
                        }else if(data.responseText.indexOf("Illegal args")!==-1){
                            $("div#progress-field").append(that.stageLabelTpl({icon:lang.errorComparingIcon, text:lang.illegalArgsError, id: "finish-tag", top:h})); 
                        }else{
                            $("div#progress-field").append(that.stageLabelTpl({icon:lang.errorComparingIcon, text:lang.comparingError, id: "finish-tag", top:h})); 
                        }
                        

                        $("#progress-field").addClass("stop-animation"); 
                        $("#to-gallery").css("display", "inline-block"); 
                        console.log("SEARCH FINISHED WITH ERROR"); 
                        return; 
                    }                    
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
    };



    this.renderSideNav = function(){
        var user = service.currentUser;
        var lang = new Lang(user.language);
        var isLoggedIn = user.name !== "";
        return this.sideNavTpl({lang:lang, user: user, isLoggedIn: isLoggedIn});
    };

    this.initialize = function () {
        // Define a div wrapper for the view (used to attach events)
        this.$el = $('<div class="content-holder"/>');
        //this.$el.on('keyup', '.search-key', this.findByName);
        //this.render();
    };

    this.initialize();
};