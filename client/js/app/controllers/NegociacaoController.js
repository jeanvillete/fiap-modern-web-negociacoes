class NegociacaoController {
  constructor() {
    let $ = document.querySelector.bind(document);

    this._inputData = $('#data');
    this._inputQuantidade = $('#quantidade');
    this._inputValor = $('#valor');
    this._listaNegociacoes = new ListaNegociacoes();

    this._negociacoesView = new NegociacoesView( $( '#negociacoesView' ) );
    this._negociacoesView.update( this._listaNegociacoes );

    this._mensagem = new Mensagem();
    this._mensagemView = new MensagemView( $( '#mensagemView') );
    this._mensagemView.update( this._mensagem );

    this._limpaFormulario();
  }
  
  adiciona(event) {
    event.preventDefault();

    this._listaNegociacoes.adiciona(
      this._criaNegociacao()
    );

    this._negociacoesView.update( this._listaNegociacoes );
    this._limpaFormulario();

    this._mensagem.texto = "Negociação adicionada com sucesso";
    this._mensagemView.update(this._mensagem);

    this._negociacoesView.update( this._listaNegociacoes );
  }

  _limpaFormulario() {
    this._inputData.value = "";
    this._inputData.focus();

    this._inputQuantidade.value = 1;
    this._inputValor.value = 0.0;
  }

  apaga() {
    this._listaNegociacoes.esvazia();
    this._negociacoesView.update(this._listaNegociacoes);

    this._mensagem.texto = 'Negociações apagadas com sucesso';
    this._mensagemView.update(this._mensagem);
  }

  importaNegociacoes() {
    let xhr = new XMLHttpRequest();

    xhr.open('GET', 'http://localhost:3000/negociacoes/semana');

    // 0: requisição ainda não iniciada
    // 1: conexão com o servidor estabelecida
    // 2: requisição recebida no servidor
    // 3: processando requisição no servidor
    // 4: resposta do processamento devolvida para o cliente
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          console.log("Obtendo as negociações do servidor");
          console.log(xhr.responseText);

          JSON.parse(xhr.responseText)
            .map(objeto =>
              new Negociacao(
                new Date(objeto.data),
                objeto.quantidade,
                objeto.valor
              )
            )
            .forEach(negociacao => 
              this._listaNegociacoes.adiciona(negociacao)
            );
            this._negociacoesView.update(this._listaNegociacoes);

            this._mensagem.texto = 'Negociações importadas com sucesso';
            this._mensagemView.update(this._mensagem);
        } else {
          this._mensagem.texto = 'Não foi possível importar as negociações';
          this._mensagemView.update(this._mensagem);

          console.log("Não foi possível obter as negociações do servido");
          console.log(xhr.responseText);
        }
      }
    }

    xhr.send();
  }

  _criaNegociacao() {
    return new Negociacao(
      DateHelper.textoParaData( this._inputData.value ),
      this._inputQuantidade.value,
      this._inputValor.value
    );
  }
}
