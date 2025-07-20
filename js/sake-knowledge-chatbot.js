// 日本酒専門知識チャットボット - yodobloom SAKE

class SakeKnowledgeChatbot {
    constructor() {
        this.sakeData = {
            'narutotai-led': {
                name: '鳴門鯛 LED（レッド）',
                type: '純米吟醸',
                description: 'LED照射による独自酵母で生まれたモダンな味わい。Kura Masterプラチナ賞受賞。',
                brewery: '本家松浦酒造・徳島',
                polishingRatio: '58%',
                alcoholContent: '15%',
                sakeMeter: '−20',
                acidity: '2.8',
                hasAward: true,
                aroma: 'りんごやトロピカルフルーツの甘香',
                taste: 'ヨーグルト系の酸、リッチな酸味と重層的な旨味',
                temperature: 'よく冷やして（8〜12℃）',
                pairing: '前菜、チーズ、刺身',
                awards: 'Kura Masterプラチナ賞、IWC銀賞ほか国内外で受賞歴多数。ANA機内食採用。',
                specialFeature: '徳島県産「あわいちば山田錦」100%、LED夢酵母（3826 Type2）使用の全徳島仕込み'
            },
            'yusei': {
                name: '純米大吟醸 悠星（ゆうせい）',
                type: '純米大吟醸',
                description: '星が瞬く瀬戸内の夜と厳島神社をイメージした上品な一本。ジューシーなメロン香が特徴。',
                brewery: '白牡丹酒造・広島',
                polishingRatio: '50%',
                alcoholContent: '15%',
                sakeMeter: '＋0.5',
                acidity: '1.6',
                hasAward: false,
                aroma: 'ジューシーなメロン香',
                taste: '八反35号らしいさっぱりとした後口のキレ',
                temperature: 'よく冷やすか常温で',
                pairing: '魚介、豆腐料理、淡麗な和食',
                specialFeature: '広島産八反35号、広島令和一号酵母使用。星が瞬く瀬戸内の夜と厳島神社の大鳥居をイメージしたラベル'
            },
            'reiwa-ichigo': {
                name: '純米大吟醸 令和一号酵母',
                type: '純米大吟醸',
                description: '広島県開発の令和一号酵母で醸造。果実様の香りが特徴の優雅な仕上がり。',
                brewery: '白牡丹酒造・広島',
                polishingRatio: '50%',
                alcoholContent: '15%',
                aroma: '柔らかなメロンやライチを思わせる果実香',
                taste: '上品な甘みと滑らかな口当たり',
                temperature: '10～12℃程度によく冷やして',
                pairing: '白身魚や貝類の刺身、酒盗、浅漬け',
                specialFeature: '酒造好適米「山田錦」を精米歩合50％まで磨き、広島県が開発した「令和一号酵母」で醸造'
            },
            'hyakumoku': {
                name: '百黙 純米大吟醸',
                type: '純米大吟醸',
                description: '特A地区山田錦使用。洋梨→プラム→黄桃と続く果実香が魅力。菊正宗の技術が光る逸品。',
                brewery: '菊正宗・兵庫',
                polishingRatio: '59%',
                alcoholContent: '15%',
                aroma: '洋梨→プラム→黄桃と柔らかく続く果実香',
                taste: '旨味と酸のバランスが良く、穏やかでキレのある後口',
                temperature: '8～10℃でフルーティーに、15℃前後で味の厚みが増す',
                pairing: '魚介のカルパッチョ、白身の塩焼き、クリーム系パスタ',
                specialFeature: '兵庫県三木市吉川町の特A地区山田錦を59％まで磨いた純米大吟醸。契約栽培米と「宮水」使用'
            },
            'hyakumoku-alt3': {
                name: '百黙 Alt.3（オルトスリー）',
                type: '純米ブレンド',
                description: '「第三の選択」を意味する特別ブレンド。グランクリュ級山田錦の複層的な味わい。',
                brewery: '菊正宗・兵庫',
                alcoholContent: '15%',
                aroma: '華やかでありながら、甘さ・苦味・フレッシュさ・丸みが融合',
                taste: '複層的な味、ブレンドによる味の厚みと複雑性',
                temperature: '冷やしめ（8～12℃）で香りと果実感、常温～15℃で全体のバランス',
                pairing: '生ハム、ナッツ、熟成チーズ',
                specialFeature: '特A地区山田錦による複数の純米原酒を、熟練ブレンダーがブレンドして仕上げた逸品'
            },
            'souka': {
                name: '超特撰 惣花（そうか）純米大吟醸',
                type: '純米大吟醸',
                description: '特A地区の上質な山田錦使用。木箱入りで贈答にも最適な最高ランク商品。',
                brewery: '永澤酒造・兵庫',
                polishingRatio: '50%以下',
                alcoholContent: '15%',
                aroma: '白桃やマスカットの上品な香り',
                taste: 'キレの良い酸味がありつつ丸く甘い余韻',
                temperature: '8〜12℃に冷やして',
                pairing: 'てんぷら、お造り、白身魚',
                specialFeature: '特A地区の上質な山田錦を50%以下に磨いて仕込み。木箱入りで贈答にも最適とされる最高ランク商品'
            },
            'nama': {
                name: '純米大吟醸 生酒',
                type: '純米大吟醸生酒',
                description: '青リンゴ・洋梨の香り、爽やかな甘さが特徴。フレッシュで瑞々しい生酒の魅力。',
                aroma: '青リンゴや洋梨を彷彿とさせるフレッシュで瑞々しい香り',
                taste: '控えめな甘味と酸のバランス',
                temperature: 'やや低温で、生酒ならではの爽快さを引き立てて',
                pairing: '春夏の魚介、フルーツ系デザート、和洋折衷の軽食',
                specialFeature: '火入れを行わない生酒ならではのフレッシュで瑞々しい香り。要冷蔵での管理が必要'
            },
            'ryugagotoku': {
                name: '龍が如く 純米大吟醸 無濾過原酒',
                type: '純米大吟醸無濾過原酒',
                description: '全国新酒鑑評会で最多49回金賞の土佐鶴。しぼりたての味をそのまま封じ込めた力強い一本。',
                brewery: '土佐鶴酒造・高知',
                polishingRatio: '50%以下',
                alcoholContent: '17%',
                hasAward: true,
                aroma: '麹の厚みとお米の甘味が豊か',
                taste: '無濾過ならではのふくらみある旨味に、酸味と若干の苦味が混ざり厚みある味わい',
                temperature: '12〜15℃でじっくりと',
                pairing: '脂のある刺身や焼き魚（サバ、ブリ）、味噌仕立ての煮物',
                awards: '全国新酒鑑評会で最多49回金賞',
                specialFeature: '酒造好適米を50%以下に精米、無濾過原酒のため加水なし、しぼりたての味をそのまま封じ込め'
            },
            'azure': {
                name: '吟醸酒 アジュール',
                type: '吟醸酒',
                description: '青いボトルが美しい軽やかなドライ感。azure（群青色）を思わせる爽快な味わい。',
                brewery: '土佐鶴酒造・高知',
                alcoholContent: '13%台',
                aroma: 'azure（群青色）を思わせる爽快な青リンゴ、白ブドウの香り',
                taste: 'スッキリとした余韻、シャープなキレ',
                temperature: 'しっかり冷やして',
                pairing: '魚のマリネ、寿司、軽い前菜やサラダ',
                specialFeature: '吟醸規格、アルコール度13%台で軽やかなドライ感、青いボトルが特徴的'
            }
        };

        this.storeInfo = {
            name: 'yodobloom SAKE',
            type: '日本酒テーマパーク',
            location: '大阪市北区大深町1-1 2階',
            phone: '06-4802-1010',
            hours: '平日 12:00-22:00 | 土日祝日 10:00-22:00',
            access: 'JR大阪駅から徒歩5分',
            features: ['季節ごとに厳選された100種類の日本酒', '認定唎酒師®ガイド付き試飲', '個人化された日本酒推薦', 'アプリベースの酒チャレンジ'],
            specialties: '唎酒師®が一人一人の好みに合わせて、個人化された日本酒推薦体験を提供'
        };

        this.sakeKnowledge = {
            types: {
                '純米大吟醸': '精米歩合50%以下、米・米麹・水のみで造られた最高級の日本酒',
                '純米吟醸': '精米歩合60%以下、米・米麹・水のみで造られた高級酒',
                '吟醸酒': '精米歩合60%以下、香りが高い日本酒',
                '生酒': '火入れ（加熱処理）を行わないフレッシュな日本酒',
                '無濾過原酒': '濾過と加水を行わない、力強い味わいの日本酒'
            },
            terms: {
                '精米歩合': '玄米を削って残った部分の割合。数字が小さいほど高級',
                '日本酒度': '甘辛の指標。マイナスが甘口、プラスが辛口',
                '酸度': '酸味の指標。数値が高いほど酸味が強い',
                '唎酒師': '日本酒のソムリエ。正しい知識と技能を持つ専門家',
                '山田錦': '酒米の王様と呼ばれる最高級の酒造好適米',
                '宮水': '兵庫県西宮市の名水。灘の酒造りに欠かせない硬水'
            },
            breweries: {
                '本家松浦酒造': '徳島県の蔵元。LED技術を活用した革新的な酒造りで世界的評価',
                '白牡丹酒造': '広島県の老舗蔵元。瀬戸内の自然環境を活かした酒造り',
                '菊正宗': '江戸時代から続く老舗蔵元。伝統と革新を融合',
                '永澤酒造': '兵庫県の蔵元。特A地区山田錦にこだわった高品質な酒造り',
                '土佐鶴酒造': '高知県の名門蔵元。全国新酒鑑評会で最多49回の金賞受賞'
            }
        };
    }

    generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // 商品名での検索
        for (const [id, sake] of Object.entries(this.sakeData)) {
            if (message.includes(sake.name) || message.includes(sake.name.replace(/\s+/g, ''))) {
                return this.getSakeDetailResponse(sake);
            }
        }

        // 日本酒の種類での検索
        for (const [type, description] of Object.entries(this.sakeKnowledge.types)) {
            if (message.includes(type)) {
                const examples = Object.values(this.sakeData).filter(sake => sake.type.includes(type));
                return `🍶 ${type}について説明します：\n\n${description}\n\n当店では${examples.length}種類の${type}をご用意しています：\n${examples.map(sake => `・${sake.name}（${sake.brewery}）`).join('\n')}`;
            }
        }

        // 蔵元での検索
        for (const [brewery, info] of Object.entries(this.sakeKnowledge.breweries)) {
            if (message.includes(brewery.replace('・', '')) || message.includes(brewery)) {
                const examples = Object.values(this.sakeData).filter(sake => sake.brewery && sake.brewery.includes(brewery.split('・')[0]));
                return `🏭 ${brewery}について：\n\n${info}\n\n当店の取り扱い商品：\n${examples.map(sake => `・${sake.name}`).join('\n')}`;
            }
        }

        // 専門用語の説明
        for (const [term, explanation] of Object.entries(this.sakeKnowledge.terms)) {
            if (message.includes(term)) {
                return `📚 ${term}について：\n\n${explanation}\n\n当店では唎酒師®が詳しく説明いたします。ぜひご来店ください！`;
            }
        }

