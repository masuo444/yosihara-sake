const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // CORS設定
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // OPTIONSリクエスト（プリフライト）への対応
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // POSTリクエストのみ許可
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // リクエストボディを解析
    const { text, targetLanguage, sourceLanguage } = JSON.parse(event.body);

    if (!text || !targetLanguage) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Text and target language are required' }),
      };
    }

    // DeepL API設定
    const apiKey = process.env.DEEPL_API_KEY;
    const apiUrl = 'https://api-free.deepl.com/v2/translate';

    if (!apiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'DeepL API key not configured' }),
      };
    }

    // FormData を作成
    const formData = new URLSearchParams();
    formData.append('text', text);
    formData.append('target_lang', targetLanguage.toUpperCase());
    
    if (sourceLanguage) {
      formData.append('source_lang', sourceLanguage.toUpperCase());
    }

    // DeepL APIリクエスト
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`DeepL API Error: ${response.status} - ${errorData.message || 'Unknown error'}`);
    }

    const data = await response.json();

    if (data.translations && data.translations.length > 0) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          translatedText: data.translations[0].text,
          detectedLanguage: data.translations[0].detected_source_language,
          originalText: text,
          targetLanguage: targetLanguage
        }),
      };
    } else {
      throw new Error('No translation received from DeepL');
    }

  } catch (error) {
    console.error('DeepL API Error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message || 'Internal server error',
        fallback: true
      }),
    };
  }
};