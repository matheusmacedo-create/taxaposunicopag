const express = require('express');
const router = express.Router();
const deskdata = require('../services/deskdata');
const { sanitizeDocument, isCpf, isCnpj } = require('../utils/validators');

/**
 * GET /api/consulta?documento=...
 * - aceita CPF (11 dígitos) ou CNPJ (14 dígitos)
 * - retorna o JSON proveniente da DeskData
 */
router.get('/', async (req, res) => {
  try {
    const { documento } = req.query;
    if (!documento) return res.status(400).json({ error: 'Parâmetro "documento" é obrigatório' });

    const doc = sanitizeDocument(documento);
    if (!isCpf(doc) && !isCnpj(doc)) {
      return res.status(400).json({ error: 'Documento inválido. Informe CPF (11) ou CNPJ (14) somente dígitos.' });
    }

    const tipo = isCpf(doc) ? 'cpf' : 'cnpj';
    const data = await deskdata.consultarDocumento(tipo, doc);

    return res.status(200).json({ success: true, source: 'deskdata', tipo, documento: doc, data });
  } catch (err) {
    console.error('Erro /api/consulta:', err?.response?.data || err.message || err);
    const status = err?.response?.status || 500;
    const message = err?.response?.data || { error: 'Erro na integração com DeskData' };
    return res.status(status).json({ success: false, error: message });
  }
});

module.exports = router;