        // 温度や飲み方に関する質問
        if (message.includes('温度') || message.includes('飲み方') || message.includes('冷や')) {
            return this.getTemperatureAdvice();
        }

        // ペアリング・料理の相性
        if (message.includes('料理') || message.includes('ペアリング') || message.includes('合う') || message.includes('相性')) {
            return this.getPairingAdvice();
        }

        // おすすめ
        if (message.includes('おすすめ') || message.includes('オススメ') || message.includes('推薦')) {
            return this.getRecommendations();
        }

        // 受賞歴
        if (message.includes('受賞') || message.includes('賞') || message.includes('金賞')) {
            return this.getAwardInfo();
        }

        // 店舗情報
        if (message.includes('店舗') || message.includes('場所') || message.includes('営業') || message.includes('時間')) {
            return this.getStoreInfo();
        }

        // 予約・連絡
        if (message.includes('予約') || message.includes('電話') || message.includes('連絡')) {
            return `📞 ご予約・お問い合わせ：\n\n電話：${this.storeInfo.phone}\n営業時間：${this.storeInfo.hours}\n\n当日のご来店も可能ですが、事前予約をおすすめします🌸`;
        }

        // 唎酒師について
        if (message.includes('唎酒師') || message.includes('ガイド') || message.includes('ソムリエ')) {
            return `🌸 唎酒師®について：\n\n${this.storeInfo.specialties}\n\n唎酒師®は日本酒の正しい知識と技能を持つ専門家です。お客様の好みを丁寧にお聞きして、最適な一本をご提案いたします。`;
        }

