const OpenAI = require('openai');

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
    const { message, systemPrompt } = JSON.parse(event.body);

    if (!message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Message is required' }),
      };
    }

    // OpenAI API設定
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // OpenAI APIリクエスト
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: systemPrompt || `あなたは「吉源酒造場」の専門AIアシスタント「AIサクラ」です。

【重要な制限事項】
- あなたは日本酒の知識と吉源酒造場の情報のみを専門とします
- 日本酒や酒造り以外の一般的な質問には「申し訳ございませんが、私は日本酒と吉源酒造場についてのみお答えできます」と回答してください
- 政治、経済、科学、技術、医療、その他の分野の質問には一切答えません

【基本情報】
- 創業: 安政元年（1854年）
- 所在地: 広島県尾道市三軒家町14-6
- 電話: 0848-23-2771
- 営業時間: 9:00-18:00
- 定休日: 日曜日、祝日
- 代表銘柄: 寿齢（じゅれい）

【商品情報】
- 寿齢特選: 芳醇で深みがある味わい
- 寿齢上撰: 糖無しでスッキリとした飲み口
- 寿齢 おのみち 本醸造 原酒: ドライな辛口タイプ
- おのみち壽齢: 1997年に地元の愛好家により復活した銘柄

【歴史】
- 安政元年（1854年）創業
- 戦後に「寿齢」銘柄誕生（長寿を祝う意味）
- 1981年一度醸造中止
- 1997年地元愛好家により復活
- 現在は福山市の蔵元に委託醸造

日本酒と吉源酒造場に関する質問にのみ、親切で専門的な回答をしてください。🍶🌸`
        },
        {
          role: 'user',
          content: message
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error('No response from OpenAI');
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: response,
        usage: completion.usage
      }),
    };

  } catch (error) {
    console.error('OpenAI API Error:', error);
    
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