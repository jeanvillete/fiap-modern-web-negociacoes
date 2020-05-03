class NegociacaoService {
  constructor() {
    this._http = new HttpService();
  }

  _obterNegociacoes(url, mensagemErro) {
    return new Promise( (resolve, reject) => {
      this._http.get(url)
        .then(negociacoesJson => {
          console.log("Resposta de sucesso, obtendo as negociações através da url; ", url);

          resolve(
            negociacoesJson.map(negociacaoJsonItem =>
              new Negociacao(
                new Date(negociacaoJsonItem.data),
                negociacaoJsonItem.quantidade,
                negociacaoJsonItem.valor
              )
            )
          )
        })
        .catch(erro => {
          console.log("Não foi possível obter as negociações através da url;", url);
          reject(mensagemErro);
        });
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
