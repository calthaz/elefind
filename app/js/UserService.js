
var defaultSettings = {
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
		};

/*currentUser.logOut=function(){

	this.name="";
	this.email="";
	this.password="";
	this.profilePic="";
	this.language="zh";
	this.draftFolderURL="undecided";
	this.photoAlbumURL="undecided";
	this.searchSettings= defaultSettings;
	this.friends="";
	this.priviledges="";

}*/



var UserService = function(){

	this.initialize=function(){

		var deferred = $.Deferred();

		//ajax recheck user

		var curSettings = {
			searchMethod:1,
			preprocessing:3,
			maxPatchSize:1250,
			maxAmRate:2,
			maxFolds:2,
			centerX:0.5,
			centerY:0.5,
			searchW:0.2,
			searchH:0.2,
			probFunc:1,
		}

		this.superUser = {
			name:"admin",
			email:"zymdxlyx@sina.cn",
			password:"tempPass",
			profilePic:"img/admin.png",
			language:"en",
			draftFolderURL:"undecided",
			photoAlbumURL:"undecided",
			searchSettings: curSettings,
			friends:"",
			priviledges:"all",
			logOut: function(){

				this.name="";
				this.email="";
				this.password="";
				this.profilePic="";
				this.language="zh";
				this.draftFolderURL="undecided";
				this.photoAlbumURL="undecided";
				this.searchSettings= defaultSettings;
				this.friends="";
				this.priviledges="";

			},
			resetSettings: function(){
				this.searchSettings = defaultSettings;
			}
		}

		if(window.localStorage.getItem("elefindUser")){
			this.currentUser=JSON.parse(window.localStorage.getItem("elefindUser"));
			console.log("Has user");
		}else{
			window.localStorage.setItem("elefindUser", JSON.stringify(this.superUser));
			this.currentUser=JSON.parse(window.localStorage.getItem("elefindUser"));
			console.log("add user");
		}

		if(window.localStorage.getItem("userSettings")){
			//this.currentUser=JSON.parse(window.localStorage.getItem("elefindUser"));
			//Er, use this to display the settings form
			console.log("Has user settings");
		}else{
			window.localStorage.setItem("userSettings", JSON.stringify(defaultSettings));
			//this.currentUser=JSON.parse(window.localStorage.getItem("elefindUser"));
			console.log("add settings");
		}

		deferred.resolve();
        return deferred.promise();
	}

	this.getCurSettings=function(){
		return this.currentUser.searchSettings;
	}

	this.logOut = function(){
		this.currentUser.name="";
		this.currentUser.email="";
		this.currentUser.password="";
		this.currentUser.profilePic="";
		this.currentUser.language="zh";
		this.currentUser.draftFolderURL="undecided";
		this.currentUser.photoAlbumURL="undecided";
		this.currentUser.searchSettings= defaultSettings;
		this.currentUser.friends="";
		this.currentUser.priviledges="";
		window.localStorage.setItem("elefindUser", JSON.stringify(this.currentUser));
	}

	this.printlogOut = function(){
		console.log(this.currentUser.name);
		//window.localStorage.setItem("elefindUser", JSON.stringify(this.currentUser));
	}

	this.updateUserInfo = function(){
		//can be delayed
		window.localStorage.setItem("elefindUser", JSON.stringify(this.currentUser));
		actionQueue.addAction("editProfile", "");
		//
	}

	this.authenticate = function(email, password){
		//requires instant connection
		//some ajax
		//window.localStorage.setItem("elefindUser", JSON.stringify(this.superUser));
		if(!hasConnection()){
			window.alert(lang.noInternetMsg+"No internet");
			return;
		}

		userLogin = {
			userLogin:{
				email: email,
				password: password
			}
			
		}

		var that = this; 

		$.ajax({
            url: '../server/UserManager.php',  //creat get =xxx.php
            //beforeSend: function (request) //must have ??
            //{
                //request.setRequestHeader("X-CSRF-TOKEN",$('input[name=_token]').val());
            //},
            type: 'POST',
            data: userLogin,
            cache: false,
            dataType: 'text',
            //processData: false,
            //contentType: false,
            success:function(data, textStatus, jqXHR){
            	console.log(data);
            	data=JSON.parse(data);
            	if(data.msg =="success"){
            		//window.alert("you are logged in!");
            		window.localStorage.setItem("elefindUser", JSON.stringify(data.user));
            		that.currentUser=data.user;
            		//location.reload();//!! Too violent
            		$(window).trigger('hashchange');//
            		Materialize.toast(Lang(data.user.language).welcome, 4000);
            		return true;
            	}else if(data.msg == "denied"){
            		window.alert("wrong password.");
            		return false;
            	}else{
            		window.alert("You are not logged in, but I don't know why. Error: "+data.msg);
            	}
                console.log(data);
            },
            error: function(jqXHR, textStatus, errorThrown){
                console.log('ERRORS:' + textStatus +"errorThrown"+errorThrown);
                console.log("jqXHR"+jqXHR);
                return false;
            },
            complete: function(data){ //No matter error or success.
                
            }
        });
	}

	this.register = function(email, username, password, language){
		//requires instant connection
		//some ajax
		//window.localStorage.setItem("elefindUser", JSON.stringify(this.superUser));
		if(!hasConnection()){
			window.alert(lang.noInternetMsg+"No internet");
			return;
		}

		data = {
			userRegister:{
				email: email,
				password: password,
				username: username,
				language: language
			}
			
		}

		var that = this; 

		$.ajax({
            url: '../server/UserManager.php',  //creat get =xxx.php
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
            	if(data == "duplicate"){
            		window.alert("This email has been registered.");
            		return;
            	}
            	data=JSON.parse(data);
            	if(data.msg =="success"){
            		//window.alert("you are logged in!");
            		window.localStorage.setItem("elefindUser", JSON.stringify(data.user));
            		that.currentUser=data.user;
            		//location.reload();//!! Too violent
            		$(window).trigger('hashchange');//
            		Materialize.toast(Lang(data.user.language).welcome, 4000);

            	}else{
            		window.alert("You are not registered, but I don't know why. Error: "+data.msg);
            	}
                console.log(data);
            },
            error: function(jqXHR, textStatus, errorThrown){
                console.log('ERRORS:' + textStatus +"errorThrown"+errorThrown);
                console.log("jqXHR"+jqXHR);

            },
            complete: function(data){ //No matter error or success.
                
            }
        });
	}
}