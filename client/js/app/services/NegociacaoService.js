class NegociacaoService {
  obterNegociacoesDaSemana(cb) {
    let xhr = new XMLHttpRequest();

    xhr.open('GET', 'http://localhost:3000/negociacoes/semana');

    // 0: requisição ainda não iniciada
    // 1: conexão com o servidor estabelecida
    // 2: requisição recebida no servidor
    // 3: processando requisição no servidor
    // 4: resposta do processamento devolvida para o cliente
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        console.log(xhr.responseText);

        if (xhr.status == 200) {
          console.log("Resposta de sucesso, obtendo as negociações do servidor");

          cb(
            null,
            JSON.parse(xhr.responseText)
              .map(objeto =>
                new Negociacao(
                  new Date(objeto.data),
                  objeto.quantidade,
                  objeto.valor
                )
              )
          );
        } else {
          console.log("Não foi possível obter as negociações do servido");

          cb('Não foi possível importar as negociações', null);
        }
      }
    }

    xhr.send();
  }
}
