var fs = require('fs');

fs.readFile('imagem.jpg', function(error, buffer){
  console.log('Arquivo lido');

  fs.writeFile('imagem2.jpg', buffer, function(error) {
    console.log('Arquivo criado');
  });
});
