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
    let service = new NegociacaoService();

    Promise.all([
      service.obterNegociacoesDaSemana(),
      service.obterNegociacoesDaSemanaAnterior(),
      service.obterNegociacoesDaSemanaRetrasada()
    ])
    .then(negociacoes => {
      negociacoes.reduce(
        (arrayAchatado, array) => arrayAchatado.concat(array),
        []
      )
        .forEach(negociacao => 
          this._listaNegociacoes.adiciona(negociacao)
        );
      this._negociacoesView.update(this._listaNegociacoes);

      this._mensagem.texto = 'Negociações importadas com sucesso';
      this._mensagemView.update(this._mensagem);
    })
    .catch( (erro) => {
      this._mensagem.texto = erro;
      this._mensagemView.update(this._mensagem);
    })
  }

  _criaNegociacao() {
    return new Negociacao(
      DateHelper.textoParaData( this._inputData.value ),
      this._inputQuantidade.value,
      this._inputValor.value
    );
  }
}
