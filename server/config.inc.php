<?php
	$privateDraftDir = "storage".DIRECTORY_SEPARATOR."users".DIRECTORY_SEPARATOR; // then: \\useremail\\sketches
	$privatePhotoDir = "storage".DIRECTORY_SEPARATOR."users".DIRECTORY_SEPARATOR; // then: \\useremail\\photos
	$publicDraftDir = join(DIRECTORY_SEPARATOR, array('storage', 'public_sketches', ''));
	//$publicPhotoDir = "storage\\public_photos\\";
	$publicPhotoDir = join(DIRECTORY_SEPARATOR, array('storage', 'public_photos', ''));

	$settingsDir = "searchSettingFiles".DIRECTORY_SEPARATOR; //?? why use \\?
	$progressDir = "searchProgressFiles".DIRECTORY_SEPARATOR;
	$resultDir = "searchResultFiles".DIRECTORY_SEPARATOR;

	$profilePicDir = join(DIRECTORY_SEPARATOR, array('storage', 'users', 'profile_pics', ''));
	$userDir = "storage".DIRECTORY_SEPARATOR."users".DIRECTORY_SEPARATOR; 
	
	$servername = "localhost";
	$username = "elefind";
	$password = "elefindtest";
	$dbname = "elefind";

	$photos = "photos";
	$users = "users";
	$sketches = "sketches";
	$usersearchsettings = "usersearchsettings"; 
?>