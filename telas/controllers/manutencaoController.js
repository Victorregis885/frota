function CRUD(dados, url){
    $.ajax({
        dataType: 'JSON',
        type: 'POST',
        assync: true,
        url: url,
        data: dados,
        success: function(dados){
        if(dados.mensagem != ''){

            Swal.fire ({
                icon: dados.type,
                title: 'Manutenção',
                text: dados.mensagem
            })
            $('#modal-manutencao').modal('hide')
        }
        else if(dados.type == 'view'){
            $('#data').val(dados.dados.data)
                $('#id_manutencao').val(dados.dados.id_manutencao)
                $('#valor_servico').val(dados.dados.valor_servico)
                $('#valor_pecas').val(dados.dados.valor_pecas)

                let valorTotal = parseFloat(dados.dados.valor_servico) + parseFloat(dados.dados.valor_pecas);
                $('#valor_total').val(valorTotal.toFixed(2))

                $('#descricao').val(dados.dados.descricao)
                $('#ID_CH_VEICULO').val(dados.dados.veiculo_id_veiculo)
                $('#ID_CH_OFICINA').val(dados.dados.oficina_id_oficina)
                $('#ID_CH_PECAS').val(dados.dados.pecas)
        }
        }
    })
}




$(document).ready(function(){
    carDados()
    carDados2()
    carDados3()
    $('#table-manutencao').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "api/models/manutencaoController.php?operacao=read",
            "type": "POST"
        },
        "language": {
            "url": "assets/vendor/DataTables/pt-BR.json"
        },
        "order": [
            [0, "desc"]
        ],
        "columns": [{
                "data": 'data',
                "className": 'texte-center'
            },
           {
                "data": 'id_manutencao',
                "className": 'text-center'
            },
            {
                "data": 'valor_servico',
                "className": 'text-center'
            },
            {
                "data": 'valor_pecas',
                "className": 'text-center'
            },
            {
                "data": 'valor_total',
                "className": 'text-center'
            },
            {
                "data": 'descricao',
                "className": 'text-left'
            },
            {
                "data": 'veiculo_id_veiculo',
                "className": 'text-center'
            },
            {
                "data": 'oficina_id_oficina',
                "className": 'text-center'
            },
            {
                "data": 'pecas',
                "className": 'text-center'
            },
            {
                "data": 'id_manutencao',
                "orderable": false,
                "searchable": false,
                "className": 'text-center',
                "render": function(data, type, row, meta) {
                    return `
                    <button id="${data}" class="btn btn-info btn-sm btn-view">Visualizar</button>
                    <button id="${data}" class="btn btn-primary btn-sm btn-edit">Editar</button>
                    <button id="${data}" class="btn btn-danger btn-sm btn-delete">Excluir</button>
                    `
                }
            }
        ]
        
    })

    function carDados() {

        $('#ID_CH_OFICINA').each(function() {
        var name = $(this).attr('id');
        var opcoes = '<option value="">Escolha a opção...</option>';
        data = name.split('_');
        var dados = 'banco=';
        dados += data[data.length - 1];
        dados += '&operacao=viewAll';
        
        $.ajax({
            dataType: 'JSON',
            type: 'POST',
            async: true,
            url: "api/models/manutencaoController.php",
            data: dados,
            success: function(dados) {
                if (dados.type == "success") {
                    $.each(dados.dados, function(indexInArray, valueOfElement) {
                        opcoes += '<option value="' + valueOfElement.id + '">'  + valueOfElement.nome_oficina + '</option>';
                    });
                    $('#' + name).html(opcoes);
                }
            }
        });
    });
}


function carDados2() {

    $('#ID_CH_VEICULO').each(function() {
    var name = $(this).attr('id');
    var opcoes = '<option value="">Escolha a opção...</option>';
    data = name.split('_');
    var dados = 'banco=';
    dados += data[data.length - 1];
    dados += '&operacao=viewAll';
    
    $.ajax({
        dataType: 'JSON',
        type: 'POST',
        async: true,
        url: "api/models/manutencaoController.php",
        data: dados,
        success: function(dados) {
            if (dados.type == "success") {
                $.each(dados.dados, function(indexInArray, valueOfElement) {
                    opcoes += '<option value="' + valueOfElement.id + '">'  + valueOfElement.placa + '</option>';
                });
                $('#' + name).html(opcoes);
            }
        }
    });
});
}

