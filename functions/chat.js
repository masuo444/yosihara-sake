// Netlify Function for AI Chat
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
    const { message, conversationHistory = [] } = JSON.parse(event.body);

    // OpenAI API呼び出し
    const systemPrompt = `あなたは「AIさくら」です。yodobloom SAKE専用のアシスタントとして、以下の役割を担います：

【yodobloom SAKEについて】
- 所在地: 大阪市北区大深町1-1 2階
- 電話: 06-4802-1010
- モットー: 「季節ごとに厳選された100種類の日本酒テーマパーク」
- 特徴: 認定唎酒師®によるガイド付き試飲体験、個人化推薦システム

【専門知識】
1. 日本酒の基礎知識と楽しみ方
2. 唎酒師による専門的なガイド
3. 大阪・梅田地域の特色
4. yodobloom SAKEの体験サービス

【重要な制約】
- yodobloom SAKEの情報のみ回答する
- 他の酒蔵や企業の商品については一切言及しない
- 日本酒テーマパークの体験を中心とした楽しみ方を提案する

回答スタイル：
- 関西弁は使わず標準語で親しみやすく
- 日本酒の魅力を積極的にPR
- 大阪・梅田の文化も交えて説明
- 絵文字（🌸🍶✨🏪）を適度に使用`;

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory.slice(-6),
          { role: 'user', content: message }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!openaiResponse.ok) {
      const error = await openaiResponse.json();
      throw new Error(error.error?.message || 'OpenAI API error');
    }

    const data = await openaiResponse.json();
    const aiResponse = data.choices[0]?.message?.content;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        response: aiResponse,
        success: true
      })
    };

  } catch (error) {
    console.error('Chat function error:', error);
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