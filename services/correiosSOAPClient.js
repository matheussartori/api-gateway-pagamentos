var soap = require('soap');

soap.createClient('http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl',
  function(error, client) {
    console.log('Cliente SOAP criado.');

    client.CalcPrazo({
      "nCdServico": "40010",
      "sCepOrigem": "04101300",
      "sCepDestino": "03422001"
    },
    function(error, result){
      console.log(JSON.stringify(result));
    });
  }
);
