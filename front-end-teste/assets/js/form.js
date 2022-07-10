// MASCARA CPF PARA INICIO DA PÁGINA
$('input[name="documento"]').mask('000.000.000-00');

// FUNÇÃO JQUERY PARA ALTERAR A LABEL DE CPF/CNPJ
$('input[name="pessoa"]').on("change", function (event) {
    $('input[name="documento"]').val('')
    if (event.target.value == "pessoa-fisica") {
        $('.formulario-documento label').html('CPF');
        // MÁSCARA JQUERY PARA CPF
        $('input[name="documento"]').mask('000.000.000-00');
    } else {
        $('.formulario-documento label').html('CNPJ');
        // MÁSCARA JQUERY PARA CNPJ
        $('input[name="documento"]').mask('00.000.000/0000-00');
    }
});

// VALIDAÇÃO PARA CPF E CNPJ
$('input[name="documento"]').on("blur", function (event) {
    let valorLabel = $('.formulario-documento label').html()
    if (valorLabel == 'CPF' && !testaCPF(event.target.value)) {
        window.alert('Digite um CPF válido.')
        $(this).val('')
    } else if (valorLabel == 'CNPJ' && !testaCNPJ(event.target.value)) {
        window.alert('Digite um CNPJ válido.')
        $(this).val('')
    }
})

// FUNÇÃO PARA LIMPAR OS CAMPOS DO CEP
function limpaCamposCep() {
    $('input[name="logradouro"]').val('')
    $('input[name="bairro"]').val('')
    $('input[name="cidade"]').val('')
    $('input[name="estado"]').val('')
}

// FUNÇÃO ASYNC PARA REQUISITAR API DO CEP
async function fetchCEP(cep) {
    const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
    const data = await resposta.json()

    // ERRO PARA CASO O CEP NÃO SEJA ENCONTRADO
    if (("erro" in data)) {
        limpaCamposCep()
        alert("CEP não encontrado.");
        $('input[name="cep"]').val('')
    }
    return data
}

// FUNÇÃO JQUERY PARA VERIFICAR O TAMANHO DO CEP AO TIRAR FOCO E COMPLETAR OS INPUTS DE LOCALIZAÇÃO.
$('input[name="cep"]').on("blur", async function (event) {
    let cepTamanho = $('input[name="cep"]').val().length
    if (cepTamanho < 9 && cepTamanho > 1) {
        window.alert('Digite um CEP válido.')
        $('input[name="cep"]').val('')
        limpaCamposCep()
        return
    }

    const cep = await fetchCEP(event.target.value);
    $('input[name="logradouro"]').val(cep.logradouro)
    $('input[name="bairro"]').val(cep.bairro)
    $('input[name="cidade"]').val(cep.localidade)
    $('input[name="estado"]').val(cep.uf)
})

// MÁSCARA JQUERY PARA CEP
$('input[name="cep"]').mask('00000-000');

// FUNÇÃO PARA TESTAR/VALIDAR O CPF 
function testaCPF(maskedCpf) {

    let cpf = maskedCpf.replace(/\D/g, '')
    let soma = 0
    let resto;
    if (cpf == "00000000000") {
        return false
    }

    for (i = 1; i <= 9; i++) {
        soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    resto = (soma * 10) % 11;

    if ((resto == 10) || (resto == 11)) {
        resto = 0;
    }

    if (resto != parseInt(cpf.substring(9, 10))) {
        return false
    }

    soma = 0;

    for (i = 1; i <= 10; i++) {
        soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    resto = (soma * 10) % 11

    if ((resto == 10) || (resto == 11)) {
        resto = 0
    }

    if (resto != parseInt(cpf.substring(10, 11))) {
        return false
    }

    return true;
}

// FUNÇÃO PARA TESTAR/VALIDAR O CNPJ
function testaCNPJ(maskedCnpj) {

    cnpj = maskedCnpj.replace(/\D/g, '');

    if (cnpj == '') {
        return false
    }

    if (cnpj.length != 14) {
        return false
    }

    // Elimina CNPJs invalidos conhecidos
    if (cnpj == "00000000000000" ||
        cnpj == "11111111111111" ||
        cnpj == "22222222222222" ||
        cnpj == "33333333333333" ||
        cnpj == "44444444444444" ||
        cnpj == "55555555555555" ||
        cnpj == "66666666666666" ||
        cnpj == "77777777777777" ||
        cnpj == "88888888888888" ||
        cnpj == "99999999999999") {
        return false
    }

    // Valida DVs
    tamanho = cnpj.length - 2
    numeros = cnpj.substring(0, tamanho);
    digitos = cnpj.substring(tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0)) {
        return false
    }

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1)) {
        return false
    }

    return true;
}

// FUNÇÃO SUBMIT DO FORMULARIO
$('#formulario-validacao').on('submit', async function (event) {
    event.preventDefault();

    const body = {
        nome: $('input[name="nome"]').val(),
        email: $('input[name="email"]').val(),
        tipoPessoa: $('input[name="pessoa"]:checked').val(),
        documento: $('input[name="documento"]').val(),
        cep: $('input[name="cep"]').val(),
        logradouro: $('input[name="logradouro"]').val(),
        bairro: $('input[name="bairro"]').val(),
        cidade: $('input[name="cidade"]').val(),
        uf: $('input[name="estado"]').val()
    }

    let resultado;


    const params = new URLSearchParams(window.location.search)
    if (params.get("id") != null && params.get("id") != "") {
        resultado = await fetch("http://localhost:8080/colaborador/" + params.get("id"), {
            method: 'PUT',
            headers: new Headers({ "Content-Type": "application/json" }),
            body: JSON.stringify(body)
        })

        if (resultado.ok) {
            window.alert('Colaborador editado')
            window.location.href = "../index.html"
        } else {
            window.alert('Erro ao editar colaborador')
        }
    } else {
        resultado = await fetch('http://localhost:8080/colaborador', {
            method: 'POST',
            headers: new Headers({ "Content-Type": "application/json" }),
            body: JSON.stringify(body)
        })

        if (resultado.ok) {
            window.alert('Colaborador cadastrado')
            window.location.href = "../index.html"
        } else {
            window.alert('Erro ao cadastrar colaborador')
        }
    }
})

// FUNÇÃO PARA COLETAR O ID E VERIFICAR A EDIÇÃO
$(document).ready(async function () {
    const params = new URLSearchParams(window.location.search)
    if (params.get("id") == null || params.get("id") == "") {
        return
    }

    const data = await fetch("http://localhost:8080/colaborador/" + params.get("id"))
    const colaborador = await data.json()

    if (colaborador.tipoPessoa == "pessoa-fisica") {
        $('#pessoa-fisica').attr("checked", true)
    } else {
        $('#pessoa-juridica').attr("checked", true)
    }

    $('input[name="nome"]').val(colaborador.nome)
    $('input[name="email"]').val(colaborador.email)
    $('input[name="documento"]').val(colaborador.documento)
    $('input[name="cep"]').val(colaborador.cep)
    $('input[name="logradouro"]').val(colaborador.logradouro)
    $('input[name="bairro"]').val(colaborador.bairro)
    $('input[name="cidade"]').val(colaborador.cidade)
    $('input[name="estado"]').val(colaborador.uf)
})