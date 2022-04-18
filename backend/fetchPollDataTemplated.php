<?php
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
    header("Content-Type: application/json");
 
    require 'sqlConnect.php';

    $_POST = json_decode(file_get_contents('php://input'), true);

    global $_sqlResultSet;

    function computeDropdown($key,$items){
        $stats = [];
        global $_sqlResultSet;
        global $conn;

        foreach($items as $value){
            $sqlQuery = "SELECT COUNT(*) AS count FROM Gamer WHERE {$key} = :p1";

            try{
                $sqlQuerySession = $conn->prepare($sqlQuery);

                $sqlQuerySession->bindParam(":p1",$value);

                $sqlQuerySession->execute();
                $sqlResult = $sqlQuerySession->fetchAll(PDO::FETCH_ASSOC);

                $stats[$value]["amount"] = $sqlResult[0]["count"];
                $stats[$value]["percentage"] = ($sqlResult[0]["count"] / count($_sqlResultSet));

            }
            catch(PDOException $e){
            }
        }

        return $stats;
    }

    function computeInputText($key){
        // just return a list of all the texts 
        // ... a statistic here is too tedious for my PHP skills (and bad for my sanity)
        global $conn;

        $sqlQuery = "SELECT {$key} FROM Gamer";
        $returnSet = [];

        try {
            $sqlQuerySession = $conn->prepare($sqlQuery);
            $sqlQuerySession->execute();
            $sqlResult = $sqlQuerySession->fetchAll(PDO::FETCH_ASSOC);

            foreach($sqlResult as $inputs){
                array_push($returnSet,$inputs[$key]);
            }

            return $returnSet;
        }
        catch(PDOException $e){
            echo "Error";
        }
    }

    function computeSinglechoice($key,$items){
        // same thing ...
        return computeDropdown($key,$items);
    }

    function computeSlider($key){
        global $conn;

        $sqlQuery = "SELECT AVG({$key}) AS avg FROM Gamer";

        try {
            $sqlQuerySession = $conn->prepare($sqlQuery);
            $sqlQuerySession->execute();
            $sqlResult = $sqlQuerySession->fetchAll(PDO::FETCH_ASSOC);
            return $sqlResult[0]["avg"];
        }
        catch(PDOException $e){
            echo "Error";
        }
    }


    function fetchPollDataTemplated(){
    
        $sqlQuery = "SELECT * FROM Gamer";
        global $conn;
        global $_sqlResultSet;

        try{
            $stmt = $conn->prepare($sqlQuery);

            $stmt->execute(); 
            $_sqlResultSet = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $json = json_encode($_sqlResultSet); 

            //echo $json;
        }
        catch(PDOException $e){
            echo "Error fetching poll data: \n\n" . $e->getMessage();
        }

        $pollResultData = null;
        
        foreach ($_POST as $templateKeys => $templateValues) {
            switch($templateValues["type"]){
                case "dropdown":
                    $pollResultData[$templateKeys] = computeDropdown($templateKeys,$templateValues["items"]);
                    break;
                case "slider":
                    $pollResultData[$templateKeys] = computeSlider($templateKeys);
                    break;
                case "singlechoice":
                    $pollResultData[$templateKeys] = computeSinglechoice($templateKeys,$templateValues["items"]);
                    break;
                case "inputtext":
                    $pollResultData[$templateKeys] = computeInputText($templateKeys);
                    break;
            }
        }

        echo json_encode($pollResultData);
    }

    connect();
    fetchPollDataTemplated();
?>