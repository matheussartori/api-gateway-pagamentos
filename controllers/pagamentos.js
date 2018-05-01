module.exports = function(app) {
  app.get('/pagamentos', function(req, res) {
    console.log('Recebida requisição de teste na porta 3000.');
    res.send('OK');
  });

  app.post('/pagamentos/pagamento', function(req, res) {
  	var pagamento = req.body;
  	console.log('Processando uma requisição de um novo pagamento...');

  	pagamento.status = 'CRIADO';
  	pagamento.data = new Date;

    var connection = app.persistence.connectionFactory();
    var pagamentoDao = new app.persistence.pagamentos.PagamentoDao(connection);

    pagamentoDao.salva(pagamento, function(error, result) {
      if(error) {
        res.send(error);
      } else {
        console.log('Pagamento criado');
        res.json(pagamento);
      }
    });

  });
}
