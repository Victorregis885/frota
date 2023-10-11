<?php 

include('../conexao/conn.php');

$requestData = $_REQUEST;

if($requestData['operacao'] == 'create'){
    
        try{
            
            // gerar a querie de insersao no banco de dados 
            $sql = "INSERT INTO pecas (nome_peca, fabricante_peca, preco) VALUES (?, ?, ?)"; // colocar ? para deixar mais seguro
            // preparar a querie para gerar objetos de insersao no banco de dados
        
            $stmt = $pdo->prepare($sql); // atribuindo para ver se existe
        
            // se existir requerir os valores
            $stmt->execute([
                $requestData['nome_peca'],
                $requestData['fabricante_peca'],
                $requestData['preco']
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
        $sql = "SELECT * FROM pecas WHERE 1=1 ";
        //Obter o total de registros cadastrados
        $resultado = $pdo->query($sql);
        $qtdeLinhas = $resultado->rowCount();
        //Verificando se há filtro determinado
        $filtro = $requestData['search']['value'];
        if( !empty( $filtro ) ){
            //Montar a expressão lógica que irá compor os filtros
            //Aqui você deverá determinar quais colunas farão parte do filtro
            $sql .= " AND (id_peca LIKE '$filtro%' ";
            $sql .= " OR nome_peca LIKE '$filtro%') ";
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

        $sql = "UPDATE pecas SET nome_peca = ?, fabricante_peca = ?, preco = ? WHERE id_peca = ?";
        // preparar a querie para gerar objetos de insersao no banco de dados
    
        $stmt = $pdo->prepare($sql); // atribuindo para ver se existe
    
        // se existir requerir os valores
        $stmt->execute([
            $requestData['nome_peca'],
            $requestData['fabricante_peca'],
            $requestData['preco'],
            $requestData['id_peca']
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
        $sql = "DELETE FROM pecas WHERE id_peca = ?";
        // preparar a querie para gerar objetos de insersao no banco de dados
    
        $stmt = $pdo->prepare($sql); // atribuindo para ver se existe
    
        // se existir requerir os valores
        $stmt->execute([
            $requestData['id_peca']
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
    $sql = "SELECT * FROM pecas WHERE id_peca = ".$requestData['id_peca']."";
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