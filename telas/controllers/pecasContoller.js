
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
            $('#modal-pecas').modal('hide')
        }
        else if(dados.type == 'view'){
            $('#id_peca').val(dados.dados.id_peca)
            $('#nome_peca').val(dados.dados.nome_peca)
            $('#fabricante_peca').val(dados.dados.fabricante_peca)
            $('#preco').val(dados.dados.preco)
        }
        }
    })
}




$(document).ready(function(){
    $('#table-pecas').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "api/models/pecasController.php?operacao=read",
            "type": "POST"
        },
        "language": {
            "url": "assets/vendor/DataTables/pt-BR.json"
        },
        "order": [
            [0, "desc"]
        ],
        "columns": [{
                "data": 'id_peca',
                "className": 'text-left'
            },
            {
                "data": 'nome_peca',
                "className": 'text-left'
            },
            {
                "data": 'fabricante_peca',
                "className": 'text-left'
            },
            {
                "data": 'preco',
                "className": 'text-left'
            },
            {
                "data": 'id_peca',
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




$('.btn-new').click(function(e){
    e.preventDefault()
    $('.modal-title').empty()
    $('.modal-title').append('Cadastro de Peças')
    $('#form-pecas :input').val('')
    $('.btn-save').show()
    $('.btn-save').attr('data-operation', 'create')
    $('#modal-pecas').modal('show')
    $('input').prop('disabled', false)
})
$('.btn-save').click(function(e){
e.preventDefault()

let dados = $('#form-pecas').serialize()
dados += `&operacao=${$('.btn-save').attr('data-operation')}` 

let url = 'api/models/pecasController.php'

CRUD(dados, url)

$('#table-pecas').DataTable().ajax.reload()
})



$('#table-pecas').on('click', 'button.btn-view', function(e){
    e.preventDefault()
    
    $('.modal-title').empty()
    $('.modal-title').append('Visualização de registros')
    let dados = `id_peca=${$(this).attr('id')}&operacao=view`
    let url = 'api/models/pecasController.php'

    CRUD(dados, url)
    $('.btn-save').hide()
    $('input').prop('disabled', true)
    $('#modal-pecas').modal('show')
})



$('#table-pecas').on('click', 'button.btn-edit', function(e){
    e.preventDefault()
    
    $('.modal-title').empty()
    $('.modal-title').append('Edição de registros')
    let dados = `id_peca=${$(this).attr('id')}&operacao=view`
    let url = 'api/models/pecasController.php'

    CRUD(dados, url)
    $('.btn-save').attr('data-operation', 'update')
    $('.btn-save').show()
    $('input').prop('disabled', false)
    $('#modal-pecas').modal('show')
    $('#table-pecas').DataTable().ajax.reload()
})



//funçao para deletar 
$('#table-pecas').on('click', 'button.btn-delete', function(e){
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
            let dados = `id_peca=${$(this).attr('id')}&operacao=delete`
    let url = 'api/models/pecasController.php'

    CRUD(dados, url)
    $('#table-pecas').DataTable().ajax.reload()
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

