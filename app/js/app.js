if (navigator.notification) { // Override default HTML alert with native dialog
            window.alert = function (message) {
                navigator.notification.alert(
                    message,    // message
                    null,       // callback
                    "Elefind", // title
                    'OK'        // buttonName
                );
            };
    }

    /* ---------------------------------- Local Variables ---------------------------------- */
    //var homeTpl = Handlebars.compile($("#home-tpl").html());
    //var employeeListTpl = Handlebars.compile($("#employee-list-tpl").html());
    var actionQueue = new ActionQueue();
    var service = new UserService();
    

    //var user = service.getCurrentUser();
    //var lang = new Lang(user.language);

    HomeView.prototype.template = Handlebars.compile($("#home-nav-footer").html());
    HomeView.prototype.sideNavTpl = Handlebars.compile($("#side-nav").html());

    AcSettingsView.prototype.template=Handlebars.compile($("#account-settings").html());

    DrawView.prototype.template = Handlebars.compile($("#home-nav-footer").html());
    DrawView.prototype.innerTpl = Handlebars.compile($("#drawing-page").html());
    DrawView.prototype.sideNavTpl = Handlebars.compile($("#side-nav").html());

    SearchView.prototype.template = Handlebars.compile($("#home-nav-footer").html());
    SearchView.prototype.innerTpl = Handlebars.compile($("#search-page").html());
    SearchView.prototype.sideNavTpl = Handlebars.compile($("#side-nav").html());
    SearchView.prototype.stageLabelTpl = Handlebars.compile($("#stage-label").html());

    ProgressView.prototype.template = Handlebars.compile($("#home-nav-footer").html());
    ProgressView.prototype.innerTpl = Handlebars.compile($("#progress-page").html());
    ProgressView.prototype.sideNavTpl = Handlebars.compile($("#side-nav").html());
    ProgressView.prototype.stageLabelTpl = Handlebars.compile($("#stage-label").html());

    ResultView.prototype.template = Handlebars.compile($("#home-nav-footer").html());
    ResultView.prototype.innerTpl = Handlebars.compile($("#result-page").html());
    ResultView.prototype.sideNavTpl = Handlebars.compile($("#side-nav").html());
    ResultView.prototype.resultEntryTpl = Handlebars.compile($("#result-tr").html());
    ResultView.prototype.imageViewTpl = Handlebars.compile($("#image-view").html());

    GridView.prototype.template = Handlebars.compile($("#home-nav-footer").html());
    GridView.prototype.innerTpl = Handlebars.compile($("#grid-gallery").html());
    GridView.prototype.textTileTpl = Handlebars.compile($("#text-tile").html());
    GridView.prototype.imageTileTpl = Handlebars.compile($("#image-tile").html());
    GridView.prototype.uploadTileTpl = Handlebars.compile($("#upload-tile").html());
    GridView.prototype.sideNavTpl = Handlebars.compile($("#side-nav").html());
    GridView.prototype.imageViewTpl = Handlebars.compile($("#image-view").html());

    var dropzoneTmpl = document.getElementById('dz-preview-template').innerHTML; 
    
    //var slider = new PageSlider($('body'));

    service.initialize().done(function () {

        console.log("Service initialized");

        router.addRoute('', function() {
            //$('body').html(new HomeView(service).render().$el);
            var view = new HomeView(service);
            
            renderViewWithSideNav(view);
            view.continueRendering();
        });

        router.addRoute('accountSettings', function(id) {
          $('.side-nav').remove();
          $('#sidenav-overlay').remove();
          //slider.slidePageFrom(new AcSettingsView(service).render().$el,"right");
          $('body').html(new AcSettingsView(service).render().$el);
          $("div.drag-target").remove();
          //Materialize.updateTextFields();
        });

        router.addRoute('drawingBoard', function() {
            //$('body').html(new HomeView(service).render().$el);
            var view = new DrawView(service);
            renderViewWithSideNav(view);
            view.continueRendering();

            //$('#search-breadcrumbs.row').pushpin({ top: $("#search-breadcrumbs.row").offset().top, offset:"80px" });
            $("a[href='#newSearch']").addClass("active");
            $("a[href='#newSearch']").click(function(e){
              e.stopPropagation();
              e.preventDefault();
            });
            
        });

        router.addRoute('searchSettings', function() {
            //$('body').html(new HomeView(service).render().$el);
            var view = new SearchView(service);
            renderViewWithSideNav(view);
            view.continueRendering();
            //$('#search-breadcrumbs.row').pushpin({ top: $("#search-breadcrumbs.row").offset().top, offset:"80px" });
            $("a[href='#newSearch']").addClass("active");
            $("a[href='#newSearch']").click(function(e){
              e.stopPropagation();
              e.preventDefault();
            });
            
        });

        router.addRoute('searchProgress', function() {
            //$('body').html(new HomeView(service).render().$el);
            var view = new ProgressView(service);
            renderViewWithSideNav(view);
            view.continueRendering();
            //$('#search-breadcrumbs.row').pushpin({ top: $("#search-breadcrumbs.row").offset().top, offset:"80px" });
            $("a[href='#newSearch']").addClass("active");
            $("a[href='#newSearch']").click(function(e){
              e.stopPropagation();
              e.preventDefault();
            });
            
        });

        router.addRoute('searchResult', function() {
            //$('body').html(new HomeView(service).render().$el);
            var view = new ResultView(service);
            renderViewWithSideNav(view);
            view.continueRendering();
            //$('#search-breadcrumbs.row').pushpin({ top: $("#search-breadcrumbs.row").offset().top, offset:"80px" });
            $("a[href='#newSearch']").addClass("active");
            $("a[href='#newSearch']").click(function(e){
              e.stopPropagation();
              e.preventDefault();
            });
            
        });

        router.addRoute('publicGallery', function() {
            //$('body').html(new HomeView(service).render().$el);
            var view = new GridView(service, "publicGallery");
            renderViewWithSideNav(view);
            view.continueRendering();           
        });

        router.addRoute('publicAlbum', function() {
            //$('body').html(new HomeView(service).render().$el);
            var view = new GridView(service, "publicAlbum");
            renderViewWithSideNav(view);
            view.continueRendering();           
        });

        router.addRoute('myGallery', function() {
            //$('body').html(new HomeView(service).render().$el);
            var view = new GridView(service, "myGallery");
            renderViewWithSideNav(view);
            view.continueRendering();           
        });

        router.addRoute('myAlbum', function() {
            //$('body').html(new HomeView(service).render().$el);
            var view = new GridView(service, "myAlbum");
            renderViewWithSideNav(view);
            view.continueRendering();           
        });

        router.start();
    });

    /* --------------------------------- Event Registration -------------------------------- */
    //http://stackoverflow.com/questions/203198/event-binding-on-dynamically-created-elements
    /*$('body').on("click",function(){
      console.log(event.target);
      if(event.target==document.getElementById('sign-in')){
        signIn();
      } else if(event.target==document.getElementById('sign-out')){
        signOut();
      }else if($(event.target).hasClass('go-back')){
        window.history.back();
      }else if($(event.target).hasClass("sync")){
        actionQueue.process();
      }
      
    });*/

    $("body").on("click", "#sign-in", function(){signIn();});//;
    $("body").on("click", "#register", function(){register();});
    $("body").on("click", "#sign-out",function(){signOut();});
    $("body").on("click", ".sync", function(){actionQueue.process();});
    $("body").on("click", ".go-back", function(){
      window.history.back();
    });
    $("body").on("click", ".switch-lang", function(){
        var user = service.currentUser;
        if(user == undefined || user.language == undefined) return; //Shouldn't be undefined
        if(user.language === "en") {
            user.language = "zh";
        }else{
            user.language = "en";
        }
        //var lang = new Lang(user.language);
        service.updateUserInfo();
        window.location.reload(); 
       // Materialize.toast(lang.setSuccessMsg, 4000);
    });

    window.addEventListener("online", function(){
      console.log("Get online and process");
      actionQueue.process();
    });//, false
    window.addEventListener('offline', function(){
    actionQueue.saveActions();}); //unload??
      
    window.addEventListener('onBeforeUnload', function(){
    actionQueue.saveActions();});

    /* ---------------------------------- Local Functions ---------------------------------- */
    function renderViewWithSideNav(view){
        if($('.side-nav').length){
          //$('.button-collapse').sideNav('hide');//Triggers "click" ? Caution: infinite loop!
          $('.side-nav').remove();
          $('#sidenav-overlay').remove();
        }

        //slider.slidePageFrom(view.render().$el,"left");
        $('body').html(view.render().$el);
        console.log(service.currentUser);

        $('header').prepend(view.renderSideNav());

        /*
        $('.dropdown-button').dropdown({
            inDuration: 300,
            outDuration: 225,
            constrain_width: false, // Does not change width of dropdown to that of the activator
            hover: true, // Activate on hover
            gutter: 0, // Spacing from edge
            belowOrigin: false, // Displays dropdown below the button
            alignment: 'left' // Displays dropdown with edge aligned to the left of button
        });
        */

        $("div.drag-target").remove();
        $('.button-collapse').sideNav({
            menuWidth: 300, // Default is 240
            edge: 'left', // Choose the horizontal origin
            //closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
          }
        );
        $('.modal-trigger').leanModal();
    }

    var signOut = function(){
      service.logOut();
      console.log(service.currentUser);
      renderViewWithSideNav(new HomeView(service));
    };

    var signIn = function(){
      service.authenticate($("#login-email").val().trim(),$("#login-password").val().trim()); 
    };

    var register = function(){
        console.log("registering!");
        var error = false; 
      if($("#register-username").val().trim()!==""){
            //user.name=$("#username").val().trim();
            if($("#username").hasClass("invalid")){
                $("#username").removeClass("invalid");
            }
            $("#username").addClass("valid");
        }else{
            $("#username").addClass("invalid");
            error=true;
        }   
        //if($("#old-password").val().trim() == user.password){
        if($("#register-password").val().trim()!==""){
            if($("#register-password").val().trim() == $("#register-password-2").val().trim()){
                //user.password = $("#register-password").val().trim();
                if($("#register-password").hasClass("invalid")){
                    $("#register-password").removeClass("invalid");
                }
                if($("#register-password-2").hasClass("invalid")){
                    $("#register-password-2").removeClass("invalid");
                }
                $("#register-password").addClass("valid");
                $("#register-password-2").addClass("valid");
            }else{
                error=true;
                $("#register-password").addClass("invalid");
                $("#register-password-2").addClass("invalid");
            }
        }
        if(!error){
            service.register($("#register-email").val().trim(), $("#register-username").val().trim(), $("#register-password").val().trim(), $("input[name='lang']:checked").val()); 
        }
    };
