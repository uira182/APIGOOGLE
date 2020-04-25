/* ************************** SELELÇAO DO FORMATO DE PESQUISA **************************** */

// VERIFICA SE FOI SELECIONADO REALIZAR BUSCA POR ENDEREÇO, CEP OU GEOLOCALIZAÇÃO.

function OptionUpload() {

    let option = $("input[name='option']:checked").val(); // SELECIONA O INPUT RADIO PARA VERIFICAR O ELEMENTO SELECIONADO.

    // IDENTIFICA O IMPUT SELECIONADO
    switch (option) {
        case 'end': // CASO ENDEREÇO
            //END
            UploadEnd(); // EXECUTA FUNÇÃO PARA PROSSEGUIR A PESQUISA POR ENDEREÇO
            break; // FINALIZA
        case 'cep': // CASO CEP
            //CEP
            UploadCep(); // EXECUTA FUNÇÃO PARA PROSSEGUIR A PESQUISA POR CEP
            break; // FINALIZA
        case 'geo': // CASO GEOLOCALIZAÇÃO
            //GEO
            UploadGeo(); // EXECUTA FUNÇÃO PARA PROSSEGUIR A PESQUISA POR GEOLOCALIZAÇÃO
            break; // FINALIZA
        default: // AVISO DE ERRO SE NÃO ENCONTRAR UMA OPÇÃO
            alert("Erro! Não foi encontrado opção para busca."); // ALERTA
            console.log("Erro! Não foi encontrado opção para busca."); // PRINT NO CONSOLE
            break; // FINALIZA
    }
}

/* *************************************************************************************** */

/* ****************************** LEITURA DE DADOS CSV END ******************************* */

// FUNÇÃO PARA REALIZAR BUSCA POR ENDEREÇO

