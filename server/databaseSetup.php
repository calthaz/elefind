<?php
//data base set up
require "config.inc.php"; 

if((isset($_GET["pw"])) && $_GET["pw"]==="arugvj132kuy"){


    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    } 

    $sql="CREATE TABLE ".$photos." (
    id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
    filename VARCHAR(200) NOT NULL , 
    author VARCHAR(50) NULL , 
    visibility VARCHAR(10) NOT NULL , 
    title VARCHAR(100) NULL , date VARCHAR(150) NOT NULL) "; 

    $conn->query($sql);

    if ($conn->query($sql) === TRUE) {
        echo "Table ".$photos." created successfully"."<br/>";
    } else {
        echo "Error creating table: " . $conn->error."<br/>";
    }
    /* sql to create table*/
    $sql = "CREATE TABLE ".$users." (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
    username VARCHAR(30) NOT NULL,
    password VARCHAR(200) NOT NULL,
    email VARCHAR(50) UNIQUE,
    language VARCHAR(4) NOT NULL,
    reg_date VARCHAR(150),
    priviledges VARCHAR(30),
    profile_pic_url VARCHAR(100) DEFAULT '..\\server\\storage\\users\\profile_pics\\original\\user.png', 
    server_draft_folder  VARCHAR(150),
    server_photo_folder VARCHAR(150)
    )";
    //Note: backslashes doesn't work

    if ($conn->query($sql) === TRUE) {
        echo "Table ".$users." created successfully"."<br/>";
    } else {
        echo "Error creating table: " . $conn->error."<br/>";
    }

    $sql =
    "CREATE TABLE ".$usersearchsettings." 
    ( searchMethod INT NOT NULL DEFAULT '1' , 
    preprocessing INT NOT NULL DEFAULT '3' , 
    maxAmRate INT NOT NULL DEFAULT '2' , 
    maxFolds INT NOT NULL DEFAULT '2' , 
    centerX DOUBLE NOT NULL DEFAULT '0.5' , 
    centerY DOUBLE NOT NULL DEFAULT '0.5' , 
    searchW DOUBLE NOT NULL DEFAULT '0.2' , 
    searchH DOUBLE NOT NULL DEFAULT '0.2' , 
    slidingStep INT NOT NULL DEFAULT '4' , 
    maxPatchSize INT NOT NULL DEFAULT '1250' , 
    email VARCHAR(50) NOT NULL PRIMARY KEY)";

    if ($conn->query($sql) === TRUE) {
        echo "Table ".$usersearchsettings." created successfully"."<br/>";
    } else {
        echo "Error creating table: " . $conn->error."<br/>";
    }

    $sql = "CREATE TABLE ".$sketches." (
    id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
    filename VARCHAR(200) NOT NULL,
    author VARCHAR(50),
    visibility VARCHAR(10) NOT NULL,
    title VARCHAR(200),
    date VARCHAR(150) NOT NULL) ";


    if ($conn->query($sql) === TRUE) {
        echo "Table ".$sketches." created successfully"."<br/>";
    } else {
        echo "Error creating table: " . $conn->error."<br/>";
    }

    $conn->close();

} else {
 echo "Access denied. "; 
}
/*
name:"admin",
email:"zymdxlyx@sina.cn",
password:"tempPass",

language:"en",
profilePic:"img/admin.png",
draftFolderURL:"undecided",
photoAlbumURL:"undecided",
searchSettings: curSettings,
friends:"",
priviledge:"all",
*/
/*
if ($conn->query($sql) === TRUE) {
	$last_id = $conn->insert_id;
    echo "New record created successfully.Last inserted ID is: " . $last_id ;
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}*/



// prepare and bind

/*$stmt = $conn->prepare("INSERT INTO users (username, password, email, language, priviledges, profile_pic_url, reg_date) VALUES (?, ?, ?, 'sys', ?, 'storage\\users\\profile_pics',?)");

$stmt->bind_param('sssss', $username, $password, $email, $priviledges, $date);

$username = "caltha";
$password = md5("calthaWork");
$email = "caltha@elefind.com"; 
$priviledges = "all";
$date = date("Y-m-d");
$stmt->execute();

$stmt->close();
*/
/*
$sql = "SELECT id, username, password FROM users";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        echo "id: " . $row["id"]. " - Name: " . $row["username"]. " " . $row["password"]. "<br>";
    }
} else {
    echo "0 results";
}

$sql = "UPDATE users SET password = '".md5('test')."' WHERE email = 'admin@elefind.com'";
$conn->query($sql);


$email = "caltha@elefind.com"; 

$sql = "SELECT password FROM users WHERE email LIKE '".$email."'";
echo $sql;
$result = $conn->query($sql);

	$msg="default";

			if ($result->num_rows > 0) {
   				// output data of each row
    			$row = $result->fetch_assoc() ;    			
        			if($row['password']==md5('calthaWork')){
        				$msg = "success";
        				$sql = "SELECT * FROM users WHERE id LIKE 2";
        				$row = $result->fetch_assoc();
        				$user['name']=$row['username'];
        				$user['password']=$row['password'];
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
    			//}
			} else {
    			$msg = "user not found";
			}

			$data['msg']=$msg;

			echo json_encode($data);*/
		
?>

