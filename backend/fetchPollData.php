<?php
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
    header("Content-Type: application/json");
    
    require 'sqlConnect.php';

    $_POST = json_decode(file_get_contents('php://input'), true);

    function fetchPollData(){
        $sqlQuery = "SELECT * FROM Gamer";
        global $conn;

        try{
            $stmt = $conn->prepare($sqlQuery);

            $stmt->execute(); 
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $json = json_encode($results); 

            echo $json;
        }
        catch(PDOException $e){
            echo "Error while fetching poll data";
        }
    }

    // check sqlConnect.php
    connect();
    fetchPollData();

?>