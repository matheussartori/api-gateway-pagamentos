module.exports = function(app) {
  app.get('/pagamentos', function(req, res) {
    console.log('Recebida requisição de teste na porta 3000.');
    res.send('OK');
  });

  app.post('/pagamentos/pagamento', function(req, res) {

    req.assert('forma_de_pagamento',
      'Forma de pagamento é obrigatório!').notEmpty();
    req.assert('valor',
      'Valor é obrigatório e deve ser decimal!').notEmpty().isFloat();

    var erros = req.validationErrors();
    if(erros) {
      console.log('Erros de validação encontrados.');
      res.status(400).send(erros);
      return;
    }

  	var pagamento = req.body;
  	console.log('Processando uma requisição de um novo pagamento...');

  	pagamento.status = 'CRIADO';
  	pagamento.data = new Date;

    var connection = app.persistence.connectionFactory();
    var pagamentoDao = new app.persistence.pagamentos.PagamentoDao(connection);

    pagamentoDao.salva(pagamento, function(error, result) {
      if(error) {
        console.log('Erro ao inserir no banco: ' + error);
        res.status(400).send(error);
      } else {
        console.log('Pagamento criado');
        res.json(pagamento);
      }
    });

  });
}
