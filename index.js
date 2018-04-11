var app = require('express')();

app.listen(3000, function() {
  console.log('Servidor rodando na porta 3000.');
});

app.get('/teste', function(req, res) {
  console.log('Recebida requisição de teste na porta 3000.');
  res.send('OK');
});
