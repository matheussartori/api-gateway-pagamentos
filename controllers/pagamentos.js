module.exports = function (app) {
    app.get('/pagamentos', function (req, res) {
        console.log('Recebida requisição de teste na porta 3000.');
        res.send('OK');
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

        req.assert('forma_de_pagamento',
            'Forma de pagamento é obrigatório!').notEmpty();
        req.assert('valor',
            'Valor é obrigatório e deve ser decimal!').notEmpty().isFloat();

        var erros = req.validationErrors();
        if (erros) {
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

        pagamentoDao.salva(pagamento, function (error, result) {
            if (error) {
                console.log('Erro ao inserir no banco: ' + error);
                res.status(500).send(error);
            } else {
                console.log('Pagamento criado');
                res.location('/pagamentos/pagamento/' + result.insertId);
                res.status(201).json(pagamento);
            }
        });

    });
}