function carDados3() {

    $('#ID_CH_PECAS').each(function() {
    var name = $(this).attr('id');
    var opcoes = '<option value="">Escolha a opção...</option>';
    data = name.split('_');
    var dados = 'banco=';
    dados += data[data.length - 1];
    dados += '&operacao=viewAll';
    
    $.ajax({
        dataType: 'JSON',
        type: 'POST',
        async: true,
        url: "api/models/manutencaoController.php",
        data: dados,
        success: function(dados) {
            if (dados.type == "success") {
                $.each(dados.dados, function(indexInArray, valueOfElement) {
                    opcoes += '<option value="' + valueOfElement.id + '">'  + valueOfElement.nome_peca + '</option>';
                });
                $('#' + name).html(opcoes);
            }
        }
    });
});
}

    $('.btn-new').click(function(e){
        e.preventDefault()
        $('.modal-title').empty()
        $('.modal-title').append('Cadastro de manutencao')
        $('#form-manutencao :input').val('')
        $('.btn-save').show()
        $('.btn-save').attr('data-operation', 'create')
        $('#modal-manutencao').modal('show')
        $('input').prop('disabled', false)
        $('select').prop('disabled', false)
    })
    $('.btn-save').click(function(e){
        e.preventDefault()
    
        let dados = $('#form-manutencao').serialize()
        dados += `&operacao=${$('.btn-save').attr('data-operation')}&ID=${$('#modal-manutencao').attr('data-id')}&tabela=manutencao` 
        console.log(dados)
        let url = 'api/models/manutencaoController.php'
    
        CRUD(dados, url)
    
        $('#table-manutencao').DataTable().ajax.reload()
    })


$('#table-manutencao').on('click', 'button.btn-view', function(e){
    e.preventDefault()
    
    $('.modal-title').empty()
    $('.modal-title').append('Visualização de registros')
    let dados = `id_manutencao=${$(this).attr('id')}&operacao=view`
    let url = 'api/models/manutencaoController.php'

    CRUD(dados, url)
    $('.btn-save').hide()
    $('input').prop('disabled', true)
    $('#modal-manutencao').modal('show')
})



$('#table-manutencao').on('click', 'button.btn-edit', function(e){
    e.preventDefault()
    
    $('.modal-title').empty()
    $('.modal-title').append('Edição de registros')
    let dados = `id_manutencao=${$(this).attr('id')}&operacao=view`
    let url = 'api/models/manutencaoController.php'

    CRUD(dados, url)
    $('.btn-save').attr('data-operation', 'update')
    $('.btn-save').show()
    $('input').prop('disabled', false)
    $('#modal-manutencao').modal('show')
    $('#table-manutencao').DataTable().ajax.reload()
})



//funçao para deletar 
$('#table-manutencao').on('click', 'button.btn-delete', function(e){
    e.preventDefault()
    
    Swal.fire ({
        icon: 'warning',
        title: 'Você tem certeza que deseja excluir?',
        text: 'Esta operação é irreverível',
        showCancelButton: true,
        confirmButtonText: 'Sim, desejo excluir',
        cancelButtonText: 'Não, desejo cancelar'
    }) .then((result => {
        if(result.isConfirmed){
            let dados = `id_manutencao=${$(this).attr('id')}&operacao=delete`
    let url = 'api/models/manutencaoController.php'

    CRUD(dados, url)
    $('#table-manutencao').DataTable().ajax.reload()
        }
        else if (result.dismiss === Swal.DismissReason.cancel){
            Swal.fire ({
                icon: 'error',
                title: 'Frota',
                text: 'Operação cancelada',
            }) 
        } 
    }))

})

})


