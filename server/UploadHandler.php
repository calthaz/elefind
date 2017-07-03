<?php
	require "ImageManager.php";

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
		$username = ""; 
		if( $useremail != ''){
			$sql = "SELECT username FROM ".$users." WHERE email LIKE '".$useremail."'";
			$result = $conn->query($sql);
			if($result->num_rows <= 0){
				//means unregistered user
				$useremail = "";		
				$username = "";		
			}else{
				$row = $result->fetch_assoc();
				$username = $row['username'];
			}
		}

		$filePrefix = ""; 
		$filename = "";
		$title =""; 
		$date = date("Y-m-d");

		if(isset($_FILES["uploadToMyAlbum"]) && $useremail !== ""){
			$vis = "private";
			$targetDir = $privatePhotoDir.$useremail.DIRECTORY_SEPARATOR."photos".DIRECTORY_SEPARATOR; 
			//echo "to my album"; 
		}else{
			$vis = "public"; 
			$targetDir = $publicPhotoDir; 
		}
		
		$filePackage = array(); 

		$stmt = $conn->prepare("INSERT INTO ".$photos." (filename, author, authorname, visibility, title, date) VALUES (?, ?, ?, ?, ?,?)");
		$stmt->bind_param('ssssss', $filename, $useremail, $username, $vis, $title, $date);
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
        				$fileinfo['authorname']=$username;
        				$fileinfo['title']=$title;
        				$fileinfo['visibility']=$vis;
        				$fileinfo['date'] = $date;

        				array_push( $filePackage, $fileinfo);
					    if(move_uploaded_file($tmp_name, $targetDir.$filename)){
					    	image_resize_contain($targetDir.$filename, $targetDir.$thumbnail.$filename);
					    } 
					}
				}
				
	    	}
		}

		echo json_encode($filePackage); 
		$conn->close();

	}elseif((isset($_GET["pw"])) && $_GET["pw"]==="arr324hfg[ght.jy"){
		$dirList = []; 

		//get a list of users
		$sql = "SELECT email FROM ".$users; 
		$conn = new mysqli($servername, $username, $password, $dbname);
		// Check connection
		if ($conn->connect_error) {
    		die("Connection failed: " . $conn->connect_error); //??? dies to which file? 
		} 
		$sqlresult = $conn->query($sql);
		while ($row = $sqlresult->fetch_assoc()) {
			$dirList[] = $privateDraftDir.$row['email'].DIRECTORY_SEPARATOR."photos".DIRECTORY_SEPARATOR; 
		}
		$dirList[] = $publicPhotoDir;	
		
		clearstatcache();
		//sort out photos' thumbnails
		foreach ($dirList as $key => $curDir) {
			echo "<br/>";
			echo "<b>Open directory: ".$curDir."</b><br/>";
			$handle = opendir($curDir);
			$sql = "SELECT * FROM ".$photos." WHERE filename LIKE '";
			$file=""; 

	        if ( $handle ){
	        	if(!file_exists(getDirPath($curDir.$thumbnail))){
	        		mkdir(getDirPath($curDir.$thumbnail));
	        	}
	            while ( false !==  ( $file = readdir ( $handle ) )){
	            	//"is_dir" only works from top directory, so append the $dir before the file
	            	if ($file == '.' || $file == '..' || is_dir($curDir.$file)) { 
			          continue; 
			        } 
	            	$type  = strtolower(pathinfo($file, PATHINFO_EXTENSION));//

	            	if ( $type == "jpg" || $type == "png" || $type == "jpeg" || $type == "gif" ){

	            		$sqlresult = $conn->query($sql.$file."'");
	            		if($sqlresult->num_rows===1) {    

	            			$row = $sqlresult->fetch_assoc();    			
	        				echo "Valid File: ".$curDir.$file."--".$row['filename']."--".$row['author']."--".$row['title']."--".$row['date']."<br/>";
	        				if(file_exists($curDir.$thumbnail.$file)){
	        					$size = getimagesize($curDir.$thumbnail.$file);
	        					//list($width, $height, $type, $attr)
	        					//list: assign variables as if they were in an array.... well, so strange
	        					 //PHP 5 里，list() 从最右边的参数开始赋值； PHP 7 里，list() 从最左边的参数开始赋值。
	        					if($size&&$size[0]<=$THUMB_SIZE&&$size[1]<=$THUMB_SIZE){
	        						echo "Valid thumbnail. <br/>";
	        						continue; 
	        					}

	        				}
	        				if(image_resize_contain($curDir.$file, $curDir.$thumbnail.$file)){
		    					echo "Thumbnail Generated: ".$curDir.$thumbnail.$file." <br/>";
		    				}else{
		    					echo "<b>Warning: </b>can't generate thumbnail for ".$curDir.$file."<br/>";
		    				}
	    				}elseif($sqlresult->num_rows>=1){
	    					echo "<b>Warning: </b> duplicate records for ".$curDir.$file."<br/>";
	    				}else{
	    					echo "<b>Delete</b> unrecorded file ".$curDir.$file."<br/>";
	                		unlink($curDir.$file);
	                		if(file_exists($curDir.$thumbnail.$file)){
	                			unlink($curDir.$thumbnail.$file);
	                		}
	    				}
	    				
	                }else{
	                	echo "<b>Delete</b> unsupported format ".$curDir.$file."<br/>";
	                	unlink($curDir.$file);
	                }
	            }
	        }

       }
        $conn->close();

	}
	// http://www.oschina.net/code/snippet_140043_22321
	// 把大图缩略到缩略图指定的范围内,可能有留白（原图细节不丢失）
	//$w = $_GET['w']?$_GET['w']:400;
	//$h = $_GET['h']?$_GET['h']:400;
	//$filename = "storage\stand_test_".$w."_".$h.".jpg";
	//image_resize_contain( 'storage\test.jpg',$filename, $w, $h);
	//header("content-type:image/png");//设定生成图片格式
	//echo file_get_contents($filename);
	 
	function image_resize_contain($f, $t, $tw=200, $th=200){
	// 按指定大小生成缩略图，而且不变形，缩略图函数
	        $temp = array(1=>'gif', 2=>'jpeg', 3=>'png');
	 
	        list($fw, $fh, $tmp) = getimagesize($f);
	 
	        if(!$temp[$tmp]){
	                return false;
	        }
	        $tmp = $temp[$tmp];
	        $infunc = "imagecreatefrom$tmp";
	        $outfunc = "image$tmp";
	 
	        $fimg = $infunc($f);
	 
	        // 使缩略后的图片不变形，并且限制在 缩略图宽高范围内
	        if($fw/$tw > $fh/$th){
	            $th = $tw*($fh/$fw);
	        }else{
	            $tw = $th*($fw/$fh);
	        }
	 
	        $timg = imagecreatetruecolor($tw, $th);
	        imagealphablending($timg,false);//这里很重要,意思是不合并颜色,直接用$img图像颜色替换,包括透明色;
            imagesavealpha($timg,true);//这里很重要,意思是不要丢了$thumb图像的透明色;
          
	        imagecopyresampled($timg, $fimg, 0,0, 0,0, $tw,$th, $fw,$fh);
	        if($outfunc($timg, $t)){
	                return true;
	        }else{
	                return false;
	        }
	}
