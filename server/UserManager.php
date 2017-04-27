
<?php
/*<html>
<body>

<form method="post" action="<?php echo $_SERVER['PHP_SELF'];?>">
Name: <input type="text" name="email">
password: <input type="text" name="password">
<input type="submit">
</body>
</html>
</form>*/

	//echo "I'm here!!";
    //class UserManager{
	require "config.inc.php"; 

	//public function __construct(){
	// Create connection
	$conn = new mysqli($servername, $username, $password, $dbname);
	// Check connection
	if ($conn->connect_error) {
    	die("Connection failed: " . $conn->connect_error); //??? dies to which file? 
	} 
	//}

	//public function 

	if(isset($_POST['userLogin'])){//userLogin
		$info = $_POST['userLogin'];//array('email'=>$_POST['email'], 'password' => $_POST['password']);//////
		$data = array();

		$sql = "SELECT password FROM ".$users." WHERE email LIKE '".$info['email']."'";
		$result = $conn->query($sql);

		$msg="default";
			
		if ($result->num_rows > 0) {
   			// output data of each row
    		while($row = $result->fetch_assoc()) {        			
        		if($row['password']==md5($info['password'])){
        			$msg = "success";
        			$sql = "SELECT * FROM ".$users." WHERE email LIKE '".$info['email']."'";
        			$result = $conn->query($sql);
        			$row = $result->fetch_assoc();
        			$user['name']=$row['username'];
        			//$user['password']=$row['password'];
        			$user['email']=$row['email'];
        			$user['profilePic']=$row['profile_pic_url'];
        			$user['priviledges']=$row['priviledges'];
        			$user['language'] = $row['language'];
        			$user['draftFolderURL'] = $row['server_draft_folder'];
        			$user['photoAlbumURL'] = $row['server_photo_folder'];
        			$data['user'] = $user;

        		}else{
        			$msg = "denied";
        		}
    		}
		} else {
    		$msg = "user not found";
		}

		$data['msg']=$msg;

		echo json_encode($data);
			//echo $msg;
	}elseif(isset($_POST['editProfile'])){
		//expected: email password | username language profile-img-Base64 search-settings priviledge
		$user = $_POST['editProfile'];
		$data = array();
		$msg = "default";

		//$sql = "UPDATE users SET password = '".md5('test')."' WHERE email = 'admin@elefind.com'";
		$sql = "SELECT username FROM ".$users." WHERE email LIKE '".$user['email']."'";
		$result = $conn->query($sql);
		
		if($result->num_rows > 0){
			$sql = "UPDATE users SET 
			username = '".$user['name']."', 
			priviledges = '".$user['priviledges']."', 
			language = '".$user['language']."'
			  WHERE email LIKE '".$user['email']."'";
			$result = $conn->query($sql);
			if($result){
				$msg="success";
			}else{
				$msg="SQL error";
			}
		}else{
			$msg = "No such user found.";
		}

		$data["msg"]=$msg;
		echo json_encode($data);

	}elseif(isset($_POST['userRegister'])){
		$info = $_POST['userRegister'];

		$sql = "SELECT password FROM ".$users." WHERE email LIKE '".$info['email']."'";
		$result = $conn->query($sql);
		if($result->num_rows > 0){

			die("duplicate");

		}

		if(!isset($info['language'])){
			// break up string into pieces (languages and q factors)
            preg_match_all('/([a-z]{1,8}(-[a-z]{1,8})?)\s*(;\s*q\s*=\s*(1|0\.[0-9]+))?/i', $_SERVER['HTTP_ACCEPT_LANGUAGE'], $lang_parse);

            if (count($lang_parse[1])) {
                // create a list like "en" => 0.8
                $langs = array_combine($lang_parse[1], $lang_parse[4]);
        
                // set default to 1 for any without q factor
                foreach ($langs as $lang => $val) {
                    if ($val === '') $langs[$lang] = 1;
                }

                // sort list based on value 
                arsort($langs, SORT_NUMERIC);

                foreach ($langs as $lang => $val) {
                	if (!strpos($lang, '-')) {
                    	$info['language'] = $lang;
                    	break;
                	}
            	}
            }

		}

		mkdir($userDir.$info['email']);
		mkdir($userDir.$info['email'].DIRECTORY_SEPARATOR."sketches");
		mkdir($userDir.$info['email'].DIRECTORY_SEPARATOR."photos");

		//{"email":"mein@ele.com","password":"t","username":"julia","language":"zh"}
		//$stmt = $conn->prepare("INSERT INTO users (username, password, email, title, date) VALUES (?, ?, ?, ?,?)");
		//$stmt->bind_param('sssss', $filename, $useremail, $vis, $title, $date);profile_pic_url, '".$profilePicDir.$info['email']."', 

		$sql = "INSERT INTO ".$users." (username, password, email, language, reg_date, priviledges, server_draft_folder, server_photo_folder) VALUES ('"
		.htmlspecialchars($info['username'], ENT_SUBSTITUTE)."', '".md5($info['password'])."', '"
		.$info['email']."', '".$info['language']."', '"
		.date('Y-m-d')."', 'user', '"
		.$userDir.$info['email'].DIRECTORY_SEPARATOR."sketches', '".$userDir.$info['email'].DIRECTORY_SEPARATOR."photos')"; 

		$result = $conn->query($sql);

		$data["sql1"] = $sql; 

		$sql = "INSERT INTO ".$usersearchsettings." (email, searchMethod, preprocessing, maxAmRate, maxFolds, centerX, centerY, searchW, searchH, slidingStep, maxPatchSize) VALUES ('".$info['email']."', '1', '3', '2', '2', '0.5', '0.5', '0.2', '0.2', '4', '1250')";
		$result = $conn->query($sql);

		$sql = "SELECT * FROM ".$users." WHERE email LIKE '".$info['email']."'";
		$result = $conn->query($sql);
		
		if($result){
			$msg = "success";

			$row = $result->fetch_assoc();
			$user['name']=$row['username'];
			//$user['password']=$row['password'];
			$user['email']=$row['email'];
			$user['profilePic']=$row['profile_pic_url'];
			$user['priviledges']=$row['priviledges'];
			$user['language'] = $row['language'];
			$user['draftFolderURL'] = $row['server_draft_folder'];
			$user['photoAlbumURL'] = $row['server_photo_folder'];
			$data['user'] = $user;

			
		}else{
			$msg = "SQL failed";
		}

		$data["msg"]=$msg;
		$data["info"]=$info;

		echo json_encode($data);

	}
	

	$conn->close();

	//mkdir() upon registration 
?>


