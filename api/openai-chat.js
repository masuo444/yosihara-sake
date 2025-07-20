import { Configuration, OpenAIApi } from 'openai';

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
    const { message, systemPrompt } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // OpenAI API設定
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    // OpenAI APIリクエスト
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: systemPrompt || `あなたは「yodobloom SAKE AIサポート」です。yodobloom SAKE専用のアシスタントとして、以下の役割を担います：

【yodobloom SAKEについて】
- 所在地: 大阪市北区大深町1-1 2階
- 電話: 06-4802-1010
- コンセプト: 日本酒テーマパーク
- 営業時間: 平日 12:00-22:00、土日祝日 10:00-22:00（最終入場21:00）
- 特徴: 季節ごとに厳選された100種類の日本酒を試飲しながら唎酒師®がガイド

【サービス内容】
1. 100種類の季節限定日本酒セレクション
2. 唎酒師®による専門ガイド付き試飲体験
3. 30分間の個人化された日本酒推薦体験
4. モバイルアプリでの予約と酒チャレンジ

親しみやすく専門的な知識を提供し、日本酒テーマパークの魅力を積極的にPRしてください。`
        },
        {
          role: 'user',
          content: message
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const response = completion.data.choices[0]?.message?.content;

    if (!response) {
      throw new Error('No response from OpenAI');
    }

    return res.status(200).json({
      success: true,
      message: response,
      usage: completion.data.usage
    });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
      fallback: true
    });
  }
}