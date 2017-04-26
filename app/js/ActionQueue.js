var ActionQueue = function(){
/*  
http://stackoverflow.com/questions/2858121/convert-comma-separated-string-to-array
656
down vote
accepted
var array = string.split(',');
MDN reference, mostly helpful for the possibly unexpected behavior of the limit parameter. (Hint: "a,b,c".split(",", 2) comes out to ["a", "b"], not ["a", "b,c"].)
*/
    if(window.localStorage.getItem("ActionQueue")==null){
        this.queue=[];
    }else{
        this.queue=window.localStorage.getItem("ActionQueue").split(",");
    }
    
    console.log(this.queue);

    this.addAction = function(title, data){
        this.queue.push(JSON.stringify({title: title, data: data}));
        console.log(this.queue);
        if(hasConnection()){
            this.process();
        }else{
            
        }
        
    };

    this.process = function(){

        var that = this;
        //var pointer = -1;
        var initialLength = this.queue.length; 

        for (var i=0; i<initialLength; i++) {
            var action = JSON.parse(this.queue.shift());
            //always remove this action
            //that.queue.splice(0, 1); //?? looks so strange //here "this" means the ajax object!!
            //http://www.w3schools.com/js/js_array_methods.asp
      var dataToSend = {};
            switch(action.title){
          
                case('editProfile'):
                    dataToSend = { editProfile : JSON.parse(window.localStorage.getItem("elefindUser"))};
                    //var status = false;
                    
                    $.ajax({
                        url: '../server/UserManager.php',  //creat get =xxx.php
                        //beforeSend: function (request) //must have ??
                        //{
                            //request.setRequestHeader("X-CSRF-TOKEN",$('input[name=_token]').val());
                        //},
                        type: 'POST',
                        data: dataToSend,
                        cache: false,
                        dataType: 'text',
                        //processData: false,
                        //contentType: false,
                        success:function(data, textStatus, jqXHR){
                            console.log(data);
                            data=JSON.parse(data);
                            if(data.msg =="success"){
                                console.log("Profile updated");
                            }else {
                                console.log(data.msg);
                            }
                            //status = true;
                            //that.queue.splice(i, 1); 
                            //?? looks so strange 
                            //here "this" means the ajax object 
                            //http://www.w3schools.com/js/js_array_methods.asp
                            //Er, asychronize means they will get back later, when i is no longer the value this action took place
                            //i--;
                        },
                        error: function(jqXHR, textStatus, errorThrown){
                            that.queue.push(JSON.stringify({title: "editProfile", data: ""}));
                            console.log('ERRORS:' + textStatus +"| ErrorThrown"+errorThrown);
                            if(!hasConnection()){
                                console.log("Connection died");
                                return;
                            }else{
                                console.log("task failed, proceed to the next task");
                            }
                            
                        },
                        complete: function(data){ //No matter error or success.                
                        }
                    });

                    //if(status){
                        
                    //}
                    break;
                case('changeLang'):
                    dataToSend = {changeLang:action.data}; 
                    $.ajax({
                        url: '../server/lang.php',  //creat get =xxx.php
                        //beforeSend: function (request) //must have ??
                        //{
                            //request.setRequestHeader("X-CSRF-TOKEN",$('input[name=_token]').val());
                        //},
                        type: 'POST',
                        data: dataToSend,
                        cache: false,
                        dataType: 'text',
                        //processData: false,
                        //contentType: false,
                        success:function(data, textStatus, jqXHR){
                            console.log(data);
                            data=JSON.parse(data);
                            if(data.msg =="success"){
                                console.log("Language changed");
                                window.localStorage.setItem("Language", data.lang);
                            }else {
                                console.log(data.msg);
                            }
                        },
                        error: function(jqXHR, textStatus, errorThrown){
                            console.log('ERRORS:' + textStatus +"| ErrorThrown"+errorThrown);
                            that.addAction('editProfile',"");
                            if(!hasConnection()){
                                console.log("Connection died");
                                return;
                            }else{
                                console.log("task failed, proceed to the next task");
                            }
                        },
                        complete: function(data){ //No matter error or success.                
                        }
                    });
                    break;
                case('deleteCloudImage'):
                    break;
                case('uploadNewHistory'):
                    break;
                case('publishPic'):
                    break;
                default:
            }
        }
    };

    this.saveActions = function(){
        console.log("saveActions"+this.queue.length);
        console.log(JSON.stringify(this.queue));//["{\"title\":\"editProfile\",\"data\":\"\"}","{\"title\":\"editProfile\",\"data\":\"\"}","{\"title\":\"editProfile\",\"data\":\"\"}"]
        console.log(this.queue.toString());//{"title":"editProfile","data":""},{"title":"editProfile","data":""},{"title":"editProfile","data":""}
        if(this.queue.length>0){
            //window.localStorage.setItem("ActionQueue", this.queue.toString());
        }
    };
};

function hasConnection() {
    /*var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection'; //todo: only in corvoda &&navigator.connection.type==Connection.NONE
    */
    if(navigator.onLine === false || navigator.connection!==null){
        return false;
    }else{
        return true;
    }
}

var action = function(url, title, data){
    var dataToSend = {title:data};
    $.ajax({
            url: url,  //creat get =xxx.php
            //beforeSend: function (request) //must have ??
            //{
                //request.setRequestHeader("X-CSRF-TOKEN",$('input[name=_token]').val());
            //},
            type: 'POST',
            data: dataToSend,
            cache: false,
            dataType: 'text',
            //processData: false,
            //contentType: false,
            success:function(data, textStatus, jqXHR){
                console.log(data);
                data=JSON.parse(data);
                if(data.msg =="success"){
                    window.alert("you are logged in!");
                    window.localStorage.setItem("elefindUser", JSON.stringify(data.user));
                }else if(data.msg == "denied"){
                    window.alert("wrong password.");
                }else{
                    window.alert("You are not logged in, but I don't know why. Error: "+data.msg);
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
};

/*-------------------------
action: title, data, 

editProfile profile
?? sychronize from server?? 
changeLang newLang
deleteCloudImage path, filename
uploadNewHistory history
publishPic path, filename */