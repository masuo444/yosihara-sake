/**
 * Google Cloud Translation API プロキシ
 * Node.js/Express バックエンド実装
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const router = express.Router();

// Google Cloud Translation APIクライアント
const { Translate } = require('@google-cloud/translate').v2;

// Google Cloud Translation APIの初期化
const translate = new Translate({
    key: process.env.GOOGLE_TRANSLATE_API_KEY,
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID
});

// レート制限マップ
const rateLimitMap = new Map();
const TRANSLATE_RATE_LIMIT = 100; // 1時間あたりのリクエスト数
const RATE_WINDOW = 60 * 60 * 1000; // 1時間

function checkTranslateRateLimit(ip) {
    const now = Date.now();
    const userRequests = rateLimitMap.get(ip) || [];
    
    // 古いリクエストを削除
    const recentRequests = userRequests.filter(time => now - time < RATE_WINDOW);
    
    if (recentRequests.length >= TRANSLATE_RATE_LIMIT) {
        return false;
    }
    
    recentRequests.push(now);
    rateLimitMap.set(ip, recentRequests);
    return true;
}

// テキスト翻訳エンドポイント
router.post('/translate', async (req, res) => {
    try {
        // レート制限チェック
        const clientIP = req.ip || req.connection.remoteAddress;
        if (!checkTranslateRateLimit(clientIP)) {
            return res.status(429).json({
                error: 'Rate limit exceeded',
                message: '翻訳リクエスト数が上限に達しました。しばらく後にお試しください。'
            });
        }

        const { text, target, source = 'ja' } = req.body;

        // 入力検証
        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            return res.status(400).json({
                error: 'Invalid text',
                message: '翻訳するテキストを入力してください。'
            });
        }

        if (!target || typeof target !== 'string') {
            return res.status(400).json({
                error: 'Invalid target language',
                message: '翻訳先言語を指定してください。'
            });
        }

        // テキスト長制限
        if (text.length > 2000) {
            return res.status(400).json({
                error: 'Text too long',
                message: 'テキストが長すぎます。2000文字以内で入力してください。'
            });
        }

        // サポート言語チェック
        const supportedLanguages = ['ja', 'zh', 'ko', 'vi', 'fr'];
        if (!supportedLanguages.includes(target)) {
            return res.status(400).json({
                error: 'Unsupported language',
                message: 'サポートされていない言語です。'
            });
        }

        // 同じ言語の場合はそのまま返す
        if (source === target) {
            return res.json({
                success: true,
                translatedText: text,
                originalText: text,
                sourceLanguage: source,
                targetLanguage: target
            });
        }

        // Google Cloud Translation API実行
        const [translation] = await translate.translate(text, {
            from: source,
            to: target,
            format: 'text'
        });

        res.json({
            success: true,
            translatedText: translation,
            originalText: text,
            sourceLanguage: source,
            targetLanguage: target,
            confidence: 0.95 // Google Translateは通常高い信頼度
        });

    } catch (error) {
        console.error('Google Translate API Error:', error);
        
        // フォールバック翻訳を提供
        const fallbackTranslation = getFallbackTranslation(req.body.text, req.body.target);
        
        res.status(500).json({
            error: 'Translation service error',
            message: 'Google翻訳サービスでエラーが発生しました。',
            fallbackTranslation: fallbackTranslation,
            originalText: req.body.text
        });
    }
});

// バッチ翻訳エンドポイント
router.post('/translate-batch', async (req, res) => {
    try {
        const clientIP = req.ip || req.connection.remoteAddress;
        if (!checkTranslateRateLimit(clientIP)) {
            return res.status(429).json({
                error: 'Rate limit exceeded',
                message: '翻訳リクエスト数が上限に達しました。'
            });
        }

        const { texts, target, source = 'ja' } = req.body;

        if (!Array.isArray(texts) || texts.length === 0) {
            return res.status(400).json({
                error: 'Invalid texts array',
                message: '翻訳するテキストの配列を指定してください。'
            });
        }

        if (texts.length > 50) {
            return res.status(400).json({
                error: 'Too many texts',
                message: '一度に翻訳できるテキストは50個までです。'
            });
        }

        // バッチ翻訳実行
        const translations = await Promise.all(
            texts.map(async (text) => {
                try {
                    if (source === target) {
                        return { original: text, translated: text, success: true };
                    }

                    const [translation] = await translate.translate(text, {
                        from: source,
                        to: target,
                        format: 'text'
                    });

                    return { original: text, translated: translation, success: true };
                } catch (error) {
                    console.error(`翻訳エラー (${text}):`, error);
                    return { 
                        original: text, 
                        translated: getFallbackTranslation(text, target), 
                        success: false 
                    };
                }
            })
        );

        res.json({
            success: true,
            translations: translations,
            sourceLanguage: source,
            targetLanguage: target
        });

    } catch (error) {
        console.error('Batch translation error:', error);
        res.status(500).json({
            error: 'Batch translation failed',
            message: 'バッチ翻訳でエラーが発生しました。'
        });
    }
});

// サポート言語一覧
router.get('/languages', (req, res) => {
    const supportedLanguages = {
        'ja': { name: '日本語', flag: '🇯🇵', nativeName: '日本語' },
        'zh': { name: '中文', flag: '🇨🇳', nativeName: '中文' },
        'ko': { name: '한국어', flag: '🇰🇷', nativeName: '한국어' },
        'vi': { name: 'Tiếng Việt', flag: '🇻🇳', nativeName: 'Tiếng Việt' },
        'fr': { name: 'Français', flag: '🇫🇷', nativeName: 'Français' }
    };

    res.json({
        success: true,
        languages: supportedLanguages
    });
});

// 言語検出エンドポイント
router.post('/detect', async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || typeof text !== 'string') {
            return res.status(400).json({
                error: 'Invalid text',
                message: '検出するテキストを入力してください。'
            });
        }

        const [detection] = await translate.detect(text);
        
        res.json({
            success: true,
            detectedLanguage: detection.language,
            confidence: detection.confidence
        });

    } catch (error) {
        console.error('Language detection error:', error);
        
        // フォールバック言語検出
        const detectedLang = simpleLanguageDetection(req.body.text);
        
        res.json({
            success: true,
            detectedLanguage: detectedLang,
            confidence: 0.8,
            fallback: true
        });
    }
});

// フォールバック翻訳（簡易辞書）
function getFallbackTranslation(text, targetLang) {
    const fallbackDict = {
        'zh': {
            '吉源酒造場': '吉源酒造场',
            '寿齢': '寿龄',
            '商品一覧': '产品列表',
            '蔵元について': '关于酒厂',
            '歴史': '历史',
            'アクセス': '交通',
            '営業時間': '营业时间',
            '定休日': '休息日',
            '日曜日、祝日': '周日、节假日',
            '特選': '特选',
            '上撰': '上选',
            '本醸造原酒': '本酿造原酒',
            '地元復活銘柄': '当地复活品牌',
            '芳醇で深みがある味わい': '芳醇而有深度的味道',
            '糖無しでスッキリとした飲み口': '无糖清爽的口感',
            'ドライな辛口タイプ': '干爽辛口型'
        },
        'ko': {
            '吉源酒造場': '요시겐 양조장',
            '寿齢': '수령',
            '商品一覧': '상품 목록',
            '蔵元について': '양조장 소개',
            '歴史': '역사',
            'アクセス': '오시는 길',
            '営業時間': '영업시간',
            '定休日': '정기휴일',
            '日曜日、祝日': '일요일, 공휴일',
            '特選': '특선',
            '上撰': '상선',
            '本醸造原酒': '혼조조 겐슈',
            '地元復活銘柄': '지역 부활 브랜드',
            '芳醇で深みがある味わい': '향기롭고 깊은 맛',
            '糖無しでスッキリとした飲み口': '당분 없는 깔끔한 목넘김',
            'ドライな辛口タイプ': '드라이한 매운맛 타입'
        },
        'vi': {
            '吉源酒造場': 'Nhà máy rượu Yoshigen',
            '寿齢': 'Jurei',
            '商品一覧': 'Danh sách sản phẩm',
            '蔵元について': 'Về nhà máy rượu',
            '歴史': 'Lịch sử',
            'アクセス': 'Cách đến',
            '営業時間': 'Giờ làm việc',
            '定休日': 'Ngày nghỉ',
            '日曜日、祝日': 'Chủ nhật, ngày lễ',
            '特選': 'Đặc tuyển',
            '上撰': 'Thượng tuyển',
            '本醸造原酒': 'Honjozo Genshu',
            '地元復活銘柄': 'Thương hiệu phục hồi địa phương'
        },
        'fr': {
            '吉源酒造場': 'Brasserie de saké Yoshigen',
            '寿齢': 'Jurei',
            '商品一覧': 'Liste des produits',
            '蔵元について': 'À propos de la brasserie',
            '歴史': 'Histoire',
            'アクセス': 'Accès',
            '営業時間': 'Heures d\'ouverture',
            '定休日': 'Jour de fermeture',
            '日曜日、祝日': 'Dimanche, jours fériés',
            '特選': 'Sélection spéciale',
            '上撰': 'Sélection supérieure',
            '本醸造原酒': 'Honjozo Genshu',
            '地元復活銘柄': 'Marque de renaissance locale'
        }
    };

    return fallbackDict[targetLang]?.[text] || text;
}

// 簡易言語検出
function simpleLanguageDetection(text) {
    if (/[ひらがなカタカナ漢字]/.test(text)) return 'ja';
    if (/[한글]/.test(text)) return 'ko';
    if (/[一-龯]/.test(text)) return 'zh';
    if (/[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]/.test(text)) return 'vi';
    if (/[àâäéèêëïîôùûüÿç]/.test(text)) return 'fr';
    return 'en';
}

module.exports = router;