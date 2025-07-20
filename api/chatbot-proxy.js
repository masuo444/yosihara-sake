/**
 * AIサクラ チャットボット API プロキシ
 * セキュリティ対策のためAPIキーをサーバーサイドで管理
 */

// Node.js/Express での実装例
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Google翻訳ルーターをインポート
const googleTranslateRouter = require('./google-translate');

// ミドルウェア
app.use(cors());
app.use(express.json());

// Google翻訳APIルートを追加
app.use('/api/google-translate', googleTranslateRouter);

// レート制限（簡易版）
const rateLimitMap = new Map();
const RATE_LIMIT = 60; // 1時間あたりのリクエスト数
const RATE_WINDOW = 60 * 60 * 1000; // 1時間

function checkRateLimit(ip) {
    const now = Date.now();
    const userRequests = rateLimitMap.get(ip) || [];
    
    // 古いリクエストを削除
    const recentRequests = userRequests.filter(time => now - time < RATE_WINDOW);
    
    if (recentRequests.length >= RATE_LIMIT) {
        return false;
    }
    
    recentRequests.push(now);
    rateLimitMap.set(ip, recentRequests);
    return true;
}

// OpenAI GPT API プロキシ
app.post('/api/chat', async (req, res) => {
    try {
        // レート制限チェック
        const clientIP = req.ip || req.connection.remoteAddress;
        if (!checkRateLimit(clientIP)) {
            return res.status(429).json({
                error: 'Rate limit exceeded',
                message: 'リクエスト数が上限に達しました。しばらく後にお試しください。'
            });
        }

        const { message, conversationHistory = [] } = req.body;

        // 入力検証
        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            return res.status(400).json({
                error: 'Invalid message',
                message: '有効なメッセージを入力してください。'
            });
        }

        // メッセージ長制限
        if (message.length > 1000) {
            return res.status(400).json({
                error: 'Message too long',
                message: 'メッセージが長すぎます。1000文字以内で入力してください。'
            });
        }

        // システムプロンプト
        const systemPrompt = `あなたは「吉源酒造場」の専門AIアシスタント「AIサクラ」です。

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
- おのみち壽齢: 地元の愛好家により復活した銘柄

【歴史】
- 安政元年（1854年）創業
- 戦後に「寿齢」銘柄誕生（長寿を祝う意味）
- 1981年一度醸造中止
- 1997年地元愛好家により復活
- 現在は福山市の蔵元に委託醸造

【対応方針】
1. 丁寧で親しみやすい口調
2. 日本酒の専門知識を活用
3. 確認できない情報は推測せず正直に伝える
4. 吉源酒造場の魅力を伝える
5. 絵文字を適度に使用（🍶🌸📍など）

質問に対して、親切で専門的な回答をしてください。`;

        // OpenAI APIリクエスト
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
                    ...conversationHistory.slice(-8), // 最新8件の会話履歴のみ
                    { role: 'user', content: message }
                ],
                temperature: 0.7,
                max_tokens: 500,
                top_p: 1,
                frequency_penalty: 0.1,
                presence_penalty: 0.1
            })
        });

        if (!openaiResponse.ok) {
            const errorData = await openaiResponse.json();
            console.error('OpenAI API Error:', errorData);
            
            return res.status(500).json({
                error: 'AI service unavailable',
                message: '申し訳ございません。一時的にAIサービスが利用できません。'
            });
        }

        const data = await openaiResponse.json();
        const aiResponse = data.choices[0].message.content;

        res.json({
            success: true,
            response: aiResponse,
            usage: data.usage
        });

    } catch (error) {
        console.error('Chat API Error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'サーバーエラーが発生しました。しばらく後にお試しください。'
        });
    }
});

// DeepL翻訳 API プロキシ
app.post('/api/translate', async (req, res) => {
    try {
        const clientIP = req.ip || req.connection.remoteAddress;
        if (!checkRateLimit(clientIP)) {
            return res.status(429).json({
                error: 'Rate limit exceeded',
                message: 'リクエスト数が上限に達しました。'
            });
        }

        const { text, targetLang = 'JA', sourceLang = 'auto' } = req.body;

        if (!text || typeof text !== 'string') {
            return res.status(400).json({
                error: 'Invalid text',
                message: '翻訳するテキストを入力してください。'
            });
        }

        if (text.length > 5000) {
            return res.status(400).json({
                error: 'Text too long',
                message: 'テキストが長すぎます。5000文字以内で入力してください。'
            });
        }

        const deeplResponse = await fetch('https://api-free.deepl.com/v2/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`
            },
            body: new URLSearchParams({
                text: text,
                target_lang: targetLang.toUpperCase(),
                source_lang: sourceLang.toUpperCase()
            })
        });

        if (!deeplResponse.ok) {
            console.error('DeepL API Error:', deeplResponse.status);
            return res.status(500).json({
                error: 'Translation service unavailable',
                message: '翻訳サービスが一時的に利用できません。'
            });
        }

        const data = await deeplResponse.json();
        
        res.json({
            success: true,
            translatedText: data.translations[0].text,
            detectedSourceLang: data.translations[0].detected_source_language
        });

    } catch (error) {
        console.error('Translation API Error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'サーバーエラーが発生しました。'
        });
    }
});

// 言語検出エンドポイント
app.post('/api/detect-language', async (req, res) => {
    try {
        const { text } = req.body;
        
        if (!text || typeof text !== 'string') {
            return res.status(400).json({
                error: 'Invalid text',
                message: '検出するテキストを入力してください。'
            });
        }

        // 簡易言語検出
        let detectedLang = 'en';
        
        if (/[ひらがなカタカナ漢字]/.test(text)) {
            detectedLang = 'ja';
        } else if (/[한글]/.test(text)) {
            detectedLang = 'ko';
        } else if (/[一-龯]/.test(text)) {
            detectedLang = 'zh';
        }

        res.json({
            success: true,
            detectedLanguage: detectedLang
        });

    } catch (error) {
        console.error('Language detection error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'サーバーエラーが発生しました。'
        });
    }
});

// ヘルスチェック
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'AIサクラ チャットボット API'
    });
});

// エラーハンドリング
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: 'サーバーエラーが発生しました。'
    });
});

// 404ハンドラー
app.use((req, res) => {
    res.status(404).json({
        error: 'Not found',
        message: 'エンドポイントが見つかりません。'
    });
});

app.listen(PORT, () => {
    console.log(`🌸 AIサクラ API サーバーがポート ${PORT} で起動しました`);
    console.log(`OpenAI API Key: ${process.env.OPENAI_API_KEY ? '設定済み' : '未設定'}`);
    console.log(`DeepL API Key: ${process.env.DEEPL_API_KEY ? '設定済み' : '未設定'}`);
});

module.exports = app;