<?php 

include('../conexao/conn.php');

$requestData = $_REQUEST;

date_default_timezone_set ('America/Sao_Paulo');
$dataLocal = date('Y-m-d H:i:s', time());

if($requestData['operacao'] == 'create'){
    
        try{
            
            // gerar a querie de insersao no banco de dados 
            $sql = "INSERT INTO manutencao (data, valor_servico, valor_pecas, valor_total, descricao, veiculo_id_veiculo, oficina_id_oficina, pecas_id_peca) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"; // colocar ? para deixar mais seguro
            // preparar a querie para gerar objetos de insersao no banco de dados
        
            $stmt = $pdo->prepare($sql); // atribuindo para ver se existe
        
            // se existir requerir os valores
            $stmt->execute([
                $dataLocal,
                $requestData['valor_servico'],
                $requestData['valor_pecas'],
                $requestData['valor_total'],
                $requestData['descricao'],
                $requestData['veiculo_id_veiculo'],
                $requestData['oficina_id_oficina'],
                $requestData['pecas_id_peca']

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




    if($requestData['operacao'] == 'read'){
        $colunas = $requestData['columns']; //Obter as colunas vindas do resquest
        //Preparar o comando sql para obter os dados da categoria
        $sql = "SELECT * FROM manutencao WHERE 1=1 ";
        //Obter o total de registros cadastrados
        $resultado = $pdo->query($sql);
        $qtdeLinhas = $resultado->rowCount();
        //Verificando se há filtro determinado
        $filtro = $requestData['search']['value'];
        if( !empty( $filtro ) ){
            //Montar a expressão lógica que irá compor os filtros
            //Aqui você deverá determinar quais colunas farão parte do filtro
            $sql .= " AND (id_manutencao LIKE '$filtro%' ";
            $sql .= " OR data LIKE '$filtro%') ";
        }
        //Obter o total dos dados filtrados
        $resultado = $pdo->query($sql);
        $totalFiltrados = $resultado->rowCount();
        //Obter valores para ORDER BY      
        $colunaOrdem = $requestData['order'][0]['column']; //Obtém a posição da coluna na ordenação
        $ordem = $colunas[$colunaOrdem]['data']; //Obtém o nome da coluna para a ordenação
        $direcao = $requestData['order'][0]['dir']; //Obtém a direção da ordenação
        //Obter valores para o LIMIT
        $inicio = $requestData['start']; //Obtém o ínicio do limite
        $tamanho = $requestData['length']; //Obtém o tamanho do limite
        //Realizar o ORDER BY com LIMIT
        $sql .= " ORDER BY $ordem $direcao LIMIT $inicio, $tamanho ";
        $resultado = $pdo->query($sql);
        $resultData = array();
        while($row = $resultado->fetch(PDO::FETCH_ASSOC)){
            $resultData[] = array_map('utf8_encode', $row);
        }
        //Monta o objeto json para retornar ao DataTable
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

        $sql = "UPDATE manutencao SET data = ?, valor_servico = ?, valor_pecas = ?, valor_total = ?, descricao = ?, veiculo_id_veiculo = ?, oficina_id_oficina = ?, pecas_id_peca = ?  WHERE id_manutencao = ?";
        // preparar a querie para gerar objetos de insersao no banco de dados
    
        $stmt = $pdo->prepare($sql); // atribuindo para ver se existe
    
        // se existir requerir os valores
        $stmt->execute([
                $dataLocal,
                $requestData['valor_servico'],
                $requestData['valor_pecas'],
                $requestData['valor_total'],
                $requestData['descricao'],
                $requestData['veiculo_id_veiculo'],
                $requestData['oficina_id_oficina'],
                $requestData['pecas_id_peca'],
                $requestData['id_manutencao']
        ]);
        
    
        // tranforma os dados em um array
        $dados = array(
            'type' => 'success',
            'mensagem' => 'Atualizado com sucesso!'
        );
        // se nao existir mostrar erro
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

        
        // gerar a querie de insersao no banco de dados 
        $sql = "DELETE FROM manutencao WHERE id_manutencao = ?";
        // preparar a querie para gerar objetos de insersao no banco de dados
    
        $stmt = $pdo->prepare($sql); // atribuindo para ver se existe
    
        // se existir requerir os valores
        $stmt->execute([
            $requestData['id_manutencao']
        ]);
    
        // tranforma os dados em um array
        $dados = array(
            'type' => 'success',
            'mensagem' => 'Excluido com sucesso!'
        );
        // se nao existir mostrar erro
    }catch (PDOException $e){
        $dados = array(
            'type' => 'error',
            'mensagem' => 'Erro ao excluir o registro:' .$e
        );
    
    }
    
    echo json_encode($dados);


}



if($requestData['operacao'] == 'view'){
    
    // gerar a querie de insersao no banco de dados 
    $sql = "SELECT * FROM munutencao WHERE id_manutencao = ".$requestData['id_manutencao']."";
    // preparar a querie para gerar objetos de insersao no banco de dados

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