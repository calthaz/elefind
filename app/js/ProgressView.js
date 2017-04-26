var ProgressView = function(){
    this.actions = ["thread-start", "typical-gotten", "start", "searching-", "searching-", "searching-", "searching-", "searching-", "searching-", 
    "searching-", "searching-", "searching-", "searching-", "searching-", "finish"];
        //-----------------0----------------1-----------2---------3
    this.last = -1; 

    this.render = function() {
        var user = service.currentUser;
        var lang = new Lang(user.language);
        var isLoggedIn = user.name !== "";

        this.$el.html(this.template({lang:lang, user: user, isLoggedIn: isLoggedIn, header:{main:lang.progressHeader}}));
        $('main', this.$el).html(this.innerTpl({user:user, lang:lang, header:{main:lang.progressHeader}}));
        return this;
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

    this.lastClassName = ""; 

    this.continueRendering = function(){
        //var canvas = document.getElementById('progress');
        //this.ctx = canvas.getContext('2d');
        //this.ctx.lastX = 0;
        //this.ctx.lastY = 0; 
        var that = this; 
        $("body").on("click","#test-btn", function(){

            var h = $("div#progress").css("height"); 
            $("#"+that.lastClassName).css("top", h); 
            console.log(that.lastClassName); 

            console.log("clicked"); 
            $("div#progress").removeClass();
            that.last = that.last+1; 
            var className = that.actions[that.last];
            if(that.last>=3&&that.last<=13){
                className += Math.floor((that.last-3)*100/11)+1; 
            }
            if(that.last>14){
                that.last = -1; 
                $(".stage-label").remove();
            }
            $("div#progress").addClass(className);

            h = $("div#progress").css("height"); 

            //$("div#progress-field").append('<div class = "stage-label" style="top:'+h+'" id = "'+className+'">Label:'+className+' </div>'); 
            $("div#progress-field").append(that.stageLabelTpl({icon:"send", text:className, id:className, top:h}));
            //document.getElementById(className).scrollIntoView(); //too ugly
            $('html, body').animate({
                scrollTop: $("#"+className).offset().top
            }, 800);
            that.lastClassName = className; 
        }); 

    };
};