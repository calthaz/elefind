<?php
    
    $langs = array();

    if (isset($_POST["changeLang"]) && isset($_SERVER['HTTP_ACCEPT_LANGUAGE'])) {
        $userLang = $_POST["changeLang"];
        if($userLang == "sys"){       
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
            }
        
            // look through sorted list and use first one that matches our languages
            foreach ($langs as $lang => $val) {
                if (strpos($lang, 'zh') === 0) {
                    $userLang = "zh";
                } else if (strpos($lang, 'en') === 0) {
                    // show English site
                    $userLang = "en";
                }
            }
            if($userLang=="sys"){ $userLang = "en"; }

        }
            //if($userLang == "zh"){
                //$string = file_get_contents("/languages/zh.json");
            //}else{
                $string = file_get_contents("languages".DIRECTORY_SEPARATOR."en.json");
            //}
        
        // show default site or prompt for language
        echo $string; 
    }

?>