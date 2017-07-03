var EnglishLang = {
	//Navbar sideNav and page names
	elefindBrand:"Elefind",
	publicGallery:"Public Sketch Gallery",
	publicAlbum:"Public Album",
	publicMatches:"Published Results [N/A]",
	newSearch:"New Search",
	myGallery:"My Sketch Gallery",
	myAlbum:"My Photo Album",
	history:"History",
	about:"About us",
	privateAlbum:"Private Album",
	introduction:"Intro to Elefind",
	//User
	loginText:"Log in to explore more",
	email:"Email",
	signOut:"Sign out",
	signIn:"Sign In",
	accountSettings:"Account",
	register:"Register",
	username:"Username",
	password:"Password",
	oldPassword:"Old Password",
	newPassword:"New Password",
	//Utilities
	submit:"Submit",
	confirm:"Confirm",
	//feedback
	setSuccessMsg:"Modification saved!",
	noChangeMsg:"No new settings.",
	greetUser:"Welcome back,",
	wrongOldPassword:"Password doesn't match.",
	imageSaved:"Image saved!",
	//drawing board
	applyRatio:"Apply",
	//searchSettings
	maxPatchSize:"Patch Area",
	maxPatchSizeExpl:"It controls how finely the searching process is, and it also greatly affects the speed of searching. Find your balance.",
	patchSmall:"Fine",
	patchMedium:"Medium",
	patchNoRestrict:"Fast",
	centerPos:"Center Position",
	centerPosExpl:"Tell us which part of the target you are drawing. X means horizontal distence from the left, and Y means vertical distance from the top, relative to the dimension of the target.",
	searchMethod:"Search Method",
	searchMethodExpl:"Choose what value of the pixels' color you want to base on to search.",
	RGB:"RGB value",
	HSB:"HSB value",
	greyScale:"Grey Scale",
	preprocessing:"Preprocessing Method",
	preprocessingExpl:"Choose the preprocessing method you want to apply to each candidate photo.",
	equalize:"Equalization",
	smooth:"Smooth (not implemented)",
	compress:"Compress",
	maxAmRate:"Maximum Amplification Rate",
	maxAmRateExpl:"Choose how much larger you expect your target to be ??? how to express it?.",
	maxFolds:"Maximum Folds",
	maxFoldsExpl:"Choose how much larger at most you expect your target to be than your sketch, measured by photo-size/sketch-size.",
	searchRegion:"Search Region",
	searchRegionExpl:"Specify the area of where the center of your draft can be, in percentile ralative to the width/height of the candidate photo.",
	slidingStep:"Sliding Step",
	slidingStepExpl:"Specify the sliding step length of each comparison. The smaller, the slower.",
	searchScope:"Searching Scope",
	searchScopeExpl:"Tell us where you expect to find your candidate.",
	targetTimeRange:"Time Range",
	targetTimeRangeExpl:"[Optional]Give us a period of time during which you think your target photo was uploaded or created a record. ",
	drawingHeader:"Draw your Impression",
	download:"download",
	saveToServer:"save to server",
	searchSettingsHeader:"Search Settings",
	progressHeader:"In Progress",
	resultHeader:"Result List",

	//imageDisplay
	by:"by",
	preview:"preview",
	author:"author",
	score:"score",
	title:"Title",

	//searchProgress
	startProcessingSketch: "Start processing sketch...",
	typicalMapGotten: "Processing sketch 50%...",
	startComparing: "Start comparing...",
	comparing: "Comparing",
	finishedComparing: "Finished!", 

	startProcessingSketchIcon: "place",
	typicalMapGottenIcon: "compare",
	startComparingIcon: "send",
	comparingIcon: "&#xE317;", //"keyboard_backspace",
	finishedComparingIcon: "&#xE877;",//"done_all", 

	//other
	copyrightText:"Copyright 2016",
	team:"Team",
	default:"default",
	none:"none",
	apply:"apply",
	welcome:"Welcome!",
	width:"width",
	height:"height",
	advanced:"advance",
	draw:"draw",
	settings:"settings",
	progress:"progress",
	result:"result",
	save:"save",
	next:"next",
	delete:"delete",
	from:"from",
	to:"to",
	

	retypePassword:"Retype Password",
	brokenImage:"",
	noTitle:"No Title",
	noAuthor:"Anonymous User",

	changeLang:"中文",

	tempRegisterDeclaration:"<span>This website is a <b>demo</b> site for Elefind. "+
	"Your email will NOT be used to verify your identity, "+
	"nor will it be used for any purposes other than logging into this platform. "+
	"Also, any information you give to Elefind can be access by its developers, "+
	"and we are not responsible for keeping your sketches, photos, etc secure or private. <br/>"+
	"Click REGISTER to acknowledge that you are fully aware of the statement above and are willing to create your acount.</span>",
	galleryNotice:"<span>Due to the limited space on server, files larger than 2M will be rejected. Administrators may also delete ANY file. </span>",

	clearCanvasNote:"Clears the canvas.",

	dzDefaultMsg:"Drop files here to upload, or click to choose",

	searchSettingsNotice:"",
	errorComparingIcon: "close",
	comparingError: "Searching ends with error",
	noInternetMsg:"",
	emptyDraftError:"You've uploaded an empty sketch.",
	illegalArgsError:"Bad searching config"
};


