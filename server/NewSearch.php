<?php

	$progressFile ="";
	$resultFile = "";
	$msg = ""; 

	require "ImageManager.php"; 

 	if(isset($_POST["searchConfig"]) && isset($_POST["user"]) && isset($_POST["draft"]) ){//

 		// Create connection
		$conn = new mysqli($servername, $username, $password, $dbname);
		// Check connection
		if ($conn->connect_error) {
    		die("Connection failed: " . $conn->connect_error); //??? dies to which file? 
		} 

		$requestTime = time();

		$draft = $_POST["draft"];
 		
 		$useremail = $_POST["user"]["email"];

 		if($draft['type']==="new-sketch"){
 			$draftPath = saveDraft($draft, $useremail, $requestTime);
 		}else{ 			
 			$rawPath = $draft['src'];//url("http://localhost/elefind/server/storage/users/zymdxlyx@sina.cn/sketches/zymdxlyx@sina.cn_1477905731.png")
 			$filename = substr($rawPath, strpos($rawPath, "storage"));
 			$filename = substr($filename, 0, strrpos($filename, '")'));
 			//$filename = basename($filename);
 			$draftPath = str_replace("/",DIRECTORY_SEPARATOR, $filename); 
 		}
		
		$randInt = rand(1000,9999); 

		$dataToReturn = array();

 		$searchConfig = $_POST["searchConfig"];

		if($useremail==""){
			$filename = $randInt."_".$requestTime.".txt";
		}else{
			$filename = $useremail."_".$requestTime.".txt";
		}
 		
 		$dataToReturn["relatingFileName"] = $filename; 

 		$settings  = fopen($settingsDir.$filename, "w") or die("Unable to open file!");

 		$sql = "UPDATE ".$usersearchsettings." SET ";

 		/* 
			username = '".$user['name']."', 
			priviledges = '".$user['priviledges']."', 
			language = '".$user['language'].
			"'WHERE email LIKE '".$useremail."'";
			$result = $conn->query($sql);

		*/
		if(strpos($draft['type'],"sketch")){
			$txt = "MANAGER_TYPE: ImprSearch\r\n";
		}else{
			$txt = "MANAGER_TYPE: FastQuerying\r\n";
		}
		fwrite($settings, $txt);
 		foreach($searchConfig as $itemName => $value) {
    		$txt = $itemName.":".$value."\r\n";
    		$sql = $sql.$itemName. " = '" . $value . "', ";
    		fwrite($settings, $txt);
		}
		$txt = "progressPlace".":".$progressDir.$filename."\r\n";
		fwrite($settings, $txt);
		$txt = "outputPlace".":".$resultDir.$filename."\r\n";
		fwrite($settings, $txt);
		$txt = "draftPath".":".$draftPath."\r\n";
		fwrite($settings, $txt);
		$txt = "candiFolder".":".$publicPhotoDir."\r\n";
		fwrite($settings, $txt);

		fclose($settings);

		$sql = substr($sql, 0, strlen($sql)-2);
		$sql = $sql. " WHERE email LIKE '".$useremail."'";
		$result = $conn->query($sql);
		if($result){
			$msg="success";
		}else{
			$msg="SQL error: SQL: ".$sql;
		}
		

		//TODO: update the search preference
		$dataToReturn["msg"] = $msg;
 		
 		echo json_encode($dataToReturn);

 	}elseif(isset($_POST["startSearch"]) && isset($_POST["relatingFileName"])){
 		//how do I know where to get the progress??? 
 		//{startSearch: "start", relatingFileName: that.relatingFileName },
 		$filename = $_POST["relatingFileName"];
 		$commandStr = 'java -cp ImprSearchJava'.DIRECTORY_SEPARATOR.'bin general.QueryAgent '.$settingsDir.$filename;
 		$output="";

 		exec($commandStr, $output);
 		//print_r($output); 
 		$result = file($resultDir.$_POST["relatingFileName"]);
 		
 		/*[0] => [storage\public_photos\running.jpg compared with 0zymdxlyx@sina.cn_1477905378.png-imp wins 1 color patches. Score:0.024926686217008796, 
 		storage\public_photos\salz dorm.JPG compared with 0zymdxlyx@sina.cn_1477905378.png-imp wins 1 color patches. Score:0.024926686217008796, 
 		storage\public_photos\salz-dorm-shrinked.jpg compared with 0zymdxlyx@sina.cn_1477905378.png-imp wins 1 color patches. Score:0.024926686217008796, 
 		storage\public_photos\zymdxlyx@sina.cn_14778130490.jpg compared with 0zymdxlyx@sina.cn_1477905378.png-imp wins 1 color patches. Score:0.024926686217008796, storage\public_photos\zymdxlyx@sina.cn_14778187281.jpg compared with 0zymdxlyx@sina.cn_1477905378.png-imp wins 1 color patches. Score:0.024926686217008796, 
 		storage\public_photos\P1160621.jpg compared with 0zymdxlyx@sina.cn_1477905378.png-imp wins 0 color patches. Score:0.0, 
 		storage\public_photos\map.jpg compared with 0zymdxlyx@sina.cn_1477905378.png-imp wins 0 color patches. Score:0.0, 
 		storage\public_photos\mushroom.jpg compared with 0zymdxlyx@sina.cn_1477905378.png-imp wins 0 color patches. Score:0.0, 
 		storage\public_photos\pixi.jpg compared with 0zymdxlyx@sina.cn_1477905378.png-imp wins 0 color patches. Score:0.0, 
 		storage\public_photos\salz train.JPG compared with 0zymdxlyx@sina.cn_1477905378.png-imp wins 0 color patches. Score:0.0, 
 		storage\public_photos\wattberg bird.jpg compared with 0zymdxlyx@sina.cn_1477905378.png-imp wins 0 color patches. Score:0.0, 
 		storage\public_photos\woman.png compared with 0zymdxlyx@sina.cn_1477905378.png-imp wins 0 color patches. Score:0.0, 
 		storage\public_photos\zymdxlyx@sina.cn_1477812492.jpg compared with 0zymdxlyx@sina.cn_1477905378.png-imp wins 0 color patches. Score:0.0, 
 		storage\public_photos\zymdxlyx@sina.cn_1477812846.jpg compared with 0zymdxlyx@sina.cn_1477905378.png-imp wins 0 color patches. Score:0.0, 
 		storage\public_photos\zymdxlyx@sina.cn_14778129960.jpg compared with 0zymdxlyx@sina.cn_1477905378.png-imp wins 0 color patches. Score:0.0, 
 		storage\public_photos\zymdxlyx@sina.cn_14778129961.jpg compared with 0zymdxlyx@sina.cn_1477905378.png-imp wins 0 color patches. Score:0.0, 
 		storage\public_photos\zymdxlyx@sina.cn_14778130450.jpg compared with 0zymdxlyx@sina.cn_1477905378.png-imp wins 0 color patches. Score:0.0, 
 		storage\public_photos\zymdxlyx@sina.cn_14778135810.jpg compared with 0zymdxlyx@sina.cn_1477905378.png-imp wins 0 color patches. Score:0.0, 
 		storage\public_photos\zymdxlyx@sina.cn_14778188190.jpg compared with 0zymdxlyx@sina.cn_1477905378.png-imp wins 0 color patches. Score:0.0, 
 		storage\public_photos\zymdxlyx@sina.cn_14778224580.jpg compared with 0zymdxlyx@sina.cn_1477905378.png-imp wins 0 color patches. Score:0.0, 
 		storage\public_photos\zymdxlyx@sina.cn_14778227890.jpg compared with 0zymdxlyx@sina.cn_1477905378.png-imp wins 0 color patches. Score:0.0]*/

 		$results = explode(', ', substr($result[0], 1, strpos($result[0], "]")-1)); //?why there is still a bracket if -2? 
 		//print_r($result);

 		$resultPackage = array();
 		$sql = "SELECT * FROM ".$photos." WHERE filename LIKE '";

 		for($i=0; $i<count($results); $i++){
 			$results[$i] = trim($results[$i]); 
 			$filename = substr($results[$i], 0, strpos($results[$i], " compared with")); 
 			$filename = basename($filename); //? not sure

 			$score = substr($results[$i], strpos($results[$i], ". Score:")+8); 
 			// Create connection
			$conn = new mysqli($servername, $username, $password, $dbname);
			// Check connection
			if ($conn->connect_error) {
	    		die("Connection failed: " . $conn->connect_error); //??? dies to which file? 
			} 

			$sqlresult = $conn->query($sql.$filename."'");

    		while($row = $sqlresult->fetch_assoc()) {        			
    			$fileinfo = array();

				$fileinfo['filename']=$row['filename'];
				$fileinfo['author']=$row['author'];
				$fileinfo['authorname']=$row['authorname'];
				$fileinfo['title']=$row['title'];
				$fileinfo['vis']=$row['visibility'];
				$fileinfo['date'] = $row['date'];
				$fileinfo['score'] = $score; 

				array_push( $resultPackage, $fileinfo);        	
			}
 		}

 		//shall I sort $resultPackage? though it should be already sorted... 

 		#foreach ($variable as $key => $value) {
 			# code...
 		#}
 		echo json_encode($resultPackage); 

 		//echo ;

 	}elseif(isset($_POST["getProgress"]) && isset($_POST["relatingFileName"])){

 		$progress = file($progressDir.$_POST["relatingFileName"]);
 		$line = trim(array_pop($progress));
 		//data = {status: "Start/Progress/Finished/Error/Fatal Error", stage: text, processed:, total:,}
 		$dataToReturn = array();
 		$dataToReturn["status"] = substr($line, 0, stripos($line,":"));
 		$dataToReturn["stage"] = substr($line, stripos($line,":")+2);
 		if(strpos($line, "No")){
 			$dotPos = strpos($line,".");
 			$dataToReturn["processed"] = substr($line, $dotPos+1, strpos($line, " ", $dotPos)-$dotPos-1);
 			$dataToReturn["total"] = substr($line, strpos($line, "of", $dotPos)+3);
 			//, strpos($line, "\r", $dotPos)-(strpos($line, "of", $dotPos)+3) Note the differences between operating systems
 		}
 		echo json_encode($dataToReturn);
 	}
/*
http://stackoverflow.com/questions/15153776/convert-base64-string-to-an-image-file
function base64_to_jpeg( $base64_string, $output_file ) {
    $ifp = fopen( $output_file, "wb" ); 
    fwrite( $ifp, base64_decode( $base64_string) ); 
    fclose( $ifp ); 
    return( $output_file ); 
}

$image = base64_to_jpeg( $my_base64_string, 'tmp.jpg' );
zymdxlyx@sina.cn_1476706104.txt
*/	
?>
