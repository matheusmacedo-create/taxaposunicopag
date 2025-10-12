// Script de inicialização do MongoDB para o projeto TaxaPOS
db = db.getSiblingDB('taxapos');

// Criar usuário para a aplicação
db.createUser({
  user: 'taxapos_user',
  pwd: 'taxapos_password',
  roles: [
    {
      role: 'readWrite',
      db: 'taxapos'
    }
  ]
});

// Criar coleções iniciais
db.createCollection('proposals');
db.createCollection('documents');
db.createCollection('cnpj_data');
db.createCollection('rate_sheets');

// Criar índices para otimização
db.proposals.createIndex({ "cnpj": 1 });
db.proposals.createIndex({ "createdAt": -1 });
db.documents.createIndex({ "cnpj": 1 });
db.documents.createIndex({ "documentType": 1 });
db.cnpj_data.createIndex({ "cnpj": 1 }, { unique: true });

print('Database taxapos initialized successfully!');
