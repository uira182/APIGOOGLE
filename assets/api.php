<?php
    //var_dump($_POST);

    define('KEY_API', "AIzaSyCLsOIrFTC-vnAgiBWtnX0ZUqPvc0G3qRk");

    $url  = "https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=" . $_POST['origem'] . "&destinations=" . $_POST['destino'] . "&key=". KEY_API;
    $data = ['key' => ''];
    $ch   = curl_init();

    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);

    $result = curl_exec($ch);

    curl_close($ch);

?>