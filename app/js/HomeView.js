var HomeView = function (service) {
    
    
	this.render = function() {

        var user = service.currentUser;
        var lang = new Lang(user.language);
        var isLoggedIn = user.name != "";

    	this.$el.html(this.template({lang:lang, user: user, isLoggedIn: isLoggedIn, header: {main: lang.introduction}})); 

        
        //$('content', this.$el).html(employeeListView.$el);    
        //console.log(user);  
    	return this;
	};

    this.renderSideNav = function(){
        var user = service.currentUser;
        var lang = new Lang(user.language);
        var isLoggedIn = user.name != "";
        return this.sideNavTpl({lang:lang, user: user, isLoggedIn: isLoggedIn});
    }

    this.continueRendering = function(){
        console.log("home continueRendering"); 
        $(document).ready(function(){
            $('.parallax').parallax();
        });
    }

	this.logOut = function() {
    	service.logOut();
        console.log(service.currentUser);
	};

	this.initialize = function () {
        // Define a div wrapper for the view (used to attach events)
        this.$el = $('<div/>');
        //this.$el.on("click", "'#sign-out", this.logOut);
        //this.render();
    };

    this.initialize();
}

function getRandomColor(){
    var i = Math.floor(Math.random()*13);
    switch(i){
        case 0:
            return '#311B92';
        case 1:
            return '#880E4F';
        case 2:
            return '#4A148C';

        case 3:
            return '#1A237E';

        case 4:
            return '#01579B';
        case 5:
            return '#006064';

        case 6:
            return '#004D40';

        case 7:
            return '#1B5E20';
        case 8:
            return '#827717';
        case 9:
            return '#F57F17';

        case 10:
            return '#BF360C';
        case 11:
            return '#3E2723';
        case 12:
            return '#263238';

        default: return '#000000'; 
    }
}