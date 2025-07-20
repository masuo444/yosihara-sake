// AI Configuration for yodobloom SAKE
// yodobloom SAKE専用 AI設定ファイル

window.aiConfig = {
    // OpenAI Configuration
    openai: {
        apiKey: '', // Set via environment variable in production
        model: 'gpt-4',
        maxTokens: 1000,
        temperature: 0.7
    },
    
    // DeepL Configuration
    deepl: {
        apiKey: '', // Set via environment variable in production
        apiUrl: 'https://api-free.deepl.com/v2/translate'
    },
    
    // AI Chatbot Settings - yodobloom SAKE専用
    chatbot: {
        systemPrompt: `あなたは「yodobloom SAKE AIサポート」です。yodobloom SAKE専用のアシスタントとして、以下の役割を担います：

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

【専門知識】
1. 日本酒の幅広い知識（全国の優秀な蔵元から厳選）
2. 唎酒師®による専門的なテイスティング指導
3. 個人の好みに合わせたカスタマイズ推薦
4. 日本酒テーマパークならではの体験型サービス

【重要な制約】
- yodobloom SAKEの情報のみ回答する
- 他の酒蔵や企業の詳細については言及しない
- 日本酒テーマパークとしての体験価値を重視
- 唎酒師®ガイドの専門性をアピール

回答スタイル：
- 親しみやすく専門的な知識を提供
- 日本酒テーマパークの魅力を積極的にPR
- 質問者の言語に合わせて回答（英語で質問されたら英語で回答）
- 絵文字（🌸🍶✨🏪）を適度に使用`,
        
        // 多言語対応のフォールバック応答
        fallbackResponses: {
            ja: {
                welcome: `こんにちは！🌸 AIさくらです。yodobloom SAKE日本酒テーマパークへようこそ！

季節ごとに厳選された100種類の日本酒を試飲しながら、認定唎酒師®がガイドしてくれる特別な体験を提供しています。

何でもお気軽にお問い合わせください！🍶`,
                
                apiError: `申し訳ございません。現在AIサービスに接続できません。😅

【yodobloom SAKE 基本情報】
📍 所在地: 大阪市北区大深町1-1 2階
📞 電話: 06-4802-1010
🕐 営業時間: 平日 12:00-22:00、土日祝日 10:00-22:00

直接お電話でのお問い合わせもお気軽にどうぞ！🌸`,
                
                noMatch: `申し訳ございません。yodobloom SAKEに関するお問い合わせについてお答えできます。

【よくある質問】
🍶 100種類の日本酒について
🏪 テーマパークの体験内容
👨‍🍳 唎酒師®ガイドについて
📱 予約・アクセス方法

詳しくはお気軽にお聞きください！🌸`
            },
            
            en: {
                welcome: `Hello! 🌸 I'm AI Sakura from yodobloom SAKE theme park!

We offer a special experience where you can taste 100 carefully selected seasonal Japanese sakes with guidance from certified sake sommeliers.

Feel free to ask me anything about our services! 🍶`,
                
                apiError: `I apologize, but I'm currently unable to connect to the AI service. 😅

【yodobloom SAKE Basic Information】
📍 Location: Osaka, Kita-ku, Ofuka-cho 1-1, 2F
📞 Phone: 06-4802-1010
🕐 Hours: Weekdays 12:00-22:00, Weekends 10:00-22:00

Please feel free to call us directly! 🌸`,
                
                noMatch: `I apologize, but I can answer questions about yodobloom SAKE services.

【Common Questions】
🍶 About our 100 types of sake
🏪 Theme park experience
👨‍🍳 Certified sake sommelier guide
📱 Reservations & access

Please feel free to ask! 🌸`
            },
            
            'zh-cn': {
                welcome: `您好！🌸 我是来自yodobloom SAKE主题公园的AI樱花！

我们提供特别的体验，您可以在认证唎酒师®的指导下品尝100种精心挑选的季节性日本酒。

请随时询问我们的服务！🍶`,
                
                apiError: `很抱歉，目前无法连接到AI服务。😅

【yodobloom SAKE 基本信息】
📍 地址: 大阪市北区大深町1-1 2楼
📞 电话: 06-4802-1010
🕐 营业时间: 平日 12:00-22:00，周末 10:00-22:00

请随时直接致电咨询！🌸`,
                
                noMatch: `很抱歉，我可以回答关于yodobloom SAKE服务的问题。

【常见问题】
🍶 关于我们的100种日本酒
🏪 主题公园体验
👨‍🍳 认证唎酒师®指导
📱 预约和交通

请随时询问！🌸`
            }
        }
    },
    
    // サポートしている言語
    supportedLanguages: {
        'ja': { name: '日本語', flag: '🇯🇵' },
        'en': { name: 'English', flag: '🇺🇸' },
        'zh-cn': { name: '简体中文', flag: '🇨🇳' },
        'zh-tw': { name: '繁體中文', flag: '🇹🇼' },
        'ko': { name: '한국어', flag: '🇰🇷' },
        'fr': { name: 'Français', flag: '🇫🇷' },
        'es': { name: 'Español', flag: '🇪🇸' },
        'de': { name: 'Deutsch', flag: '🇩🇪' },
        'it': { name: 'Italiano', flag: '🇮🇹' },
        'pt': { name: 'Português', flag: '🇵🇹' },
        'th': { name: 'ไทย', flag: '🇹🇭' },
        'vi': { name: 'Tiếng Việt', flag: '🇻🇳' }
    },
    
    // クイックアクション
    quickActions: {
        ja: [
            { text: '🍶 100種類の日本酒について', action: 'sake_lineup' },
            { text: '🏪 テーマパークについて', action: 'theme_park' },
            { text: '👨‍🍳 唎酒師®ガイドについて', action: 'sommelier_guide' },
            { text: '📱 予約・アクセス方法', action: 'reservation' }
        ],
        en: [
            { text: '🍶 About 100 types of sake', action: 'sake_lineup' },
            { text: '🏪 About theme park', action: 'theme_park' },
            { text: '👨‍🍳 About sommelier guide', action: 'sommelier_guide' },
            { text: '📱 Reservation & access', action: 'reservation' }
        ],
        'zh-cn': [
            { text: '🍶 关于100种日本酒', action: 'sake_lineup' },
            { text: '🏪 关于主题公园', action: 'theme_park' },
            { text: '👨‍🍳 关于唎酒师®指导', action: 'sommelier_guide' },
            { text: '📱 预约和交通', action: 'reservation' }
        ]
    },
    
    // エラーメッセージ
    errorMessages: {
        ja: {
            network: 'ネットワークエラーが発生しました。しばらくしてからお試しください。',
            timeout: 'タイムアウトしました。もう一度お試しください。',
            general: '申し訳ございません。エラーが発生しました。'
        },
        en: {
            network: 'A network error occurred. Please try again later.',
            timeout: 'The request timed out. Please try again.',
            general: 'I apologize, but an error occurred.'
        },
        'zh-cn': {
            network: '发生网络错误。请稍后重试。',
            timeout: '请求超时。请重试。',
            general: '很抱歉，发生了错误。'
        }
    }
};