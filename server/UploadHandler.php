<?php
	require "ImageManager.php";

	$sep = "\\";

	//echo json_encode($_POST); 
	//echo json_encode($_FILES); 

	//{"uploadToPublicAlbum":{"name":["IMG_0708.JPG"],"type":["image\/jpeg"],"tmp_name":["D:\\wamp\\tmp\\phpA11B.tmp"],"error":[0],"size":[1127932]}}

	if((isset($_FILES["uploadToPublicAlbum"])||isset($_FILES["uploadToMyAlbum"]))&& isset($_POST["useremail"])){//? 

		if(isset($_FILES["uploadToMyAlbum"])){
			$paramName = "uploadToMyAlbum";
		}else{
			$paramName = "uploadToPublicAlbum";
		}

		//echo "good!";
		// Create connection
		$conn = new mysqli($servername, $username, $password, $dbname);
		// Check connection
		if ($conn->connect_error) {
    		die("Connection failed: " . $conn->connect_error); //??? dies to which file? 
		} 

		$useremail = $_POST["useremail"];
		if( $useremail != ''){
			$sql = "SELECT username FROM ".$users." WHERE email LIKE '".$useremail."'";
			$result = $conn->query($sql);
			if($result->num_rows <= 0){
				//means unregistered user
				$useremail="";				
			}
		}

		$filePrefix = ""; 
		$filename = "";
		$title =""; 
		$date = date("Y-m-d");

		if(isset($_FILES["uploadToMyAlbum"]) && $useremail !== ""){
			$vis = "private";
			$targetDir = $privatePhotoDir.$useremail."\\"."photos\\"; 
			//echo "to my album"; 
		}else{
			$vis = "public"; 
			$targetDir = $publicPhotoDir; 
		}
		
		$filePackage = array(); 

		$stmt = $conn->prepare("INSERT INTO ".$photos." (filename, author, visibility, title, date) VALUES (?, ?, ?, ?,?)");
		$stmt->bind_param('sssss', $filename, $useremail, $vis, $title, $date);
		//INSERT INTO `photos` (`id`, `filename`, `author`, `visibility`, `title`, `date`) VALUES (NULL, 'zymdxlyx@sina.cn_14780923090.jpg', 'zymdxlyx@sina.cn', '', 'Crazy', '2016-11-02');

		foreach ($_FILES[$paramName]["error"] as $key => $error) {
			//echo "in foreach"; 
	    	if ($error == UPLOAD_ERR_OK) {
	    		//echo "error ok"; 
	        	$tmp_name = $_FILES[$paramName]["tmp_name"][$key];
		        // basename() may prevent filesystem traversal attacks; --how? 
		        // further validation/sanitation of the filename may be appropriate
		        $name = basename($_FILES[$paramName]["name"][$key]);


		        //move_uploaded_file($tmp_name, "data/$name");
		        $imageFileType = strtolower(pathinfo($name,PATHINFO_EXTENSION)) ;
		        //echo $imageFileType; 
		        // Check file size
				if ($_FILES[$paramName]["size"][$key] < 10 * 1024 * 1024) { //unit: bytes
					//echo "small enough"; 
				    // Allow certain file formats
					if($imageFileType == "jpg" || $imageFileType == "png" || $imageFileType == "jpeg"
					|| $imageFileType == "gif" ) {
						$title = $name; 
				        if($useremail==""){
				        	$filePrefix = rand(1000,9999);
				        }else{
				        	$filePrefix = $useremail; 
				        }
				        $filename = $filePrefix."_".time().$key.".".$imageFileType;
				        $stmt->execute();

				        $fileinfo['filename']=$filename;
        				$fileinfo['author']=$useremail;
        				$fileinfo['title']=$title;
        				$fileinfo['visibility']=$vis;
        				$fileinfo['date'] = $date;

        				array_push( $filePackage, $fileinfo);
					    move_uploaded_file($tmp_name, $targetDir.$filename);
					    //echo "success"; 
					}
				}
				
	    	}
		}

		echo json_encode($filePackage); 
		$conn->close();

	}

?>