var ChineseLang = {
	//Navbar sideNav and page names
	elefindBrand:"寻象",
	newSearch:"发起搜索",
	myGallery:"我的画册",
	history:"搜索历史",
	about:"关于我们",
	//User
	signOut:"登出",
	username:"用户名",
	password:"密码",
	oldPassword:"旧暗号",
	newPassword:"新暗号",
	accountSettings:"用户设置",
	register:"注册",
	//Utilities
	submit:"提交",
	team:"团队",
	signIn:"登录",
	//feedback
	setSuccessMsg:"设置成功！",
	noChangeMsg:"没有新设置。",
	greetUser:"欢迎回来,",
	confirm:"确认",
	wrongOldPassword:"密码错误。",
	//other
	copyrightText:"2016 版权所有",
	welcome:"欢迎！",
	
	publicGallery:"公共画廊",
	publicAlbum:"公共相册",
	publicMatches:"Published Results[未开放]",
	loginText:"登录探索更多",
	email:"电子邮件",
	applyRatio:"应用尺寸",
	maxPatchSize:"色块大小",
	maxPatchSizeExpl:"It controls how finely the searching process is, and it also greatly affects the speed of searching. Find your balance.",
	patchSmall:"精细",
	patchMedium:"中等",
	patchNoRestrict:"快速",
	centerPos:"中心位置",
	centerPosExpl:"Tell us which part of the target you are drawing. X means horizontal distence from the left, and Y means vertical distance from the top.",
	searchMethod:"Search Method",
	searchMethodExpl:"Choose what value of the pixels' color you want to base on to search.",
	RGB:"RGB 值",
	HSB:"HSB 值",
	greyScale:"灰度",
	preprocessing:"处理方法",
	preprocessingExpl:"Choose the preprocessing method you want to apply to each candidate photo.",
	equalize:"Equalization",
	smooth:"Smooth (not implemented)",
	compress:"压缩",
	maxAmRate:"Maximum Amplification Rate",
	maxAmRateExpl:"Choose how much larger at most you expect your target to be.",
	maxFolds:"最大倍数",
	maxFoldsExpl:"Choose how much larger at most you expect your target to be, in the other way.",
	searchRegion:"中心范围",
	searchRegionExpl:"Specify the area of where the center of your draft can be, in percentile ralative to the width/height of the candidate photo.",
	slidingStep:"滑动步长",
	slidingStepExpl:"指出滑动窗口的步长。越小越慢。",
	searchScope:"搜索范围",
	searchScopeExpl:"告诉我们你觉得目标图片会在哪里。",
	default:"默认",
	none:"无",
	apply:"应用",
	width:"宽",
	height:"高",
	advanced:"高级",
	draw:"作画",
	settings:"设置",
	progress:"进度",
	result:"结果",
	save:"保存",
	next:"下一步",


	myAlbum:"我的相册",
	drawingHeader:"画出你的印象",
	download:"下载",
	saveToServer:"保存到云端",
	searchSettingsHeader:"搜索选项设置",
	progressHeader:"搜索中",
	resultHeader:"结果列表",
	introduction:"Intro to Elefind",

	privateAlbum:"个人相册",
	imageSaved:"已保存",
	by:"来自",
	preview:"预览",
	author:"作者",
	score:"得分",
	title:"标题",
	delete:"删除",
	from:"从",
	to:"到",
	retypePassword:"再次输入密码",
	brokenImage:"",
	noTitle:"无标题",
	noAuthor:"匿名用户",

	targetTimeRange:"时间范围",
	targetTimeRangeExpl:"[可选]Give us a period of time during which you think your target photo was uploaded or created a record. ",
	startProcessingSketch: "开始处理手绘...",
	typicalMapGotten: "手绘处理50%...",
	startComparing: "开始比较...",
	comparing: "比较中",
	finishedComparing: "完成!",
	startProcessingSketchIcon: "place",
	typicalMapGottenIcon: "compare",
	startComparingIcon: "send",
	comparingIcon: "&#xE317;", //"keyboard_backspace",
	finishedComparingIcon: "&#xE877;",//"done_all", 

	changeLang: "English",

	tempRegisterDeclaration:"<span>此网站是寻象<b>测试版</b>。"+
		"您的邮箱<i>不会</i>被用来验证身份，"+
		"也不会被用于除了登录本平台之外的其他目的。"+
		"同时，开发者可以接触你提供给本平台的任何信息，比如照片，手绘图等，"+
		"并且我们不会保证这些数据完好且不被公开。 <br/>"+
		"点击注册表明您以理解上述声明且愿意注册该账号。</span>",

	galleryNotice:"<span>Due to the limited space on server, 超过2M的文件会被退回。 管理员可能删除任何文件. </span>",

	clearCanvasNote:"会清空画板",

	dzDefaultMsg:"拖文件到此（或点击选择）上传",
	searchSettingsNotice:"",
	errorComparingIcon: "close",
	comparingError: "抱歉，搜索失败",
	noInternetMsg:"没有网络连接",
	emptyDraftError:"您上传了空的手绘",
	illegalArgsError:"搜索选项设置不当"

};