function UploadEnd() {
    let fileUpload = document.getElementById("file_upload"); // IDENTIFICA O ELEMENTO INPUT ONDE SELECIONOU O ARQUIVO
    let regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/; // ALGORITMO PARA VERIFICAÇÃO DE ARQUIVOS CSV OU TXT
    let id = []; // INICIA UM ARRAY PARA RECEBER O ID DE CADA PESQUISA
    let origem = ''; // INICIA UMA VARIAVEL PARA RECEBER A ORIGEM DA PESQUISA
    let destino = ''; // INICIA UMA VARIAVEL PARA RECEBER O DESTINO DA PESQUISA
    let cont = 0; // INICIA UM CONTADOR QUE IRA CONTROLAR A QUANTIDADE DE PESQUISAS VAMOS REALIZAR POR REQUISIÇÃO

    if (regex.test(fileUpload.value.toLowerCase())) { // FORMATA O ARQUIVO E VERIFICA SE ESTA NA EXTENÇÃO CSV OU TXT

        if (typeof(FileReader) != "undefined") { // SE APOS A LEITURA FOR ENCONTRADO O ARQUIVO CORRETAMENTE

            let reader = new FileReader(); // FORMATA O ARQUIVO CRIANDO UM OBJETO

            reader.onload = function(e) { // ABRE O ARQUIVO PARA COLETAR OS DADOS

                let rows = e.target.result.split("\n"); // COMEÇA A CRIAR AS LINHAS
                let cells = ''; // INICA A VARIAVEL QUE RECEBERA AS COLUNAS;
                let max = rows.length; // INICIA A VARIAVEL DE CONTROLE DE MAXIMO DE LINHAS
                let end = max - 1; // INICIA A VARIAVEL DE CONTROLE PARA FINALIZAR A COLETA DE ENDEREÇOS POR REQUISIÇÃO
                let ends = 20 - 1; // INICIA A VARIAVEL DE CONTROLE PARA QUANTIDADE DE ENDEREÇOS POR REQUISIÇÃO

                for (let i = 1; i < max; i++) { // REPETIÇÃO PARA PERCORRER TODAS AS LINHAS

                    if (rows[i].split(";").length > 1) { // VERIFICA SE ENCONTRA O SIMBOLO ; DENTRO DE UMA LINHA
                        cells = rows[i].split(";"); // DIVIDE AS COLUNAS SEPARANDO POR ;
                    }

                    if (cells.length > 1) { // SE EXISTIR MAIS DE UMA COLUNA POR LINHA

                        if (cont < 1) { // UTILIZA O CONTADOR PARA ENCONTRAR O PRIMEIRO MOMENTO
                            origem += cells[5] + " " + cells[6]; // ATRIBUI O ENDEREÇO E A CIDADE A VARIAVEL ORIGEM FORMATANDO
                            destino = cells[10] + " " + cells[11]; // ATRIBUI O ENDEREÇO E A CIDADE A VARIAVEL DESTINO FORMATANDO
                            id.push(cells[2]); // ATRIBUI O ID DA PESQUISA AO ARRAY ID
                            cont++; // INCREMENTO DO CONTADOR PARA CONTROLAR O FLUXO 
                        } else if (cont > 0 && cont < ends && i < end) { // SE O CONTADOR JA PASSOU UMA VEZ E FOR MENOR QUE O LIMITE E AINDA NÃO CHEGAR AO FIM DO LOOP
                            origem += "|" + cells[5] + " " + cells[6]; // ATRIBUI O ENDEREÇO E A CIDADE A VARIAVEL ORIGEM FORMATANDO
                            id.push(cells[2]); // ATRIBUI O ID DA PESQUISA AO ARRAY ID
                            cont++; // INCREMENTO DO CONTADOR PARA CONTROLAR O FLUXO 
                        } else if (cont == ends || i == end) { // SE O CONTADOR CHEGAR AO FIM OU SE A QUANTIDADE DE ENDEREÇOS
                            origem += "|" + cells[5] + " " + cells[6]; // ATRIBUI O ENDEREÇO E A CIDADE A VARIAVEL ORIGEM FORMATANDO
                            id.push(cells[2]); // ATRIBUI O ID DA PESQUISA AO ARRAY ID

                            origem = formatEnd(origem); // ENVIA A VARIAVEL ORIGEM PARA SER FORMATADO NA FUNÇÃO FORMATEND
                            destino = formatEnd(destino); // ENVIA A VARIAVEL DESTINO PARA SER FORMATADO NA FUNÇÃO FORMATEND

                            searchCsv(id, origem, destino); // CONTINUA A PESQUISA ENVIANDO OS IDS, ORIGENS E DESTINO

                            id = []; // ZERA O ARRAY PARA INICIAR NOVAMENTE PARA PREENCHER
                            origem = ''; // ZERA A ORIGEM PARA CONTINUAR A RECEBER OUTRAS ORIGENS
                            destino = ''; // ZERA O DESTINO PARA CONTINUAR A RECEBER OUTRO DESTINO
                            cont = 0; // ZERA O CONTADOR PARA INICIAR NOVAMENTE
                        }

                    }
                }
            }

            reader.readAsText(fileUpload.files[0]); // REALIZA AS OPERAÇÕES

        } else { // SE O ARQUIVO NÃO FOR POSSIVEL DE SE ABRIR

            alert("This browser does not support HTML5."); // ALERTA

        }
    } else { // SE O ARQUIVO SELECIONADO NÃO FOR UM ARQUIVO CSV OU TXT

        alert("Please upload a valid CSV file."); // ALERTA

    }
}

/* *************************************************************************************** */

/* ******************************* FORMATAÇÃO DE PESQUISA ******************************** */

function formatEnd(end) { // RECEBE O ENDEREÇO E SUBSTITUI OS ESPAÇOS POR +

    let search = ''; // INICIO DE UMA VARIAVEL PARA RECEBER O ENDEREÇO FORMATADO

    for (let i = 0; i < end.length; i++) { // PERCORRE TODOS OS ESPAÇOS DA VARIAVEL end
        /*
            if (i == 0) {
                let r = i;
                let ru = 0;
                let ua = 0;
                if (end.charAt(r) == "R" || end.charAt(r) == "r") {
                    u = i + 1;
                    if (end.charAt(ru) == "U" || end.charAt(ru) == "u") {
                        a = u + 1;
                        if (end.charAt(ua) == "A" || end.charAt(ua) == "a") {
                            i++;
                        }
                        i++;
                    }
                    search += "Rua";
                    i++;
                }
            }
        */
        if (end.charAt(i) != " ") { // SE NÃO ESTIVER VASIO O PONTO DE VERIFICAÇÃO

            search += end.charAt(i); // ENVIA A LETRA PARA A VARIAVEL DE PESQUISA

        } else { // SE TIVER ESPAÇO O PONTO DE VERIFICAÇÃO
            search += '+'; // ENVIA O TRAÇO PARA A VARIAVEL DE PESQUISA
        }
    }
    return search; // RETORNA O RESULTADO FORMATADO
}