/*
This guy is a hero
http://php.net/manual/zh/function.imagecopyresampled.php
FOUR RECTANGLES

                  $src_image                                   $dst_image
+------------+---------------------------------+   +------------+--------------------+
|            |                                 |   |            |                    |
|            |                                 |   |         $dst_y                  |
|            |                                 |   |            |                    |
|         $src_y                               |   +-- $dst_x --+----$dst_width----+ |
|            |                                 |   |            |                  | |
|            |                                 |   |            |    Resampled     | |
|            |                                 |   |            |                  | |
+-- $src_x --+------ $src_width ------+        |   |       $dst_height             | |
|            |                        |        |   |            |                  | |
|            |                        |        |   |            |                  | |
|            |                        |        |   |            |                  | |
|            |                        |        |   |            +------------------+ |
|            |        Sample          |        |   |                                 |
|            |                        |        |   |                                 |
|            |                        |        |   |                                 |
|       $src_height                   |        |   |                                 |
|            |                        |        |   +---------------------------------+
|            |                        |        |
|            |                        |        |
|            +------------------------+        |
|                                              |
|                                              |
+----------------------------------------------+
*/
/**
 * http://www.oschina.net/code/snippet_554077_10688
 * 生成缩略图
 * @author yangzhiguo0903@163.com
 * @param string     源图绝对完整地址{带文件名及后缀名}
 * @param string     目标图绝对完整地址{带文件名及后缀名}
 * @param int        缩略图宽{0:此时目标高度不能为0，目标宽度为源图宽*(目标高度/源图高)}
 * @param int        缩略图高{0:此时目标宽度不能为0，目标高度为源图高*(目标宽度/源图宽)}
 * @param int        是否裁切{宽,高必须非0}
 * @param int/float  缩放{0:不缩放, 0<this<1:缩放到相应比例(此时宽高限制和裁切均失效)}
 * @return boolean
 */

?>