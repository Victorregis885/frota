<?php

$hostname = 'localhost: 3306';

$dbname = 'frota';

$username = 'root';

$password = '';


try {
    $pdo = new PDO('mysql:host=' .$hostname. ' ;dbname=' .$dbname, $username, $password); 

    $pdo -> setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 

} catch (PDOException $e) {
    echo 'Erro: '.$e->getMenssage();  
}