/* *************************************************************************************** */

/* ****************************** LEITURA DE DADOS CSV CEP ******************************* */

function UploadCep() {
    let fileUpload = document.getElementById("file_upload"); // IDENTIFICA O ELEMENTO INPUT ONDE SELECIONOU O ARQUIVO
    let regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/; // ALGORITMO PARA VERIFICAÇÃO DE ARQUIVOS CSV OU TXT
    let id = []; // INICIA UM ARRAY PARA RECEBER O ID DE CADA PESQUISA
    let origem = ''; // INICIA UMA VARIAVEL PARA RECEBER A ORIGEM DA PESQUISA
    let destino = ''; // INICIA UMA VARIAVEL PARA RECEBER O DESTINO DA PESQUISA
    let cont = 0; // INICIA UM CONTADOR QUE IRA CONTROLAR A QUANTIDADE DE PESQUISAS VAMOS REALIZAR POR REQUISIÇÃO

    if (regex.test(fileUpload.value.toLowerCase())) { // FORMATA O ARQUIVO E VERIFICA SE ESTA NA EXTENÇÃO CSV OU TXT

        if (typeof(FileReader) != "undefined") { // SE APOS A LEITURA FOR ENCONTRADO O ARQUIVO CORRETAMENTE

            let reader = new FileReader(); // FORMATA O ARQUIVO CRIANDO UM OBJETO

            reader.onload = function(e) { // ABRE O ARQUIVO PARA COLETAR OS DADOS

                let rows = e.target.result.split("\n"); // COMEÇA A CRIAR AS LINHAS
                let cells = ''; // INICA A VARIAVEL QUE RECEBERA AS COLUNAS;
                let max = rows.length; // INICIA A VARIAVEL DE CONTROLE DE MAXIMO DE LINHAS
                let end = max - 1; // INICIA A VARIAVEL DE CONTROLE PARA FINALIZAR A COLETA DE ENDEREÇOS POR REQUISIÇÃO
                let ends = 20 - 1; // INICIA A VARIAVEL DE CONTROLE PARA QUANTIDADE DE ENDEREÇOS POR REQUISIÇÃO

                for (let i = 1; i < max; i++) { // REPETIÇÃO PARA PERCORRER TODAS AS LINHAS

                    if (rows[i].split(";").length > 1) { // VERIFICA SE ENCONTRA O SIMBOLO ; DENTRO DE UMA LINHA
                        cells = rows[i].split(";"); // DIVIDE AS COLUNAS SEPARANDO POR ;
                    }

                    if (cells.length > 1) { // SE EXISTIR MAIS DE UMA COLUNA POR LINHA

                        if (cont < 1) { // UTILIZA O CONTADOR PARA ENCONTRAR O PRIMEIRO MOMENTO
                            origem += cells[7].replace('-', ''); // ATRIBUI O ENDEREÇO E A CIDADE A VARIAVEL ORIGEM FORMATANDO
                            destino = cells[12].replace('-', ''); // ATRIBUI O ENDEREÇO E A CIDADE A VARIAVEL DESTINO FORMATANDO
                            id.push(cells[2]); // ATRIBUI O ID DA PESQUISA AO ARRAY ID
                            cont++; // INCREMENTO DO CONTADOR PARA CONTROLAR O FLUXO
                        } else if (cont > 0 && cont < ends && i < end) { // SE O CONTADOR JA PASSOU UMA VEZ E FOR MENOR QUE O LIMITE E AINDA NÃO CHEGAR AO FIM DO LOOP
                            origem += "|" + cells[7].replace('-', ''); // ATRIBUI O ENDEREÇO E A CIDADE A VARIAVEL ORIGEM FORMATANDO
                            id.push(cells[2]); // ATRIBUI O ID DA PESQUISA AO ARRAY ID
                            cont++; // INCREMENTO DO CONTADOR PARA CONTROLAR O FLUXO
                        } else if (cont == ends || i == end) { // SE O CONTADOR CHEGAR AO FIM OU SE A QUANTIDADE DE ENDEREÇOS
                            origem += "|" + cells[7].replace('-', ''); // ATRIBUI O ENDEREÇO E A CIDADE A VARIAVEL ORIGEM FORMATANDO
                            id.push(cells[2]); // ATRIBUI O ID DA PESQUISA AO ARRAY ID

                            searchCsv(id, origem, destino); // CONTINUA A PESQUISA ENVIANDO OS IDS, ORIGENS E DESTINO

                            id = []; // ZERA O ARRAY PARA INICIAR NOVAMENTE PARA PREENCHER
                            origem = ''; // ZERA A ORIGEM PARA CONTINUAR A RECEBER OUTRAS ORIGENS
                            destino = ''; // ZERA O DESTINO PARA CONTINUAR A RECEBER OUTRO DESTINO
                            cont = 0; // ZERA O CONTADOR PARA INICIAR NOVAMENTE
                        }

                    }
                }
            }

            reader.readAsText(fileUpload.files[0]); // REALIZA AS OPERAÇÕES

        } else { // SE O ARQUIVO NÃO FOR POSSIVEL DE SE ABRIR

            alert("This browser does not support HTML5."); // ALERTA

        }
    } else { // SE O ARQUIVO SELECIONADO NÃO FOR UM ARQUIVO CSV OU TXT

        alert("Please upload a valid CSV file."); // ALERTA

    }
}

