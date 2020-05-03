class NegociacaoService {

  _obterNegociacoes(url, mensagemErro) {
    return new Promise( (resolve, reject) => {
      let xhr = new XMLHttpRequest();

      xhr.open('GET', url);

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

            resolve(
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
            console.log("Não foi possível obter as negociações através da url;", url);

            reject(mensagemErro);
          }
        }
      }

      xhr.send();
    });

  }

  obterNegociacoesDaSemana() {
    return this._obterNegociacoes('http://localhost:3000/negociacoes/semana', 'Não foi possível importar as negociações da semana corrente');
  }

  obterNegociacoesDaSemanaAnterior() {
    return this._obterNegociacoes('http://localhost:3000/negociacoes/anterior', 'Não foi possível importar as negociações da semana anterior');
  }

  obterNegociacoesDaSemanaRetrasada() {
    return this._obterNegociacoes('http://localhost:3000/negociacoes/retrasada', 'Não foi possível importar as negociações da semana retrasada');
  }
}
