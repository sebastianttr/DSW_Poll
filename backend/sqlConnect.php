<?php
    require("config.php");
    global $conn;

    function connect(){
        global $conn; // explicitly say that you want to use the global variable in this function
        global $servername;
        global $username;
        global $password;
        global $dbname;
        try {
            $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password); //error might occur here!
            // set the PDO error mode to exception
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $e) {
            echo '{"error" : "Connection failed: ' . $e->getMessage() .'"}';
        }
    }

?>
