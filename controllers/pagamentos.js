var logger = require('../services/logger.js');

module.exports = function (app) {
    app.get('/pagamentos', function (req, res) {
        console.log('Recebida requisição de teste na porta 3000.');
        res.send('OK');
    });

    app.get('/pagamentos/pagamento/:id', function(req,res) {
      var id = req.params.id;

      console.log('Consultando pagamento: ' + id);
      logger.info('Consultando pagamento: ' + id);

      var memcachedClient = app.services.memcachedClient();

      memcachedClient.get('pagamento-' + id, function(error,result) {
        if(error || !result) {
          console.log('MISS - Chave não encontrada');

          var connection = app.persistence.connectionFactory();
          var pagamentoDao = new app.persistence.pagamentos.PagamentoDao(connection);

          pagamentoDao.buscaPorId(id, function(error,resultado) {
            if(error) {
              console.log('Erro ao consultar pagamento. ' + error);
              res.status(500).send(error);
              return;
            }
            console.log('Pagamento encontrado: ' + JSON.stringify(resultado));
            res.json(resultado);
            return;
          });

        } else {
          console.log('HIT - Valor: ' + JSON.stringify(result));
          res.json(result);
          return;
        }
      });

    });

    app.delete('/pagamentos/pagamento/:id', function (req, res) {
        var pagamento = {};
        var id = req.params.id;

        pagamento.id = id;
        pagamento.status = 'CANCELADO';

        var connection = app.persistence.connectionFactory();
        var pagamentoDao = new app.persistence.pagamentos.PagamentoDao(connection);

        pagamentoDao.atualiza(pagamento, function (error) {
            if (error) {
                res.status(500).send(error);
                return;
            }
            console.log('Pagamento cancelado.');
            res.status(204).send(pagamento);
        });
    });

    app.put('/pagamentos/pagamento/:id', function (req, res) {
        var pagamento = {};
        var id = req.params.id;

        pagamento.id = id;
        pagamento.status = 'CONFIRMADO';

        var connection = app.persistence.connectionFactory();
        var pagamentoDao = new app.persistence.pagamentos.PagamentoDao(connection);

        pagamentoDao.atualiza(pagamento, function (error) {
            if (error) {
                res.status(500).send(error);
                return;
            }
            console.log('Pagamento confirmado.');
            res.status(200).send(pagamento);
        });
    });

    app.post('/pagamentos/pagamento', function (req, res) {
        req.assert('pagamento.forma_de_pagamento',
            'Forma de pagamento é obrigatório!').notEmpty();
        req.assert('pagamento.valor',
            'Valor é obrigatório e deve ser decimal!').notEmpty().isFloat();

        var erros = req.validationErrors();
        if (erros) {
            console.log('Erros de validação encontrados.');
            res.status(400).send(erros);
            return;
        }

        var pagamento = req.body["pagamento"];
        console.log('Processando uma requisição de um novo pagamento...');

        pagamento.status = 'CRIADO';
        pagamento.data = new Date;

        var connection = app.persistence.connectionFactory();
        var pagamentoDao = new app.persistence.pagamentos.PagamentoDao(connection);

        pagamentoDao.salva(pagamento, function (error, result) {
            if (error) {
                console.log('Erro ao inserir no banco: ' + error);
                res.status(500).send(error);
            } else {
                pagamento.id = result.insertId
                console.log('Pagamento criado');

                var memcachedClient = app.services.memcachedClient();
                memcachedClient.set('pagamento-' + pagamento.id, pagamento, 60000, function(error) {
                  console.log('Nova chave adicionada ao cache: pagamento' + pagamento.id);
                });

                if(pagamento.forma_de_pagamento == 'cartao') {
                    var cartao = req.body["cartao"];
                    console.log(cartao);

                    var clienteCartoes = new app.services.clienteCartoes();
                    clienteCartoes.autoriza(cartao, function(exception, request, response, retorno) {
                        if(exception) {
                            console.log(exception);
                            res.status(400).send(exception);
                            return;
                        }
                        console.log(retorno);

                        res.location('/pagamentos/pagamento/' + pagamento.id);

                        var response = {
                            dados_do_pagamento: pagamento,
                            cartao: retorno,
                            links: [
                                {
                                    href: "http://localhost:3000/pagamentos/pagamento/" + pagamento.id,
                                    rel: "Confirmar pagamento",
                                    method: "PUT"
                                },
                                {
                                    href: "http://localhost:3000/pagamentos/pagamento/" + pagamento.id,
                                    rel: "Cancelar pagamento",
                                    method: "DELETE"
                                }
                            ]
                        }

                        res.status(201).json(response);
                        return;
                    });
                } else {
                    res.location('/pagamentos/pagamento/' + pagamento.id);
                    var response = {
                        dados_do_pagamento: pagamento,
                        links: [
                            {
                                href: "http://localhost:3000/pagamentos/pagamento/" + pagamento.id,
                                rel: "Confirmar o pagamento",
                                method: "PUT"
                            },
                            {
                                href: "http://localhost:3000/pagamentos/pagamento/" + pagamento.id,
                                rel: "Cancelar o pagamento",
                                method: "DELETE"
                            }
                        ]
                    }
                    res.status(201).json(response);
                }
            }
        });

    });
}
