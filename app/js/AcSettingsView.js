var AcSettingsView = function (service) {
    

    
	this.render = function() {
        var user = service.currentUser;
        var lang = new Lang(user.language);
        var isLoggedIn = user.name != "";
    	this.$el.html(this.template({lang:lang, user: user, isLoggedIn: isLoggedIn})); 
        $('#choose-'+user.language, this.$el).attr("checked",true);     
        /*
        Concerning boolean attributes, consider a DOM element defined by the HTML markup <input type="checkbox" checked="checked" />, and assume it is in a JavaScript variable named elem:
        elem.checked                            true (Boolean) Will change with checkbox state
        $( elem ).prop( "checked" )             true (Boolean) Will change with checkbox state
        elem.getAttribute( "checked" )          "checked" (String) Initial state of the checkbox; does not change
        $( elem ).attr( "checked" ) (1.6)       "checked" (String) Initial state of the checkbox; does not change
        $( elem ).attr( "checked" ) (1.6.1+)    "checked" (String) Will change with checkbox state
        $( elem ).attr( "checked" ) (pre-1.6)   true (Boolean) Changed with checkbox state
        */ 
    	return this;
	};

	this.resetUser = function() {

        var user = service.currentUser;
        var lang = new Lang(user.language);

        var error = false; 

        if($("#username").val().trim()!=""){
            user.name=$("#username").val().trim();
            if($("#username").hasClass("invalid")){
                $("#username").removeClass("invalid");
            }
            $("#username").addClass("valid");
        }else{
            $("#username").addClass("invalid");
            error=true;
        }

        user.name = user.name.replace(" ", "_");

        //if($("#old-password").val().trim() == user.password){
            if($("#new-password").val().trim()!=""){
                if($("#new-password").val().trim() == $("#new-password-2").val().trim()){
                    user.password = $("#new-password").val().trim();
                    if($("#new-password").hasClass("invalid")){
                        $("#new-password").removeClass("invalid");
                    }
                    if($("#new-password-2").hasClass("invalid")){
                        $("#new-password-2").removeClass("invalid");
                    }
                    $("#new-password").addClass("valid");
                    $("#new-password-2").addClass("valid");
                }else{
                    error=true;
                    $("#new-password").addClass("invalid");
                    $("#new-password-2").addClass("invalid");
                }
            }
            if($("#old-password").hasClass("invalid")){
                $("#old-password").removeClass("invalid");
            }
            //$("#old-password").addClass("valid");
        //}else{
            //$("#old-password").addClass("invalid");
            //error=true;
        //}

        if(!error && $("form input[name='lang']:checked").length){
            user.language = $("form input[name='lang']:checked").val();
            lang = new Lang(user.language);
            console.log(user.language);
            Materialize.toast(lang.setSuccessMsg, 4000);

            service.updateUserInfo();
            return;
        }else{
            Materialize.toast(lang.noChangeMsg, 4000);
        }
	};

	this.initialize = function () {
        // Define a div wrapper for the view (used to attach events)
        this.$el = $('<div/>');
        this.$el.on('click', '#submit-account-settings', this.resetUser);
        this.render();
    };

    this.initialize();
}