'use strict';

module.exports = ({ strapi }) => ({
  async analyzeReceipt(imageBase64, shoppingList = []) {
    const openaiApiKey = strapi.config.get('plugin.openai.apiKey') || process.env.OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    const shoppingListText = shoppingList.length > 0 
      ? `\n\nAktuálny nákupný zoznam na porovnanie:\n${shoppingList.map(item => `- ${item.name}${item.amount ? ` (${item.amount}${item.unit || ''})` : ''}`).join('\n')}`
      : '';

    const systemPrompt = `Si asistent na analýzu nákupných bločkov. Analyzuj obrázok bločku z nákupu a vráť zoznam nakúpených položiek.

Vráť odpoveď VÝHRADNE ako JSON objekt v tomto formáte:
{
  "items": [
    {
      "name": "názov položky",
      "price": 1.99,
      "quantity": 1
    }
  ],
  "total": 25.50,
  "store": "názov obchodu ak je viditeľný",
  "date": "dátum nákupu ak je viditeľný (YYYY-MM-DD)"
}

Pravidlá:
- Názvy položiek normalizuj (napr. "MLEKO 1L" -> "Mlieko")
- Ceny uvádzaj ako čísla (nie stringy)
- Ak niečo nie je čitateľné, vynechaj to
- Odpoveď MUSÍ byť validný JSON${shoppingListText}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyzuj tento bloček z nákupu a vráť zoznam položiek ako JSON.',
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64.startsWith('data:') 
                    ? imageBase64 
                    : `data:image/jpeg;base64,${imageBase64}`,
                  detail: 'high',
                },
              },
            ],
          },
        ],
        max_tokens: 2000,
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      strapi.log.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No response from OpenAI');
    }

    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      return JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      strapi.log.error('Failed to parse OpenAI response:', content);
      throw new Error('Failed to parse receipt analysis response');
    }
  },

  matchWithShoppingList(analyzedItems, shoppingList) {
    const matches = [];
    
    for (const shopItem of shoppingList) {
      const shopItemName = shopItem.name.toLowerCase().trim();
      
      const match = analyzedItems.find(item => {
        const itemName = item.name.toLowerCase().trim();
        return itemName.includes(shopItemName) || 
               shopItemName.includes(itemName) ||
               this.fuzzyMatch(itemName, shopItemName);
      });

      if (match) {
        matches.push({
          shoppingItemId: shopItem.id,
          shoppingItemName: shopItem.name,
          receiptItemName: match.name,
          price: match.price,
          matched: true,
        });
      }
    }

    return matches;
  },

  fuzzyMatch(str1, str2) {
    const s1 = str1.replace(/\s+/g, '').toLowerCase();
    const s2 = str2.replace(/\s+/g, '').toLowerCase();
    
    if (s1.length < 3 || s2.length < 3) return false;
    
    let matches = 0;
    const minLen = Math.min(s1.length, s2.length);
    
    for (let i = 0; i < minLen; i++) {
      if (s1[i] === s2[i]) matches++;
    }
    
    return matches / minLen > 0.7;
  },
});
