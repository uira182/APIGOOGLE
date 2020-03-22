$(document).ready(function() {
    $("#busca_cep").click(function() {
        var cep = $("#cep").val().replace(/[^0-9]/, '');
        if (cep) {
            var url = 'https://viacep.com.br/ws/' + cep + '/json/?callback=crmall';
            $.ajax({
                url: url,
                dataType: 'jsonp',
                crossDomain: true,
                contentType: "application/json",
                success: function(json) {
                    if (json.erro) {

                        $("#endereco").prop("disabled", true);
                        $("#numero").prop("disabled", true);
                        $("#bairro").prop("disabled", true);
                        $("#complemento").prop("disabled", true);
                        $("#cidade").prop("disabled", true);
                        $("#estado").prop("disabled", true);

                        var erroCep = '';

                        erroCep += '<div class="alert alert-danger mt-2">';
                        erroCep += '<strong>Erro!</strong>';
                        erroCep += ' Não foi encontrado o CEP informado.';
                        erroCep += '</div>';

                        $("#erroCep").html(erroCep);
                        //document.getElementById("erroCep").innerHTML = erroCep;

                    } else {

                        $("#erroCep").html("");
                        $("#cep").prop("disabled", true);
                        $("#endereco").prop("disabled", false);
                        $("#numero").prop("disabled", false);
                        $("#bairro").prop("disabled", false);
                        $("#complemento").prop("disabled", false);

                        if (!json.localidade) {
                            $("#cidade").prop("disabled", false);
                        } else {
                            $("#cidade").val(json.localidade);
                        }

                        if (!json.uf) {
                            $("#estado").prop("disabled", false);
                        } else {
                            $("#estado").val(json.uf);
                        }

                        $("#endereco").val(json.logradouro);
                        $("#bairro").val(json.bairro);
                        $("#complemento").val(json.complemento);
                    }
                }
            });
        }
    });

    $("#form_edt").submit(function(e) {
        if (!confirm("Deseja realmente atualizar os dados?")) {
            e.preventDefault();
        } else {
            $("#cep").prop("disabled", false);
            $("#endereco").prop("disabled", false);
            $("#numero").prop("disabled", false);
            $("#bairro").prop("disabled", false);
            $("#complemento").prop("disabled", false);
            $("#cidade").prop("disabled", false);
            $("#estado").prop("disabled", false);
        }
    });
});