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
            $('#modal-oficina').modal('hide')
        }
        else if(dados.type == 'view'){
            $('#id').val(dados.dados.id)
            $('#nome_oficina').val(dados.dados.nome_oficina)
            $('#telefone').val(dados.dados.telefone)
            $('#rua').val(dados.dados.rua)
            $('#bairro').val(dados.dados.bairro)
            $('#numero').val(dados.dados.numero)
        }
        }
    })
}




$(document).ready(function(){
    $('#table-oficina').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "api/models/oficinaController.php?operacao=read",
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
                "className": 'text-left'
            },
            {
                "data": 'nome_oficina',
                "className": 'text-left'
            },
            {
                "data": 'telefone',
                "className": 'text-left'
            },
            {
                "data": 'rua',
                "className": 'text-left'
            },
            {
                "data": 'bairro',
                "className": 'text-left'
            },
            {
                "data": 'numero',
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




$('.btn-new').click(function(e){
    e.preventDefault()
    $('.modal-title').empty()
    $('.modal-title').append('Cadastro de oficina')
    $('#form-oficina :input').val('')
    $('.btn-save').show()
    $('.btn-save').attr('data-operation', 'create')
    $('#modal-oficina').modal('show')
    $('input').prop('disabled', false)
})
$('.btn-save').click(function(e){
e.preventDefault()

let dados = $('#form-oficina').serialize()
dados += `&operacao=${$('.btn-save').attr('data-operation')}` 

let url = 'api/models/oficinaController.php'

CRUD(dados, url)

$('#table-oficina').DataTable().ajax.reload()
})



$('#table-oficina').on('click', 'button.btn-view', function(e){
    e.preventDefault()
    
    $('.modal-title').empty()
    $('.modal-title').append('Visualização de registros')
    let dados = `id=${$(this).attr('id')}&operacao=view`
    let url = 'api/models/oficinaController.php'

    CRUD(dados, url)
    $('.btn-save').hide()
    $('input').prop('disabled', true)
    $('#modal-oficina').modal('show')
})



$('#table-oficina').on('click', 'button.btn-edit', function(e){
    e.preventDefault()
    
    $('.modal-title').empty()
    $('.modal-title').append('Edição de registros')
    let dados = `id=${$(this).attr('id')}&operacao=view`
    let url = 'api/models/oficinaController.php'

    CRUD(dados, url)
    $('.btn-save').attr('data-operation', 'update')
    $('.btn-save').show()
    $('input').prop('disabled', false)
    $('#modal-oficina').modal('show')
    $('#table-oficina').DataTable().ajax.reload()
})



//funçao para deletar 
$('#table-oficina').on('click', 'button.btn-delete', function(e){
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
    let url = 'api/models/oficinaController.php'

    CRUD(dados, url)
    $('#table-oficina').DataTable().ajax.reload()
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

