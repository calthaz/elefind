var ResultView = function(){
    
    //this.resultData = {}; 
    this.render = function() {
        var user = service.currentUser;
        var lang = new Lang(user.language);
        var isLoggedIn = user.name !== "";

        this.$el.html(this.template({lang:lang, user: user, isLoggedIn: isLoggedIn, header:{main:lang.resultHeader}}));
        $('main', this.$el).html(this.innerTpl({user:user, lang:lang, header:{main:lang.resultHeader}}));
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

    this.continueRendering = function(){
        var user = service.currentUser;
        var lang = new Lang(user.language);

        var results = this.resultData || JSON.parse(window.localStorage.getItem("elefindResult")); 
        var that = this; 

        console.log("render results"); 
        //result: [{src, title, author, score, vis, date, ect}]
        $("tbody#result-list").html(""); 
        for(var x in results){
            var entry = results[x]; 
            if(entry.vis == "public"){
                entry.src = "../server/storage/"+"public_photos/thumbnail/"+entry.filename; 
                entry.orig = "../server/storage/"+"public_photos/"+entry.filename; 
            }else{
                entry.src = "../server/storage/"+"users/"+user.email+"/photos/thumbnail/"+entry.filename; 
                entry.orig = "../server/storage/"+"users/"+user.email+"/photos/"+entry.filename; 
            }
            var score = parseFloat(results[x].score);
            results[x].score = score.toFixed(3);
            $("tbody#result-list").append(ResultView.prototype.resultEntryTpl(results[x])); 
        }

        $("tbody#result-list tr").click(function(){
            var img = $(this.children[0].children[0]);
            //var img = $(this).children('img');
            //console.log(img); 
            var tmpl = that.imageViewTpl({
                src: img.attr("data-orig"), 
                author: img.attr("data-author"), 
                title: img.attr("data-caption"), 
                date: img.attr("data-date"), 
                lang:lang //could be a shorthand here... I didn't even know I was using ES6 
            });
            $("#image-view-wrapper").html(tmpl);
            renderImageView();
        });


        $( window ).resize(function() {
          resizeGallery(that); 
        });

    };

    this.initialize();
};
//ResultView.
var renderResults = function(results){
    console.log("render results"); 
    //result: [{src, title, author, score, vis, date, ect}]
    $("tbody#result-list").html(""); 
    //var tpl = Handlebars.compile($("#result-tr").html()); can't compile? why? 
    for(var x in results){
        var entry = results[x]; 
        if(entry.vis == "public"){
            entry.src = "../server/storage/"+"public_photos/"+entry.filename; 
        }
        $("tbody#result-list").append(ResultView.prototype.resultEntryTpl(results[x])); //it seems that I can;t use jquery selectors here... Hmmm, why?
    }
};