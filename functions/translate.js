// Netlify Function for DeepL Translation
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // CORS対応
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // OPTIONSリクエストへの対応
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // POSTリクエストのみ受け付ける
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { text, targetLang } = JSON.parse(event.body);

    // 言語コードマッピング
    const langMap = {
      'en': 'EN',
      'zh-cn': 'ZH',
      'zh-tw': 'ZH',
      'ko': 'KO',
      'fr': 'FR',
      'es': 'ES',
      'de': 'DE',
      'it': 'IT',
      'pt': 'PT-PT',
      'vi': 'VI',
      'th': 'TH'
    };

    const deeplTargetLang = langMap[targetLang] || 'EN';

    // DeepL API呼び出し
    const deeplResponse = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`
      },
      body: new URLSearchParams({
        text: text,
        source_lang: 'JA',
        target_lang: deeplTargetLang
      })
    });

    if (!deeplResponse.ok) {
      const error = await deeplResponse.json();
      throw new Error(error.message || 'DeepL API error');
    }

    const data = await deeplResponse.json();
    const translatedText = data.translations?.[0]?.text;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        translatedText: translatedText,
        success: true
      })
    };

  } catch (error) {
    console.error('Translation function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error.message,
        success: false
      })
    };
  }
};