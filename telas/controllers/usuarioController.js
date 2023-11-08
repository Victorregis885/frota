
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
            $('#modal-usuario').modal('hide')
        }
        else if(dados.type == 'view'){
            $('#id').val(dados.dados.id)
            $('#nome_usuario').val(dados.dados.nome_usuario)
            $('#login').val(dados.dados.login)
            $('#senha').val(dados.dados.senha)
            $('#email').val(dadoos.dados.email)
        }
        }
    })
}


$(document).ready(function(){

    $('.btn-logout').click(function(e){
        e.preventDefault()
        let dados = `&operacao=logout` 
        let url = 'api/models/usuariocontroller.php'
      
        $.ajax({
          dataType: 'JSON',
          type: 'POST',
          assync: true,
          url: url,
          data: dados,
          success: function(dados){
            if(dados.type === 'success'){
              $(location).attr('href', 'index.html')
              Swal.fire ({
                icon: dados.type,
                title: 'SysPed',
                text: dados.mensagem
            })
          }
           else {
              Swal.fire ({
                  icon: dados.type,
                  title: 'SysPed',
                  text: dados.mensagem
              })
          }
          }
      })
      })

    $('#table-usuario').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "api/models/usuarioController.php?operacao=read",
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
                "data": 'nome_usuario',
                "className": 'text-left'
            },
            {
                "data": 'login',
                "className": 'text-left'
            },
            {
                "data": 'senha',
                "className": 'text-left'
            },
            {
                "data": 'email',
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
    $('.modal-title').append('Cadastro de usuario')
    $('#form-usuario :input').val('')
    $('.btn-save').show()
    $('.btn-save').attr('data-operation', 'create')
    $('#modal-usuario').modal('show')
    $('input').prop('disabled', false)
})
$('.btn-save').click(function(e){
   e.preventDefault()

   let dados = $('#form-usuario').serialize()
   dados += `&operacao=${$('.btn-save').attr('data-operation')}` 
   
   let url = 'api/models/usuarioController.php'
   
   CRUD(dados, url)

   $('#table-usuario').DataTable().ajax.reload()
})

$('#table-usuario').on('click', 'button.btn-view', function(e){
    e.preventDefault()
    
    $('.modal-title').empty()
    $('.modal-title').append('Visualização de registros')
    let dados = `id=${$(this).attr('id')}&operacao=view`
    let url = 'api/models/usuarioController.php'

    CRUD(dados, url)
    $('.btn-save').hide()
    $('input').prop('disabled', true)
    $('#modal-usuario').modal('show')
})

$('#table-usuario').on('click', 'button.btn-edit', function(e){
    e.preventDefault()
    
    $('.modal-title').empty()
    $('.modal-title').append('Edição de registros')
    let dados = `id=${$(this).attr('id')}&operacao=view`
    let url = 'api/models/usuarioController.php'

    CRUD(dados, url)
    $('.btn-save').attr('data-operation', 'update')
    $('.btn-save').show()
    $('input').prop('disabled', false)
    $('#modal-usuario').modal('show')
    $('#table-usuario').DataTable().ajax.reload()
})

$('#table-usuario').on('click', 'button.btn-delete', function(e){
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
    let url = 'api/models/usuarioController.php'

    CRUD(dados, url)
    $('#table-usuario').DataTable().ajax.reload()
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