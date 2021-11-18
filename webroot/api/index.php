<?php
 header('Content-Type: application/json');

//get inputs
 $searchName = $_GET['name'];
 $searchName = rawurlencode($searchName);
 $searchCode = $_GET['code'];
 $searchCode = rawurlencode($searchCode);

 if (($searchName == "") and ($searchCode == ""))
 {
    echo json_encode(['error' => 'No Search terms.']);
    return;
 }

 //set url based on search term
 if($searchName != "")
 {
    $url = "https://restcountries.com/v3.1/name/".$searchName;
 }
 else
 {
    $url = "https://restcountries.com/v3.1/alpha/".$searchCode;
 }
 //filter fields returned
 $url = $url."?fields=name,cca2,cca3,flags,region,subregion,population,languages";

 $client = curl_init($url);
 curl_setopt($client, CURLOPT_RETURNTRANSFER, 1);

 $response = curl_exec($client);

 $httpCode = curl_getinfo($client,CURLINFO_HTTP_CODE);
 curl_close($client);

 //check for errors
 if($httpCode != 200 or !$response){
    echo json_encode(['error' => 'No Results found.']);
    return;
 }

 $respArray = json_decode($response);

 //sort by population
 if (is_array($respArray))
 {
    usort($respArray, function($a,$b){
        return $a->population > $b->population ? -1 : 1;
    });
 }

$sortedResp = json_encode($respArray);
echo $sortedResp;