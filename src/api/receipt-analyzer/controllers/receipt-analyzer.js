'use strict';

module.exports = {
  async analyze(ctx) {
    try {
      const { image, shoppingList } = ctx.request.body;

      if (!image) {
        return ctx.badRequest('Image is required');
      }

      const service = strapi.service('api::receipt-analyzer.receipt-analyzer');
      
      const analysisResult = await service.analyzeReceipt(image, shoppingList || []);
      
      let matches = [];
      if (shoppingList && shoppingList.length > 0 && analysisResult.items) {
        matches = service.matchWithShoppingList(analysisResult.items, shoppingList);
      }

      return {
        data: {
          ...analysisResult,
          matches,
          matchedCount: matches.length,
          totalItems: analysisResult.items?.length || 0,
        },
      };
    } catch (error) {
      strapi.log.error('Receipt analysis error:', error);
      return ctx.internalServerError(error.message);
    }
  },
};