var Lang = function(language){
	if(language=="zh"){
		 return ChineseLang;
	}else{
		return EnglishLang;
	}
	/*
	this.fallback = "en";
	this.isCalling = false; 

	this.get = function(str){
		var hasLang = window.localStorage.getItem("local-language");
		var user = window.localStorage.getItem("elefindUser");

		if (typeof str === 'undefined') { 
			if(hasLang){
					return JSON.parse(hasLang);
			}else{
				if(!user){
				
					this.requestLang("sys", false);
					Materialize.toast("1 loading...", 4000); //what can I say here if I have no local language?  
					return;
				}else{
					this.requestLang(JSON.parse(user).language, false);
					Materialize.toast("2 loading...", 4000); //what can I say here if I have no local language?  
					return;
				}
			}
			
		}else{
			if(hasLang && JSON.parse(hasLang).language == str){
				return JSON.parse(hasLang);
			}else{
				this.requestLang(str, false); //TODO shall I distinguish these forms? 
				Materialize.toast("3 loading...", 4000); //what can I say here if I have no local language?  
				return;
			}
		}
		
	}

	this.requestLang = function(lang, alreadyHas){
		if(this.isCalling){
			return; 
		}
		this.isCalling = true; 
		var that = this;
		var dataToSend = {changeLang:lang};
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
            		
            		console.log("Language changed");
            		window.localStorage.setItem("local-language", JSON.stringify(data));
            		
            	},
            	error: function(jqXHR, textStatus, errorThrown){
                	console.log('ERRORS:' + textStatus +"| ErrorThrown"+errorThrown);
                	if(!hasConnection()){
                		console.log("Connection died");
                		window.alert("can't change language offline");
                		return;
                	}else{
                		console.log("failed");
                	}
            	},
            	complete: function(data){ //No matter error or success. 
            	 that.isCalling=false;                
            	}
    	});
	}

	this.get(language);
	*/
};
/*
*/



	
	







