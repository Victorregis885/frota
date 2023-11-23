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
                title: 'Frota',
                text: dados.mensagem
            })
            $('#modal-veiculo').modal('hide')
        }
        else if(dados.type == 'view'){
            $('#id').val(dados.dados.id)
            $('#placa').val(dados.dados.placa)
            $('#marca').val(dados.dados.marca)
            $('#combustivel').val(dados.dados.combustivel)
            $('#cor').val(dados.dados.cor)
            $('#ID_CH_USUARIO').val(dados.dados.usuario)
        }
        }
    })
}




$(document).ready(function(){
    
    carDados();

    $('#table-veiculo').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "api/models/veiculoController.php?operacao=read",
            "type": "POST"
        },
        "language": {
            "url": "assets/vendor/DataTables/pt-BR.json"
        },
        "order": [
            [0, "desc"]
        ],
        "columns": [{
                "data": 'id',
                "className": 'text-center'
            },
            {
                "data": 'placa',
                "className": 'text-left'
            },
            {
                "data": 'marca',
                "className": 'text-left'
            },
            {
                "data": 'combustivel',
                "className": 'text-left'
            },
            {
                "data": 'cor',
                "className": 'text-left'
            },
            {
                "data": 'usuario',
                "className": 'text-left'
            },
            {
                "data": 'id',
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

        $('#ID_CH_USUARIO').each(function() {
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
            url: "api/models/veiculoController.php",
            data: dados,
            success: function(dados) {
                if (dados.type == "success") {
                    $.each(dados.dados, function(indexInArray, valueOfElement) {
                        opcoes += '<option value="' + valueOfElement.id + '">' + valueOfElement.nome_usuario + '</option>';
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
    $('.modal-title').append('Cadastro de veiculo')
    $('#form-veiculo :input').val('')
    $('.btn-save').show()
    $('.btn-save').attr('data-operation', 'create')
    $('#modal-veiculo').modal('show')
    $('input').prop('disabled', false)
    $('select').prop('disabled', false)
})
$('.btn-save').click(function(e){
    e.preventDefault()

    let dados = $('#form-veiculo').serialize()
    dados += `&operacao=${$('.btn-save').attr('data-operation')}&ID=${$('#modal-veiculo').attr('data-id')}&tabela=veiculo` 
    console.log(dados)
    let url = 'api/models/veiculoController.php'

    CRUD(dados, url)

    $('#table-veiculo').DataTable().ajax.reload()
})




$('#table-veiculo').on('click', 'button.btn-view', function(e){
    e.preventDefault()
    
    $('.modal-title').empty()
    $('.modal-title').append('Visualização de registros')
    let dados = `id=${$(this).attr('id')}&operacao=view`
    let url = 'api/models/veiculoController.php'

    CRUD(dados, url)
    $('.btn-save').hide()
    $('input').prop('disabled', true)
    $('#modal-veiculo').modal('show')
})



$('#table-veiculo').on('click', 'button.btn-edit', function(e){
    e.preventDefault()
    
    $('.modal-title').empty()
    $('.modal-title').append('Edição de registros')
    let dados = `id=${$(this).attr('id')}&operacao=view`
    let url = 'api/models/veiculoController.php'

    CRUD(dados, url)
    $('.btn-save').attr('data-operation', 'update')
    $('.btn-save').show()
    $('input').prop('disabled', false)
    $('#modal-veiculo').modal('show')
    $('#table-veiculo').DataTable().ajax.reload()
})



//funçao para deletar 
$('#table-veiculo').on('click', 'button.btn-delete', function(e){
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
            let dados = `id=${$(this).attr('id')}&operacao=delete`
    let url = 'api/models/veiculoController.php'

    CRUD(dados, url)
    $('#table-veiculo').DataTable().ajax.reload()
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