/* *************************************************************************************** */

/* ****************************** LEITURA DE DADOS CSV GEO ******************************* */

function UploadGeo() {
    let fileUpload = document.getElementById("file_upload"); // IDENTIFICA O ELEMENTO INPUT ONDE SELECIONOU O ARQUIVO
    let regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/; // ALGORITMO PARA VERIFICAÇÃO DE ARQUIVOS CSV OU TXT
    let id = []; // INICIA UM ARRAY PARA RECEBER O ID DE CADA PESQUISA
    let origem = ''; // INICIA UMA VARIAVEL PARA RECEBER A ORIGEM DA PESQUISA
    let destino = ''; // INICIA UMA VARIAVEL PARA RECEBER O DESTINO DA PESQUISA
    let cont = 0; // INICIA UM CONTADOR QUE IRA CONTROLAR A QUANTIDADE DE PESQUISAS VAMOS REALIZAR POR REQUISIÇÃO

    if (regex.test(fileUpload.value.toLowerCase())) { // FORMATA O ARQUIVO E VERIFICA SE ESTA NA EXTENÇÃO CSV OU TXT

        if (typeof(FileReader) != "undefined") { // SE APOS A LEITURA FOR ENCONTRADO O ARQUIVO CORRETAMENTE

            let reader = new FileReader(); // FORMATA O ARQUIVO CRIANDO UM OBJETO

            reader.onload = function(e) { // ABRE O ARQUIVO PARA COLETAR OS DADOS

                let rows = e.target.result.split("\n"); // COMEÇA A CRIAR AS LINHAS
                let cells = ''; // INICA A VARIAVEL QUE RECEBERA AS COLUNAS;
                let max = rows.length; // INICIA A VARIAVEL DE CONTROLE DE MAXIMO DE LINHAS
                let end = max - 1; // INICIA A VARIAVEL DE CONTROLE PARA FINALIZAR A COLETA DE ENDEREÇOS POR REQUISIÇÃO
                let ends = 20 - 1; // INICIA A VARIAVEL DE CONTROLE PARA QUANTIDADE DE ENDEREÇOS POR REQUISIÇÃO

                for (let i = 1; i < max; i++) { // REPETIÇÃO PARA PERCORRER TODAS AS LINHAS

                    if (rows[i].split(";").length > 1) { // VERIFICA SE ENCONTRA O SIMBOLO ; DENTRO DE UMA LINHA
                        cells = rows[i].split(";"); // DIVIDE AS COLUNAS SEPARANDO POR ;
                    }

                    if (cells.length > 1) { // SE EXISTIR MAIS DE UMA COLUNA POR LINHA

                        if (cont < 1) { // UTILIZA O CONTADOR PARA ENCONTRAR O PRIMEIRO MOMENTO
                            origem += cells[3].replace(",", ".") + "," + cells[4].replace(",", "."); // ATRIBUI O ENDEREÇO E A CIDADE A VARIAVEL ORIGEM FORMATANDO
                            destino = cells[8].replace(",", ".") + "," + cells[9].replace(",", "."); // ATRIBUI O ENDEREÇO E A CIDADE A VARIAVEL DESTINO FORMATANDO
                            id.push(cells[2]); // ATRIBUI O ID DA PESQUISA AO ARRAY ID
                            cont++; // INCREMENTO DO CONTADOR PARA CONTROLAR O FLUXO
                        } else if (cont > 0 && cont < ends && i < end) { // SE O CONTADOR JA PASSOU UMA VEZ E FOR MENOR QUE O LIMITE E AINDA NÃO CHEGAR AO FIM DO LOOP
                            origem += "|" + cells[3].replace(",", ".") + "," + cells[4].replace(",", "."); // ATRIBUI O ENDEREÇO E A CIDADE A VARIAVEL ORIGEM FORMATANDO
                            id.push(cells[2]); // ATRIBUI O ID DA PESQUISA AO ARRAY ID
                            cont++; // INCREMENTO DO CONTADOR PARA CONTROLAR O FLUXO
                        } else if (cont == ends || i == end) { // SE O CONTADOR CHEGAR AO FIM OU SE A QUANTIDADE DE ENDEREÇOS
                            origem += "|" + cells[3].replace(",", ".") + "," + cells[4].replace(",", "."); // ATRIBUI O ENDEREÇO E A CIDADE A VARIAVEL ORIGEM FORMATANDO
                            id.push(cells[2]); // ATRIBUI O ID DA PESQUISA AO ARRAY ID

                            searchCsv(id, origem, destino); // CONTINUA A PESQUISA ENVIANDO OS IDS, ORIGENS E DESTINO

                            id = []; // ZERA O ARRAY PARA INICIAR NOVAMENTE PARA PREENCHER
                            origem = ''; // ZERA A ORIGEM PARA CONTINUAR A RECEBER OUTRAS ORIGENS
                            destino = ''; // ZERA O DESTINO PARA CONTINUAR A RECEBER OUTRO DESTINO
                            cont = 0; // ZERA O CONTADOR PARA INICIAR NOVAMENTE
                        }

                    }
                }
            }

            reader.readAsText(fileUpload.files[0]); // REALIZA AS OPERAÇÕES

        } else { // SE O ARQUIVO NÃO FOR POSSIVEL DE SE ABRIR

            alert("This browser does not support HTML5."); // ALERTA

        }
    } else { // SE O ARQUIVO SELECIONADO NÃO FOR UM ARQUIVO CSV OU TXT

        alert("Please upload a valid CSV file."); // ALERTA

    }
}

