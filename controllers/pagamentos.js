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

  	res.send(pagamento);
  });
}
