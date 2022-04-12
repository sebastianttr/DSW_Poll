<?php
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    require("config.php");
    global $conn; //declare a variable with global scope in PHP

    function connect() {
        global $conn; // explicitly say that you want to use the global variable in this function
        global $servername;
        global $username;
        global $password;
        global $dbname;
        try {
            $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password); //error might occur here!
            // set the PDO error mode to exception
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            //echo "Connected successfully<br>";
            //echo '{"state" : "Connection established"}';
        } catch(PDOException $e) {
            echo '{"error" : "Connection failed: ' . $e->getMessage() .'"}';
        }
    }

    function executeSelect() {
        // here comes the select statement you want to execute
        $sql = "SELECT * FROM Bikes";
        global $conn;
        try {
            $stmt = $conn->prepare($sql);
            //optional: configure params if you have used them in the select-statement
            //$stmt->bindParam(":param1", "somevalue"); 

            $stmt->execute(); //execute the statement - might go wrong and result in an error
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC); //get all records
            $json = json_encode($results); //reformats SQL result set into JSON format
            echo $json;
        }catch(PDOException $e) {
            echo '{"error" : "' . $e->getMessage() .'"}';
        }
    }


    connect(); 
    // execute either a select OR a insert/update/delete
    executeSelect();
    //executeIUD();
?>