/* *************************************************************************************** */

/* ********************************** FORMATA URL DA API ********************************* */

function searchCsv(id, origem, destino) { // Formata os primeiros dados para realizar a pesquisa.
    if (!origem || origem === '' || !destino || destino === '') { // VERIFICA SE EXISTE VARIVEL ORIGEM 

        alert("Insira algum dado para ser buscado"); // ALERTA SE NÃO FOR ENCONTRADO ORIGEM

    } else { // SE NÃO ESTIVER VASIO A ORIGEM E O DESTINO

        let key = 'AIzaSyCLsOIrFTC-vnAgiBWtnX0ZUqPvc0G3qRk'; // CHAVE GOOGLE API

        let url = "https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=" + origem + "&destinations=" + destino + "&key=" + key; // FORMATA O LINK DA API
        console.log(url);
        //apiCsv(id, url); // ENVIA OS DADOS FORMATADOS E PRONTOS PARA A FUNÇÃO API

    }

}

/* *************************************************************************************** */

/* ******************************** REALIZAÇÃO DA PESQUISA ******************************* */

function apiCsv(id, url) { // RECEBE OS DADOS FORMATADOS E IRA BUSCAR OS DADOS DA API

    let xhr = new XMLHttpRequest(); // CRIA O OBJETO QUE REALIZARA A CONEXAO COM A API
    xhr.open("GET", url, true); // CONFIGURA A FORMA DE COMUNICAÇÃO GET E A URL E FORMA DE RETORNO DOS DADOS
    xhr.setRequestHeader("Accept", "application/json"); // FORMA DE RETORNO DE DADOS JSON
    xhr.onreadystatechange = function() { // REALIZA A COMUNICAÇÃO
        // SE O RETORNO FOR CORRETO COM RESULTADO 200
        if ((xhr.readyState == 0 || xhr.readyState == 4)) {
            switch (xhr.status) {
                case 200:
                    //console.log(xhr.responseText);

                    // EXECUTA A FUNÇÃO PREENCHE GOOGLE PARA PODER FORMATAR OS DADOS A SEREM EXIBIDOS
                    preencheGoogleCsv(id, xhr.responseText);
                    break;
                case 400:
                    alert('ERRO:400 - Informações incorretas');
                    break;
                default:
                    alert('Erro - Inesperado');
                    console.log(xhr.status);
                    break;
            }
        }
    };
    xhr.send();
}

