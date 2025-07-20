export default async function handler(req, res) {
  // CORS設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONSリクエスト（プリフライト）への対応
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // POSTリクエストのみ許可
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, targetLanguage, sourceLanguage } = req.body;

    if (!text || !targetLanguage) {
      return res.status(400).json({ error: 'Text and target language are required' });
    }

    // DeepL API設定
    const apiKey = process.env.DEEPL_API_KEY;
    const apiUrl = 'https://api-free.deepl.com/v2/translate';

    if (!apiKey) {
      return res.status(500).json({ error: 'DeepL API key not configured' });
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
      return res.status(200).json({
        success: true,
        translatedText: data.translations[0].text,
        detectedLanguage: data.translations[0].detected_source_language,
        originalText: text,
        targetLanguage: targetLanguage
      });
    } else {
      throw new Error('No translation received from DeepL');
    }

  } catch (error) {
    console.error('DeepL API Error:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
      fallback: true
    });
  }
}