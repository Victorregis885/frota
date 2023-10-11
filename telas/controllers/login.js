$(document).ready(function(){
    $('.btn-login').click(function(e){
        e.preventDefault()
        let dados = $('#form-login').serialize()
        dados += `&operacao=login` 
        let url = 'api/models/usuarioController.php'
      
        $.ajax({
          dataType: 'JSON',
          type: 'POST',
          assync: true,
          url: url,
          data: dados,
          success: function(dados){
            if(dados.type === 'success'){
              $(location).attr('href', 'sistema.html')
          }
           else {
              Swal.fire ({
                  icon: dados.type,
                  title: 'Frota',
                  text: dados.mensagem
              })
          }
          }
      })
      })
})