/* *************************************************************************************** */

/* **************************** FORMATA OS DADOS PARA EXIBIR ***************************** */

function preencheGoogleCsv(id, dados) { // RECEBE OS DADOS DA COMUNICAÇÃO PARA FORMATAR CORRETAMENTE

    let origem = ''; // INICIA VARIAVEL QUE IRA RECEBER ORIGEM A SER EXIBIDO
    let destino = ''; // INICIA VARIAVEL QUE IRA RECEBER DESTIDO A SER EXIBIDO
    let distancia = ''; // INICIA VARIAVEL QUE IRA RECEBER A DISTANCIA A SER EXIBIDA
    let duracao = ''; // INICIA VARIAVEL QUE IRA RECEBER A DURAÇÃO A SER EXIBIDA

    let search = JSON.parse(dados); // CONVERTE OS DADOS EM TEXTO JSON PARA OBJETO JSON

    let status = ''; // INICIA VARIAVEL QUE IRA IDENTIFICAR O STATUS DA PESQUISA

    for (let i = 0; i < search.origin_addresses.length; i++) { // PERCORRER TODOS OS ENDEREÇOS PESQUISADOS

        status = search.rows[i].elements[0].status; // CAPTURA O STATUS DO ENDEREÇO PESQUISADO

        if (status == "OK") { // SE O STATUS NÃO TIVER ERROS

            origem = search.origin_addresses[i]; // ATRIBUI A VARIAVEL ORIGEM AS INFORMAÇÕES RECEBIDAS DA API
            destino = search.destination_addresses[0]; // ATRIBUI A VARIAVEL DESTINO AS INFORMAÇÕES RECEBIDAS DA API
            distancia = search.rows[i].elements[0].distance.text; // ATRIBUI A DISTANCIA AS INFORMAÇÕES RECEBIDAS DA API
            duracao = search.rows[i].elements[0].duration.text; // ATRIBUI A DURAÇÃO AS INFORMAÇÕES RECEBIDAS DA API

            printListCsv(id[i], origem, destino, distancia, duracao); // EXECUTA A FUNÇÃO QUE EXIBE NA TELA OS DADOS

        } else { // SE ENCONTRAR ERRO NA PESQUISA

            if (search.origin_addresses[i] == '') { // SE O ENDEREÇO ESTIVER VAZIO

                origem = "Não encontrado origem"; // ATRIBUI A VARIAVEL ORIGEM A INFORMAÇÃO DE NÃO ENCONTRADO

            } else {

                origem = search.origin_addresses[i]; // ATRIBUI A VARIAVEL ORIGEM AS INFORMAÇÕES RECEBIDAS DA API

            }

            if (search.destination_addresses[0] == '') {

                destino = "Não encontrado origem"; // ATRIBUI A VARIAVEL DESTINO A INFORMAÇÃO DE NÃO ENCONTRADO

            } else {

                destino = search.destination_addresses[0]; // ATRIBUI A VARIAVEL DESTINO AS INFORMAÇÕES RECEBIDAS DA API

            }

            distancia = "ERRO"; // ATRIBUI A VARIAVEL DISTANCIA A INFORMAÇÃO DE ERRO
            duracao = "ERRO"; // ATRIBUI A VARIAVEL DURAÇÃO A INFORMAÇÃO DE ERRO

            printListCsv(id[i], origem, destino, distancia, duracao); // EXECUTA A FUNÇÃO QUE EXIBE NA TELA OS DADOS
        }
    }
}

