const LOCALES = require('../constants/locales');

module.exports = (req, res, next) => {
  const lang = req.headers['accept-language'] || 'en';
  req.locale = LOCALES[lang.toUpperCase()] || LOCALES.EN;
  next();
};
