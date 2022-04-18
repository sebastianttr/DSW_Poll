<?php
    
    // Real cors handling : https://stackoverflow.com/a/18399709

    // Allow from any origin
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        //header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        header("Access-Control-Allow-Origin: *");
        header('Access-Control-Allow-Credentials: true');    
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); 
    }   
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
            header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
            header("Access-Control-Allow-Headers:{$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    
        exit(0);
    } 

    header('Content-Type: text/plain');
    
    require 'sqlConnect.php';

    $_POST = json_decode(file_get_contents('php://input'), true);
 
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