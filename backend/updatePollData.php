<?php
    
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
    header("Content-Type: application/json");
    
    require 'sqlConnect.php';

    $_POST = json_decode(file_get_contents('php://input'), true);
 
    function updatePollData(){
        $sql = "UPDATE Gamer 
            SET gender = :p2,
            gameLastPurchase = :p3,
            timeSpentlastTwoDays = :p4,
            lootboxesBought = :p5,
            deviceType = :p6,
            cpuUsage = :p7
            WHERE fhid = :p1";

        
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
    updatePollData();

?>