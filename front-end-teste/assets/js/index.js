// FUNÇÃO PARA RECEBER TABELA DO BANCO DE DADOS
$(document).ready(async function () {
    const data = await fetch("http://localhost:8080/colaborador")
    const colaboradores = await data.json()
    colaboradores.forEach(colaborador => {
        $('#tabela tbody').append(
            $('<tr>').append(
                $('<td>').html(colaborador.nome),
                $('<td>').html(colaborador.documento),
                $('<td>').html(colaborador.email),
                $('<td>').html(colaborador.cidade),
                $('<td>').html(colaborador.uf),
                $('<td>').append($('<button>').addClass('tabela-editar').html('Editar').on("click", function () {
                    window.location.href = "src/form.html?id=" + colaborador.id

                })),
                $('<td>').append($('<button>').addClass('tabela-excluir').html('Excluir').on("click", async function () {
                    const data = await fetch("http://localhost:8080/colaborador/" + colaborador.id, {
                        method: "DELETE"
                    })
                    document.location.reload()
                })),
            ))
    });
})