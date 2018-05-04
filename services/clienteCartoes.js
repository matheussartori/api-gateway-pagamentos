var restify = require('restify-plugins');

var cliente = restify.createJsonClient({
	url: "http://localhost:3001"
});

cliente.post('/cartoes/autoriza', function(error, req, res, result) {
	console.log('Consumindo serviço de cartões...');
	console.log(retorno);
});
