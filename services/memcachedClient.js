var memcached = require('memcached');

var client = new memcached('localhost:11211', {
  retries: 10,
  retry: 10000,
  remove: true
});

client.set('pagamento-2', {"id":2}, 60000, function(error) {
  console.log('Nova chave adicionada ao cache');
});

client.get('pagamento-2', function(error,result) {
  if(error || !result) {
    console.log('MISS - Chave não encontrada');
  } else {
    console.log('HIT - Valor: ' + JSON.stringify(result));
  }
});
