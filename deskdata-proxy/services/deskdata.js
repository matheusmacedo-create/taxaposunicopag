const axios = require('axios');

const BASE_URL = process.env.DESKDATA_BASE_URL || 'https://api.deskdata.com.br';
const USER = process.env.DESKDATA_USER;
const PASS = process.env.DESKDATA_PASS;
const DEFAULT_EXPIRES_HOURS = parseInt(process.env.DESKDATA_TOKEN_EXPIRES_HOURS || '1', 10);

if (!USER || !PASS) {
  console.warn('ATENÇÃO: DESKDATA_USER ou DESKDATA_PASS não definidos nas variáveis de ambiente.');
}

// Token cache in-memory
let tokenCache = {
  token: null,
  expiresAt: 0 // timestamp ms
};

async function getToken() {
  const now = Date.now();
  // if token still valid (with 30s buffer), return
  if (tokenCache.token && tokenCache.expiresAt - 30000 > now) {
    return tokenCache.token;
  }

  // request new token
  const expires_in = DEFAULT_EXPIRES_HOURS; // in hours
  try {
    const resp = await axios.post(`${BASE_URL}/auth`, {
      username: USER,
      password: PASS,
      expires_in
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000
    });

    const token = resp.data.access_token || resp.data.token || null;
    if (!token) throw new Error('Resposta de auth sem access_token');

    // calculate expiry: resp.data.expires_in pode vir em segundos; a doc diz em horas.
    // We'll prioritize resp.data.expires_in if present (assume seconds), else use expires_in hours.
    let expiresMs = Date.now() + (expires_in * 3600 * 1000);
    if (resp.data.expires_in && typeof resp.data.expires_in === 'number') {
      // heurística: se value > 1000 então tá em segundos, else could be in ms — assume seconds
      expiresMs = Date.now() + (resp.data.expires_in * 1000);
    }

    tokenCache = {
      token,
      expiresAt: expiresMs
    };

    return token;
  } catch (err) {
    console.error('Erro ao obter token DeskData:', err?.response?.data || err.message || err);
    throw err;
  }
}

async function consultarDocumento(tipo, documento) {
  // tipo: 'cpf' ou 'cnpj'
  if (!['cpf', 'cnpj'].includes(tipo)) throw new Error('Tipo inválido');

  const token = await getToken();

  const url = `${BASE_URL}/${tipo}/${documento}`;
  const resp = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    timeout: 12000
  });

  return resp.data;
}

module.exports = { getToken, consultarDocumento };