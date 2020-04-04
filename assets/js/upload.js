function searchCsv(csv) { // Formata os primeiros dados para realizar a pesquisa.
    if (!csv || csv === '') {
        alert("Insira algum dado para ser buscado");
    } else {
        let key = 'AIzaSyCpMbb74LSDVZ9JXSLqikQlI1H8vmZJ0QU'; // CHAVE GOOGLE API
        let value = csv; // DADOS DO FORMULARIO PARA REALIZAR PESQUISA SEM FORMATAR
        let search = ''; // INICIA A VARIAVEL QUE RECEBERA AS INFORMAÇÕES PARA PESQUISA FORMATADAS

        // ESTE LOOP VAI LER TODOS OS DADOS QUE SERÃO PESQUISADOS E VAI REMOVER OS ESPAÇOS PARA COLOCAR -
        // A API DO GOOGLE NÃO RECONHECE ESTAÇO ENTRE AS PALAVRAS POIS ESTA MESMA IRA NA URL DE PESQUISA
        // UTILIZANDO UMA REQUISIÇÃO DO TIPO GET E POR ESTE MOTIVO A IMPORTANCIA DE TROCAR TODOS OS ESPAÇOS
        // POR TRAÇOS: https://maps.googleapis.com/maps/api/geocode/json?address=exemplo-de-pesquisa-sem-espaço

        for (let i = 0; i < value.length; i++) {

            if (value.charAt(i) != " ") { // SE NÃO ESTIVER VASIO O PONTO DE VERIFICAÇÃO

                search += value.charAt(i); // ENVIA A LETRA PARA A VARIAVEL DE PESQUISA

            } else { // SE TIVER ESPAÇO O PONTO DE VERIFICAÇÃO
                search += '-'; // ENVIA O TRAÇO PARA A VARIAVEL DE PESQUISA
            }
        }

        // FORMATAÇÃO DA URL QUE VAI PARA A REQUISIÇÃO DE PESQUISA
        console.log(search);
        let url = new URL('https://maps.googleapis.com/maps/api/geocode/json?address=' + search + '&key=' + key);

        api(url); // ENVIA OS DADOS FORMATADOS E PRONTOS PARA A FUNÇÃO API
    }

}

function Upload() {
    var fileUpload = document.getElementById("file_upload");
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
    if (regex.test(fileUpload.value.toLowerCase())) {
        if (typeof (FileReader) != "undefined") {
            var reader = new FileReader();
            reader.onload = function (e) {
                var rows = e.target.result.split("\n");
                for (var i = 1; i < 100; i++) {
                    var cells = rows[i].split(";");
                    if (cells.length > 1) {
                        console.log(cells[3] + " " + cells[4] + " " + cells[5]);
                        searchCsv(cells[3] + " " + cells[4] + " " + cells[5]);
                    }
                }
            }
            reader.readAsText(fileUpload.files[0]);
        } else {
            alert("This browser does not support HTML5.");
        }
    } else {
        alert("Please upload a valid CSV file.");
    }
}

$(document).ready(function () {
    $("#myBtn").click(function () {
        $("#myModal").modal();
        $("#add_csv").click(function () {
            Upload();
        });
    });
});