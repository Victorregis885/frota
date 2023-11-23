<?php 

include('../conexao/conn.php');

$requestData = $_REQUEST;

if($requestData['operacao'] == 'create'){
    if(Chave_Estrangeira($requestData, $pdo)){
        try{
            $sql = "INSERT INTO veiculo (placa, marca, combustivel, cor, usuario) VALUES (?, ?, ?, ?, ?)"; 
            
        
            $stmt = $pdo->prepare($sql); 
        
            $stmt->execute([
                $requestData['placa'],
                $requestData['marca'],
                $requestData['combustivel'],
                $requestData['cor'],
                $requestData['ID_CH_USUARIO']
            ]);
        
            $dados = array(
                'type' => 'success',
                'mensagem' => 'Registro salvo com sucesso!'
            );

        }catch (PDOException $e){
            $dados = array(
                'type' => 'error',
                'mensagem' => 'Erro ao salvar o registro:' .$e
            );
        }
        echo json_encode($dados);
    }
    }


    if($requestData['operacao'] == 'read'){
        $colunas = $requestData['columns']; 
        $sql = "SELECT * FROM veiculo WHERE 1=1 ";
        
        $resultado = $pdo->query($sql);
        $qtdeLinhas = $resultado->rowCount();

        
        $filtro = $requestData['search']['value'];

        if( !empty( $filtro ) ){
            $sql .= " AND (id LIKE '$filtro%' ";
            $sql .= " OR placa LIKE '$filtro%') ";
        }

        $resultado = $pdo->query($sql);
        $totalFiltrados = $resultado->rowCount();

        $colunaOrdem = $requestData['order'][0]['column']; 
        $ordem = $colunas[$colunaOrdem]['data']; 
        $direcao = $requestData['order'][0]['dir']; 

        $inicio = $requestData['start']; 
        $tamanho = $requestData['length']; 

        $sql .= " ORDER BY $ordem $direcao LIMIT $inicio, $tamanho ";
        $resultado = $pdo->query($sql);
        $resultData = array();
        while($row = $resultado->fetch(PDO::FETCH_ASSOC)){
            $resultData[] = array_map('utf8_encode', $row);
        }
        
        $dados = array(
            "draw" => intval($requestData['draw']),
            "recordsTotal" => intval($qtdeLinhas),
            "recordsFiltered" => intval($totalFiltrados),
            "data" => $resultData
        );
        echo json_encode($dados);
    }

if($requestData['operacao'] == 'update'){
    if(empty($_REQUEST['placa']) || empty($_REQUEST['marca']) || empty($_REQUEST['combustivel']) || empty($_REQUEST['cor']) || empty($_REQUEST['usuario'])){
        $dados = array(
            "type" => 'error',
            "mensagem" => 'Existe(m) campo(s) obrigatório(s) não preenchido(s).'
        );
    }
    else { 
    try{

        $sql = "UPDATE veiculo SET placa = ?, marca = ?, combustivel = ?, cor = ?, usuario = ? WHERE id = ?";
    
        $stmt = $pdo->prepare($sql); 
    
        $stmt->execute([
            $requestData['placa'],
            $requestData['marca'],
            $requestData['combustivel'],
            $requestData['cor'],
            $requestData['ID_CH_USUARIO'],
            $requestData['id']
        ]);
        
        $dados = array(
            'type' => 'success',
            'mensagem' => 'Atualizado com sucesso!'
        );

    }catch (PDOException $e){
        $dados = array(
            'type' => 'error',
            'mensagem' => 'Erro ao atualizar:' .$e
        );
    }
    echo json_encode($dados);

    }
}

if($requestData['operacao'] == 'delete'){
    
    try{

        
        $sql = "DELETE FROM veiculo WHERE id = ?";
    
        $stmt = $pdo->prepare($sql); 
    
        $stmt->execute([
            $requestData['id']
        ]);
    
        $dados = array(
            'type' => 'success',
            'mensagem' => 'Excluido com sucesso!'
        );

    }catch (PDOException $e){
        $dados = array(
            'type' => 'error',
            'mensagem' => 'Erro ao excluir o registro:' .$e
        );
    
    }
    
    echo json_encode($dados);


}



if($requestData['operacao'] == 'view'){
    
    $sql = "SELECT * FROM veiculo WHERE id = ".$requestData['id']."";

    $resultado = $pdo->query($sql);
    if($resultado){
    $result = array();
    while($row = $resultado->fetch(PDO::FETCH_ASSOC)){
        $result = array_map('utf8_encode', $row);
    }
    $dados = array(
        'type' => 'view',
        'mensagem' => '',
        'dados' => $result
    );
    }
    else {
        $dados = array(
            'type' => 'error',
            'mensagem' => 'Erro ao abrir o registro:'
        );  
    }
echo json_encode($dados);


}


if($requestData['operacao'] == "viewAll"){

    $sql = "SELECT * FROM ".$requestData['banco']."";
    $resultado = $pdo->query($sql);

    if($resultado){
        $result = array();
        while($row = $resultado->fetch(PDO::FETCH_ASSOC)){
            $result[] = array_map('utf8_encode', $row);
        }

        $dados = array(
            'type' => 'success',
            'dados' => $result
        );
    }
    else {
        $dados = array(
            'type' => 'error',
            'mensagem' => 'Erro ao pesquisar informações:'
        );   
    }
    echo json_encode($dados);
}

function Chave_Estrangeira(Array $dados, $pdo){
        
    $padrao = '/[^a-zA-Z0-9\s]/';
    $tabela = $dados['tabela'];

    foreach($dados as $chave => $valor){
        $coluna = preg_replace($padrao, ' ',$chave);
        $array = explode(" ", $coluna);

            if(in_array("CH", $array)){

                $copArray = $array;
                $NewArray = array_pop($copArray);
    
                $NewArray = array_diff($array, [$NewArray]);
                $indice = array_key_first($NewArray);
                $ColEstrang = $NewArray[$indice];
                $sql = "SELECT {$tabela}.* FROM {$tabela} INNER JOIN {$array[2]} ON {$valor} = {$array[2]}.{$ColEstrang}";
                $stmt = $pdo->prepare($sql);
                if($stmt->execute()){
                    $ColEstrangA = $ColEstrang;
                    if($stmt->rowCount() > 0){
                    } else {
                        $mgs = "Desculpe mais o valor {$valor} do {$ColEstrangA} da Tabela {$array[2]} não existe";
                        $dados = array(
                            'type' => 'error',
                            'mensagem' => $mgs
                        );
                        echo json_encode($dados);
                        die();
                    }
                }else{
                    $mgs = "Erro ao procurar chave estrangeira da tabela {$tabela}";
                    $dados = array(
                        'type' => 'error',
                        'mensagem' => $mgs
                    );
                    echo json_encode($dados);
                    die();
                }
            } elseif(!in_array("CH", $array)) {
            }
    }
    return $stmt->fetchAll();
}