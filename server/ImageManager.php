<?php
	require "config.inc.php"; 

	$dataToReturn = array();

	if((isset($_POST["myGallery"])||isset($_POST["myAlbum"])) && isset($_POST["user"])){
		$user = $_POST['user'];

		if(isset($_POST["myGallery"])){
			$handle = opendir($privateDraftDir.$user['email']. DIRECTORY_SEPARATOR ."sketches");
			$sql = "SELECT * FROM ".$sketches." WHERE filename LIKE '";
		}else{
			$handle = opendir($privateDraftDir.$user['email']. DIRECTORY_SEPARATOR ."photos");
			$sql = "SELECT * FROM ".$photos." WHERE filename LIKE '";
		}
		

		$dataToReturn = array();

		// Create connection
		$conn = new mysqli($servername, $username, $password, $dbname);
		// Check connection
		if ($conn->connect_error) {
    		die("Connection failed: " . $conn->connect_error); //??? dies to which file? 
		} 

		
		$file=""; 
		

		$filePackage = array();

        if ( $handle ){
            while ( ( $file = readdir ( $handle ) ) !== false ){
            	$type  = pathinfo($file, PATHINFO_EXTENSION);//
            	if ( $file != '.' && $file != '..' && ($type == "jpg" || $type == "png" || $type == "jpeg" || $type == "gif")){

            		$sqlresult = $conn->query($sql.$file."'");

            		while($row = $sqlresult->fetch_assoc()) {        			
            			$fileinfo = array();

        				$fileinfo['filename']=$row['filename'];
        				$fileinfo['author']=$row['author']; //todo 
        				$fileinfo['authorname']=$row['authorname'];
        				$fileinfo['title']=$row['title'];
        				$fileinfo['visibility']=$row['visibility'];
        				$fileinfo['date'] = $row['date'];

        				array_push( $filePackage, $fileinfo);        	
    				}
                }
            }
        }

        usort($filePackage, function($a, $b) {
    		if(strcmp($a['date'], $b['date'])==0){
    			return strcmp($a['filename'], $b['filename']);
    		} else {
    			return strtotime($a['date']) - strtotime($b['date']); 
    		}
		});

        $dataToReturn['files'] = $filePackage;
        $dataToReturn['msg'] = "success"; 
        echo json_encode($dataToReturn); 

        $conn->close();

	}elseif(isset($_POST["saveDraft"]) && isset($_POST["user"]) && isset($_POST["draft"]) ){
		//should be the same as that in new search part...........
		
 		$draft = $_POST["draft"];
 		
 		$useremail = $_POST["user"]["email"];
 		
 		saveDraft($draft, $useremail, time());
 		
	}elseif(isset($_POST["deletePic"])){
		
		$rawPath = $_POST['deletePic'];//url("http://localhost/elefind/server/storage/users/zymdxlyx@sina.cn/sketches/zymdxlyx@sina.cn_1477905731.png")
		$filename = substr($rawPath, strpos($rawPath, "storage"));
		$filename = substr($filename, 0, strrpos($filename, '")'));
		//$filename = basename($filename);
		$filePath = str_replace("/",DIRECTORY_SEPARATOR, $filename); 
		$filename = basename($filePath); 

		// Create connection
		$conn = new mysqli($servername, $username, $password, $dbname);
		// Check connection
		if ($conn->connect_error) {
    		die("Connection failed: " . $conn->connect_error); //??? dies to which file? 
		} 

		if(strpos($filePath, "photos")){
			$sql = "DELETE FROM ".$photos." WHERE filename LIKE '";
		}else{
			$sql = "DELETE FROM ".$sketches." WHERE filename LIKE '";
		}
		
		$sqlresult = $conn->query($sql.$filename."'");

		//cho $sql.$filename."'"; 

		//if($sqlresult){
			//echo "SQL delete failed"; //no way to know if the entry in sql is deleted or not...
		//}else{
			if(!unlink($filePath)){
				echo "delete pic failed";
			}else{
				echo "success"; 
			}
		//}

		

 		$conn->close();

	}elseif((isset($_POST["publicAlbum"])||isset($_POST['publicGallery']))){
		if(isset($_POST["publicAlbum"])){
			$handle = opendir($publicPhotoDir);
			$sql = "SELECT * FROM ".$photos." WHERE filename LIKE '";
		}else{
			$handle = opendir($publicDraftDir);
			$sql = "SELECT * FROM ".$sketches." WHERE filename LIKE '";
		}
		

		$dataToReturn = array();

		// Create connection
		$conn = new mysqli($servername, $username, $password, $dbname);
		// Check connection
		if ($conn->connect_error) {
    		die("Connection failed: " . $conn->connect_error); //??? dies to which file? 
		} 

		$file=""; 
		

		$filePackage = array();

        if ( $handle ){
            while ( ( $file = readdir ( $handle ) ) !== false ){
            	$type  = pathinfo($file, PATHINFO_EXTENSION);//
            	if ( $file != '.' && $file != '..' && ($type == "jpg" || $type == "png" || $type == "jpeg" || $type == "gif")){

            		$sqlresult = $conn->query($sql.$file."'");

            		while($row = $sqlresult->fetch_assoc()) {        			
            			$fileinfo = array();

        				$fileinfo['filename']=$row['filename'];
        				$fileinfo['author']=$row['author'];//todo check
        				$fileinfo['authorname']=$row['authorname'];
        				$fileinfo['title']=$row['title'];
        				$fileinfo['visibility']=$row['visibility'];
        				$fileinfo['date'] = $row['date'];

        				array_push( $filePackage, $fileinfo);        	
    				}
                }
            }
        }

        usort($filePackage, function($a, $b) {
    		if(strcmp($a['date'], $b['date'])==0){
    			return strcmp($a['filename'], $b['filename']);
    		} else {
    			return strtotime($a['date']) - strtotime($b['date']); 
    		}
		});

        $dataToReturn['files'] = $filePackage;
        $dataToReturn['msg'] = "success"; 
        echo json_encode($dataToReturn); 

        $conn->close();

	}

	

	function saveDraft($draft, $useremail, $requestTime){

		global $privateDraftDir, $publicDraftDir, $servername, $username, $dbname, $password, $users, $sketches, $photos; //Oh shit! 
		
		$dataToReturn = array();

		// Create connection
		$conn = new mysqli($servername, $username, $password, $dbname);
		// Check connection
		if ($conn->connect_error) {
    		die("Connection failed: " . $conn->connect_error); //??? dies to which file? 
		} 

		$draft['base64str'] =  substr($draft['base64str'],stripos($draft['base64str'],",")+1); //get rid of "data:image/png;base64,"
		//echo $draft['base64str'];
 		//$requestTime = ;

 		$sql = "SELECT username FROM ".$users." WHERE email LIKE '".$useremail."'";
		$result = $conn->query($sql);

		$username = ""; 
		if($result->num_rows <= 0){
			//means unregistered user
			$draft["publish"]=true;
			$useremail="";
			$username="";
		}else{
			$row = $result->fetch_assoc();
			$username = $row['username']; 
		}

		$draftPath = "";
		$filename = "";
		$vis = "";
		$date = date("Y-m-d");
		$randInt = rand(1000,9999);

		$title = $draft['title']; 

		$stmt = $conn->prepare("INSERT INTO ".$sketches." (filename, author, authorname, visibility, title, date) VALUES (?, ?, ?, ?, ?,?)");
		$stmt->bind_param('ssssss', $filename, $useremail, $username, $vis, $title, $date);

		if($useremail!=""){
			$filename = $useremail."_".$requestTime.".png";
			$draftPath = $privateDraftDir.$useremail.DIRECTORY_SEPARATOR."sketches".DIRECTORY_SEPARATOR.$useremail."_".$requestTime.".png";
			$vis = "private";

			$ifp = fopen( $draftPath, "wb" ); 
    		fwrite( $ifp, base64_decode($draft['base64str']) ); 
    		fclose( $ifp ); 
 
    		$dataToReturn["draftPath"] = $draftPath; 
    		$stmt->execute();
		}

		if($draft["publish"]=="true"){ //why is it a string??? 
			$filename = $randInt."_".$requestTime.".png";
			$draftPath = $publicDraftDir.$filename;
			$vis = "public";
			$ifp = fopen( $draftPath, "wb" ); 
    		fwrite( $ifp, base64_decode( $draft['base64str']) ); 
    		fclose( $ifp ); 
    		if(!isset($dataToReturn["draftPath"])){
    			$dataToReturn["draftPath"] = $draftPath; 
    		}
    		//$stmt->bind_param('sss', $filename, $useremail, "public");//cannot pass parameter 4 by reference
    		$stmt->execute();
		}
		$conn->close();


		return $draftPath; 
	}

	//for sorting multidimensional array, see:
	//http://stackoverflow.com/questions/2699086/sort-multi-dimensional-array-by-value?rq=1
	/*
	Try a usort: If you are still on PHP 5.2 or earlier, you'll have to define a sorting function first:

	function sortByOrder($a, $b) {
    return $a['order'] - $b['order'];
	}

	usort($myArray, 'sortByOrder');
	Starting in PHP 5.3, you can use an anonymous function:
	
	usort($myArray, function($a, $b) {
    return $a['order'] - $b['order'];
	});
	And finally with PHP 7 you can use the "spaceship operator":

	usort($myArray, function($a, $b) {
	    return $a['order'] <=> $b['order'];
	});
	*/
	//and more at

	//http://stackoverflow.com/questions/96759/how-do-i-sort-a-multidimensional-array-in-php
	//
?>
