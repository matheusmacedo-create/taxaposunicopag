function sanitizeDocument(doc) {
  if (!doc) return '';
  return String(doc).replace(/\D/g, '');
}

function isCpf(doc) {
  return /^[0-9]{11}$/.test(doc);
}

function isCnpj(doc) {
  return /^[0-9]{14}$/.test(doc);
}

module.exports = { sanitizeDocument, isCpf, isCnpj };