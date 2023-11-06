<?php 

include('../conexao/conn.php');

$requestData = $_REQUEST;

date_default_timezone_set ('America/Sao_Paulo');
$dataLocal = date('Y-m-d H:i:s', time());


function Verificando() {
    $requestData = $_REQUEST;
    $error = "";
    $dados = array("type" => 'success');

    foreach($requestData as $chave => $value){
        if(is_null($value) || empty($value)){
            $error .=  "{$chave}";
            $error .= ", ";
            $msg = "Faltou vc prencher os dados associados a/ao {$error}";
            $dados = array(
                "type" => 'error',
                "mensagem" => $msg
            );
        }
    }
    $teste = $dados["type"] == "error" ? true : false;
    if($teste == true){
        echo json_encode($dados);
        die();
    }
}

if($requestData['operacao'] == 'create'){
    Verificando();
    if(Chave_Estrangeira($requestData, $pdo)){
        try{
            $valorTotal = $requestData['valor_servico'] + $requestData['valor_pecas'];
            // gerar a querie de insersao no banco de dados 
            $sql = "INSERT INTO manutencao (data, valor_servico, valor_pecas, valor_total, descricao, veiculo, oficina, pecas) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"; // colocar ? para deixar mais seguro
            // preparar a querie para gerar objetos de insersao no banco de dados
        
            $stmt = $pdo->prepare($sql); // atribuindo para ver se existe
        
            // se existir requerir os valores
            $stmt->execute([
                $dataLocal,
                $requestData['valor_servico'],
                $requestData['valor_pecas'],
                $valorTotal,
                $requestData['descricao'],
                $requestData['ID_CH_VEICULO'],
                $requestData['ID_CH_OFICINA'],
                $requestData['ID_CH_PECA']

            ]);
        
            // tranforma os dados em um array
            $dados = array(
                'type' => 'success',
                'mensagem' => 'Registro salvo com sucesso!'
            );
            // se nao existir mostrar erro
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
        $sql = "SELECT * FROM manutencao WHERE 1=1 ";

        $resultado = $pdo->query($sql);
        $qtdeLinhas = $resultado->rowCount();

        $filtro = $requestData['search']['value'];
        if( !empty( $filtro ) ){

            $sql .= " AND (id_manutencao LIKE '$filtro%' ";
            $sql .= " OR data LIKE '$filtro%') ";
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
    
    try{

        $sql = "UPDATE manutencao SET data = ?, valor_servico = ?, valor_pecas = ?, valor_total = ?, descricao = ?, veiculo = ?, oficina = ?, pecas = ?  WHERE id_manutencao = ?";
        // preparar a querie para gerar objetos de insersao no banco de dados
    
        $stmt = $pdo->prepare($sql); // atribuindo para ver se existe
    
        // se existir requerir os valores
        $stmt->execute([
                $dataLocal,
                $requestData['valor_servico'],
                $requestData['valor_pecas'],
                $requestData['valor_total'],
                $requestData['descricao'],
                $requestData['ID_CH_VEICULO'],
                $requestData['ID_CH_OFICINA'],
                $requestData['ID_CH_PECA'],
                $requestData['id_manutencao']
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
    





if($requestData['operacao'] == 'delete'){
    
    try{

        
        $sql = "DELETE FROM manutencao WHERE id_manutencao = ?";
    
        $stmt = $pdo->prepare($sql); 

        $stmt->execute([
            $requestData['id_manutencao']
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
    
    $sql = "SELECT * FROM manutencao WHERE id_manutencao = ".$requestData['id_manutencao']."";

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