/* *************************************************************************************** */

/* ******************************* EXIBE OS DADOS NA TELA ******************************** */

function printListCsv(id, endereco, cep, lat, lng) { // EXIBE OS DADOS FORMATADOS NA TABELA

    tableSearch = document.querySelector("#dataSearch"); // BUSCA A POSIÇÃO ONDE SERA INSERIDO OS DADOS

    let htmlTable = ''; // CRIA A VARIAVEL QUE RECEBERA O CODIGO HTML PARA EXIBIR NA TABELA

    htmlTable = "<tr class='lineTable'>";
    htmlTable += "<td class='text-left'>" + id + "</td>";
    htmlTable += "<td class='text-left'>" + endereco + "</td>";
    htmlTable += "<td class='text-left'>" + cep + "</td>";
    htmlTable += "<td class='text-left'>" + lat + "</td>";
    htmlTable += "<td class='text-left'>" + lng + "</td>";
    htmlTable += "<th class='text-center'>";
    htmlTable += "<a href='#' id='delLine' onclick='delRow(this.parentNode.parentNode.rowIndex)'>";
    htmlTable += "<i class='fa fa-times-circle text-danger'>";
    htmlTable += "</i>";
    htmlTable += "</a>";
    htmlTable += "</th>";
    htmlTable += "</tr>";

    tableSearch.innerHTML += htmlTable; // INSERE OS DADOS NA TABELA

    clearInputCsv(); // EXECUTA A FUNÇÃO QUE LIMPARA OS DADOS DA PESQUISA PÓS EXIBIR
}

/* *************************************************************************************** */

/* ***************************** LIMPA OS DADOS DE PESQUISA ****************************** */

function clearInputCsv() { // FUNÇÃO PARA LIMPARA OS DADOS DE PESQUISA
    document.getElementById("srcInp").value = ''; // LIMPA OS DADOS DO IMPUT
}

/* *************************************************************************************** */

function OptionSel() {

    let option = $("input[name='option']:checked").val(); // SELECIONA O INPUT RADIO PARA VERIFICAR O ELEMENTO SELECIONADO.

    // IDENTIFICA O IMPUT SELECIONADO
    switch (option) {
        case 'end': // CASO ENDEREÇO
            //END
            UploadEnd(); // EXECUTA FUNÇÃO PARA PROSSEGUIR A PESQUISA POR ENDEREÇO
            break; // FINALIZA
        case 'cep': // CASO CEP
            //CEP
            UploadCep(); // EXECUTA FUNÇÃO PARA PROSSEGUIR A PESQUISA POR CEP
            break; // FINALIZA
        case 'geo': // CASO GEOLOCALIZAÇÃO
            //GEO
            UploadGeo(); // EXECUTA FUNÇÃO PARA PROSSEGUIR A PESQUISA POR GEOLOCALIZAÇÃO
            break; // FINALIZA
        default: // AVISO DE ERRO SE NÃO ENCONTRAR UMA OPÇÃO
            alert("Erro! Não foi encontrado opção para busca."); // ALERTA
            console.log("Erro! Não foi encontrado opção para busca."); // PRINT NO CONSOLE
            break; // FINALIZA
    }
}
/* ********************************** INICI DO SISTEMA *********************************** */

$(document).ready(function() { // QUANDO A PAGINA FOR CARREGADA COMPLETAMENTE

    $("#myBtn").click(function() { // SE FOR CLICADO NO BOTÃO DE PESQUISA POR CSV

        $("#myModal").modal(); // CHAMA O MODAL

        $("#add_csv").click(function() { // SE FOR CLICADO NO BOTÃO DE PESQUISA DO MODAL

            OptionUpload(); // EXECUTA A FUNÇÃO DE OPÇÃO DE UPLOAD DO ARQUIVO E INICIA 

        });
    });

});

/* *************************************************************************************** */