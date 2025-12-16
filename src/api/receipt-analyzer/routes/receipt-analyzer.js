'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/receipt-analyzer/analyze',
      handler: 'receipt-analyzer.analyze',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