        // デフォルト応答
        return this.getDefaultResponse();
    }

    getSakeDetailResponse(sake) {
        return `🍶 ${sake.name}について詳しくご説明します：

【基本情報】
・種類：${sake.type}
・蔵元：${sake.brewery}
・アルコール度数：${sake.alcoholContent}
${sake.polishingRatio ? `・精米歩合：${sake.polishingRatio}` : ''}

【味わいの特徴】
・香り：${sake.aroma}
・味わい：${sake.taste}
・おすすめ温度：${sake.temperature}

【相性の良い料理】
${sake.pairing}

${sake.awards ? `【受賞歴】\n${sake.awards}` : ''}

【特徴】
${sake.specialFeature}

ぜひ当店で実際にお試しください🌸`;
    }

    getTemperatureAdvice() {
        return `🌡️ 日本酒の温度による味わいの変化：

【冷酒（8-12℃）】
・フルーティーな香りが際立つ
・すっきりとしたキレ
・おすすめ：純米大吟醸、吟醸酒

【常温（15-20℃）】
・米の旨味がしっかり感じられる
・バランスの良い味わい
・おすすめ：純米酒、本醸造

【燗酒（40-50℃）】
・深い旨味と豊かな香り
・体が温まる
・おすすめ：純米酒、生酛系

当店では唎酒師®が最適な温度でご提供いたします！`;
    }

    getPairingAdvice() {
        return `🍽️ 日本酒と料理の相性：

【淡麗な日本酒】
・刺身、寿司、白身魚
・あっさりとした和食
・例：悠星、アジュール

【濃醇な日本酒】
・焼き魚、天ぷら、肉料理
・しっかりした味付けの料理
・例：龍が如く、百黙 Alt.3

【フルーティーな日本酒】
・チーズ、フルーツ
・洋食やデザート
・例：鳴門鯛LED、令和一号酵母

唎酒師®がお料理に合わせて最適な一本をご提案します🌸`;
    }

    getRecommendations() {
        const recommendations = [
            '🏆 受賞歴のある逸品：鳴門鯛 LED（Kura Masterプラチナ賞）',
            '🌸 初心者におすすめ：悠星（上品で飲みやすい）',
            '🍃 夏におすすめ：アジュール（爽やかな味わい）',
            '🎁 贈答用におすすめ：惣花（木箱入り最高級品）',
            '💪 日本酒好きにおすすめ：龍が如く（無濾過原酒の力強さ）'
        ];

        return `✨ yodobloom SAKEのおすすめ：\n\n${recommendations.join('\n\n')}\n\n唎酒師®がお客様の好みに合わせて、さらに詳しくご提案いたします！`;
    }

    getAwardInfo() {
        const awardSakes = Object.values(this.sakeData).filter(sake => sake.hasAward);
        
        return `🏆 受賞歴のある銘柄：\n\n${awardSakes.map(sake => 
            `・${sake.name}\n  ${sake.awards || '国内外で高い評価'}`
        ).join('\n\n')}\n\n品質の高さが世界的に認められた逸品です🌸`;
    }

    getStoreInfo() {
        return `🏪 ${this.storeInfo.name}について：\n\n📍 所在地：${this.storeInfo.location}\n⏰ 営業時間：${this.storeInfo.hours}\n🚶 アクセス：${this.storeInfo.access}\n📞 お電話：${this.storeInfo.phone}\n\n【特徴】\n${this.storeInfo.features.map(feature => `・${feature}`).join('\n')}\n\n${this.storeInfo.specialties}`;
    }

    getDefaultResponse() {
        return `🌸 yodobloom SAKE AIサポートです！\n\n以下についてお答えできます：\n・日本酒の銘柄詳細（${Object.keys(this.sakeData).length}種類）\n・日本酒の種類や専門用語\n・蔵元の情報\n・おすすめの飲み方\n・料理との相性\n・店舗情報\n\nお気軽にお聞きください🍶`;
    }
}

// 既存のEnhancedChatbotクラスを拡張
if (typeof EnhancedChatbot !== 'undefined') {
    const originalGenerateResponse = EnhancedChatbot.prototype.generateResponse;
    
    EnhancedChatbot.prototype.generateResponse = function(message) {
        // SakeKnowledgeChatbotのインスタンスを作成
        if (!this.sakeKnowledge) {
            this.sakeKnowledge = new SakeKnowledgeChatbot();
        }
        
        // 日本酒専門知識で応答を試行
        const sakeResponse = this.sakeKnowledge.generateResponse(message);
        
        // デフォルト応答でない場合は、専門知識の応答を返す
        if (!sakeResponse.includes('お気軽にお聞きください')) {
            return sakeResponse;
        }
        
        // 従来の応答にフォールバック
        return originalGenerateResponse.call(this, message);
    };
}

console.log('✅ Sake Knowledge Chatbot loaded with comprehensive sake database');