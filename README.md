# nodejs-rest-api
O dump do MySQL está na raiz. Para configurar, mude as credenciais do MySQL no persistence/connectionFactory.js

Para iniciar o servidor, digite:
```
node cluster.js
```
É necessário ter o memcached instalado e rodando pois a API depende do mesmo.

É possível fazer posts para criar pagamentos, e gets nos pagamentos para obter seu status.
