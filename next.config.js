// next.config.js
module.exports = {
  webpack: c => {
    if (c.resolve.alias) {
      delete c.resolve.alias["react"];
      delete c.resolve.alias["react-dom"];
    }
    return c;
  }
};
