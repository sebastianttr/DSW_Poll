<?php
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
    header('Content-Type: text/plain');
    require("config.php");
    global $conn; //declare a variable with global scope in PHP

    $_POST = json_decode(file_get_contents('php://input'), true);


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

    function insertPollData(){
        $sql = "INSERT INTO Gamer VALUES (0,:p1,:p2,:p3,:p4,:p5,:p6,:p7)";

        global $conn;

        try{
            $sqlQuerySession = $conn->prepare($sql);

            $sqlQuerySession->bindParam(":p1",$_POST["fhid"]);
            $sqlQuerySession->bindParam(":p2",$_POST["gender"]);
            $sqlQuerySession->bindParam(":p3",$_POST["gameLastPurchase"]);
            $sqlQuerySession->bindParam(":p4",$_POST["timeSpentlastTwoDays"]);
            $sqlQuerySession->bindParam(":p5",$_POST["lootboxesBought"]);
            $sqlQuerySession->bindParam(":p6",$_POST["deviceType"]);
            $sqlQuerySession->bindParam(":p7",$_POST["cpuUsage"]);

            $sqlQuerySession->execute();
            echo "SQL exec ok!";
        }
        catch(PDOException $e){
            echo "Error:" . $e->getMessage();
        }
    }

    connect();
    insertPollData();

?>