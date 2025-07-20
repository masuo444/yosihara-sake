/**
 * AIサクラ - 吉源酒造場専用チャットボット
 * GPT API と DeepL API を統合した高度なチャットボット
 */

class AISakuraChatbot {
    constructor() {
        this.isOpen = false;
        this.apiKey = null; // 環境変数またはユーザー設定から取得
        this.deepLApiKey = null; // DeepL API キー
        this.conversationHistory = [];
        this.supportedLanguages = ['ja', 'en', 'ko', 'zh'];
        this.currentLanguage = 'ja';
        this.breweryInfo = null;
        
        this.init();
    }

    async init() {
        await this.loadBreweryConfig();
        this.setupEventListeners();
        this.createChatInterface();
        console.log('🌸 AIサクラが起動しました');
    }

    async loadBreweryConfig() {
        try {
            const response = await fetch('./brewery-template-config.json');
            this.breweryInfo = await response.json();
        } catch (error) {
            console.error('設定ファイルの読み込みに失敗:', error);
        }
    }

    createChatInterface() {
        const chatContainer = document.getElementById('chatbotWindow');
        if (!chatContainer) return;

        chatContainer.innerHTML = `
            <div class="ai-sakura-header">
                <div class="ai-sakura-avatar">
                    <img src="ai-sakura-icon.png" alt="AIサクラ" class="sakura-avatar-img">
                </div>
                <div class="ai-sakura-info">
                    <h3>AIサクラ</h3>
                    <p class="ai-status" id="aiStatus">吉源酒造場のご案内をいたします</p>
                </div>
                <div class="ai-sakura-controls">
                    <button class="chatbot-close" onclick="toggleChatbot()">×</button>
                </div>
            </div>
            
            <div class="ai-sakura-messages" id="aiSakuraMessages">
                <div class="welcome-message">
                    <div class="ai-message">
                        <div class="ai-avatar">
                            <img src="ai-sakura-icon.png" alt="AIサクラ" class="sakura-mini-avatar">
                        </div>
                        <div class="ai-text">
                            <p>こんにちは！AIサクラです🌸</p>
                            <p>安政元年（1854年）創業の吉源酒造場について、何でもお聞きください。</p>
                            <div class="ai-features">
                                <span class="feature-badge">🤖 GPT搭載</span>
                                <span class="feature-badge">🌐 多言語対応</span>
                                <span class="feature-badge">🍶 酒造専門知識</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="ai-sakura-quick-actions">
                <div class="quick-actions-grid">
                    <button class="quick-action-btn" onclick="aiSakura.sendQuickMessage('寿齢について教えて')">
                        🍶 寿齢について
                    </button>
                    <button class="quick-action-btn" onclick="aiSakura.sendQuickMessage('商品ラインナップを見せて')">
                        📋 商品一覧
                    </button>
                    <button class="quick-action-btn" onclick="aiSakura.sendQuickMessage('歴史について詳しく')">
                        📚 酒造の歴史
                    </button>
                </div>
            </div>

            <div class="ai-sakura-input-area">
                <div class="input-container">
                    <input type="text" 
                           id="aiSakuraInput" 
                           placeholder="メッセージを入力..." 
                           onkeypress="aiSakura.handleKeyPress(event)"
                           autocomplete="off">
                    <button class="voice-btn" onclick="aiSakura.toggleVoiceInput()" title="音声入力">🎤</button>
                    <button class="send-btn" onclick="aiSakura.sendMessage()">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z"/>
                        </svg>
                    </button>
                </div>
                <div class="input-status" id="inputStatus"></div>
            </div>
        `;

        this.setupLanguageSelector();
    }

    setupEventListeners() {
        // チャットボット表示/非表示の制御
        window.toggleChatbot = () => {
            const chatWindow = document.getElementById('chatbotWindow');
            const button = document.querySelector('.chatbot-button');
            
            if (this.isOpen) {
                chatWindow.style.display = 'none';
                button.innerHTML = '<img src="ai-sakura-icon.png" alt="AIサクラ" class="chatbot-avatar-btn">';
                this.isOpen = false;
            } else {
                chatWindow.style.display = 'flex';
                button.innerHTML = '×';
                this.isOpen = true;
                this.focusInput();
            }
        };
    }

    setupLanguageSelector() {
        // 言語選択機能を削除（Google翻訳を使用するため）
    }

    async updateInterfaceLanguage() {
        const messages = {
            'ja': {
                placeholder: 'メッセージを入力...',
                welcome: 'こんにちは！AIサクラです🌸\n\n安政元年（1854年）創業の吉源酒造場について、何でもお聞きください。',
                status: '吉源酒造場のご案内をいたします'
            },
            'en': {
                placeholder: 'Type your message...',
                welcome: 'Hello! I\'m AI Sakura 🌸\n\nPlease ask me anything about Yoshigen Sake Brewery, founded in 1854.',
                status: 'Here to help with Yoshigen Sake Brewery'
            },
            'ko': {
                placeholder: '메시지를 입력하세요...',
                welcome: '안녕하세요! AI 사쿠라입니다 🌸\n\n1854년 창업한 요시겐 양조장에 대해 무엇이든 물어보세요.',
                status: '요시겐 양조장을 안내해 드립니다'
            },
            'zh': {
                placeholder: '请输入消息...',
                welcome: '您好！我是AI樱花 🌸\n\n请随时询问关于创立于1854年的吉源酒造场的任何问题。',
                status: '为您介绍吉源酒造场'
            }
        };

        const currentMessages = messages[this.currentLanguage] || messages['ja'];
        
        document.getElementById('aiSakuraInput').placeholder = currentMessages.placeholder;
        document.getElementById('aiStatus').textContent = currentMessages.status;
    }

    async sendMessage() {
        const input = document.getElementById('aiSakuraInput');
        const message = input.value.trim();
        
        if (!message) return;

        this.addMessage('user', message);
        input.value = '';
        this.showTypingIndicator();

        try {
            const response = await this.getAIResponse(message);
            this.hideTypingIndicator();
            this.addMessage('ai', response);
        } catch (error) {
            this.hideTypingIndicator();
            this.addMessage('ai', this.getErrorMessage());
            console.error('AI応答エラー:', error);
        }
    }

    async sendQuickMessage(message) {
        document.getElementById('aiSakuraInput').value = message;
        await this.sendMessage();
    }

    async getAIResponse(userMessage) {
        // まず言語を検出
        const detectedLanguage = await this.detectLanguage(userMessage);
        
        // 日本語以外の場合は翻訳
        let translatedMessage = userMessage;
        if (detectedLanguage !== 'ja') {
            translatedMessage = await this.translateToJapanese(userMessage);
        }

        // システムプロンプトを構築
        const systemPrompt = this.buildSystemPrompt();
        
        // GPT APIに送信
        const aiResponse = await this.callGPTAPI(systemPrompt, translatedMessage);
        
        // 必要に応じて回答を翻訳
        if (this.currentLanguage !== 'ja') {
            return await this.translateFromJapanese(aiResponse, this.currentLanguage);
        }
        
        return aiResponse;
    }

    buildSystemPrompt() {
        const breweryName = this.breweryInfo?.brewery?.name || '吉源酒造場';
        const products = this.breweryInfo?.products || [];
        
        return `あなたは「${breweryName}」の専門AIアシスタント「AIサクラ」です。

【重要な制限事項】
- あなたは日本酒の知識と吉源酒造場の情報のみを専門とします
- 日本酒や酒造り以外の一般的な質問には「申し訳ございませんが、私は日本酒と吉源酒造場についてのみお答えできます」と回答してください
- 政治、経済、科学、技術、医療、その他の分野の質問には一切答えません
- 吉源酒造場以外の他の酒造場についても詳しい情報は提供しません

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

【日本酒の基本知識】
- 日本酒の種類（純米酒、本醸造酒、吟醸酒など）
- 酒造りの工程（米洗い、蒸米、麹作り、仕込み、発酵など）
- 日本酒の味わい表現（甘口、辛口、芳醇、淡麗など）
- 適切な飲み方、保存方法

【対応方針】
1. 丁寧で親しみやすい口調
2. 日本酒と吉源酒造場の専門知識のみ活用
3. 専門外の質問は丁重にお断りする
4. 確認できない情報は推測せず正直に伝える
5. 絵文字を適度に使用（🍶🌸📍など）

日本酒と吉源酒造場に関する質問にのみ、親切で専門的な回答をしてください。`;
    }

    async callGPTAPI(systemPrompt, userMessage) {
        try {
            // Netlify Functions経由でOpenAI APIを呼び出し
            const response = await fetch('/.netlify/functions/openai-chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: userMessage,
                    systemPrompt: systemPrompt
                })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success) {
                const aiResponse = data.message;
                
                // 会話履歴を更新
                this.conversationHistory.push(
                    { role: 'user', content: userMessage },
                    { role: 'assistant', content: aiResponse }
                );
                
                // 履歴が長くなりすぎた場合は古いものを削除
                if (this.conversationHistory.length > 10) {
                    this.conversationHistory = this.conversationHistory.slice(-10);
                }

                return aiResponse;
            } else {
                throw new Error(data.error || 'API response error');
            }
        } catch (error) {
            console.error('GPT API Error:', error);
            return this.getFallbackResponse(userMessage);
        }
    }

    async detectLanguage(text) {
        // 簡易言語検出（実際はより高度な検出を実装）
        if (/[ひらがなカタカナ漢字]/.test(text)) return 'ja';
        if (/[한글]/.test(text)) return 'ko';
        if (/[一-龯]/.test(text)) return 'zh';
        return 'en';
    }

    async translateToJapanese(text) {
        return await this.translate(text, 'ja');
    }

    async translateFromJapanese(text, targetLang) {
        return await this.translate(text, targetLang);
    }

    async translate(text, targetLang) {
        try {
            // Netlify Functions経由でDeepL APIを呼び出し
            const response = await fetch('/.netlify/functions/deepl-translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: text,
                    targetLanguage: targetLang,
                    sourceLanguage: 'ja'
                })
            });

            if (!response.ok) {
                throw new Error(`Translation API error: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success) {
                return data.translatedText;
            } else {
                throw new Error(data.error || 'Translation failed');
            }
        } catch (error) {
            console.error('翻訳エラー:', error);
            return text; // 翻訳に失敗した場合は元のテキストを返す
        }
    }

    getFallbackResponse(message) {
        const responses = {
            '寿齢': '当蔵の代表銘柄「寿齢」は、特選、上撰、本醸造原酒、おのみち壽齢の4種類をご用意しております。🍶',
            '歴史': '安政元年（1854年）創業の当蔵は、戦後に「寿齢」を生み出しました。1997年に地元の愛好家により復活し、現在に至ります。📚',
            'アクセス': '広島県尾道市三軒家町14-6にございます。営業時間は9:00-18:00、日曜日・祝日が定休日です。📍',
            '営業': '営業時間は9:00-18:00です。定休日は日曜日、祝日となっております。🕐'
        };

        for (const [key, response] of Object.entries(responses)) {
            if (message.includes(key)) {
                return response;
            }
        }

        return '申し訳ございません。詳しくはお電話（0848-23-2771）でお問い合わせください。🙏';
    }

    getErrorMessage() {
        const messages = {
            'ja': '申し訳ございません。一時的にAIサービスが利用できません。しばらく後にお試しください。🙏',
            'en': 'Sorry, AI service is temporarily unavailable. Please try again later. 🙏',
            'ko': '죄송합니다. AI 서비스를 일시적으로 사용할 수 없습니다. 나중에 다시 시도해 주세요. 🙏',
            'zh': '抱歉，AI服务暂时不可用。请稍后再试。🙏'
        };
        return messages[this.currentLanguage] || messages['ja'];
    }

    addMessage(sender, text) {
        const messagesContainer = document.getElementById('aiSakuraMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message`;
        
        if (sender === 'user') {
            messageDiv.innerHTML = `
                <div class="user-message-content">
                    <div class="user-text">${this.escapeHtml(text)}</div>
                    <div class="user-avatar">👤</div>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="ai-message">
                    <div class="ai-avatar">
                        <img src="ai-sakura-icon.png" alt="AIサクラ" class="sakura-mini-avatar">
                    </div>
                    <div class="ai-text">${this.formatAIResponse(text)}</div>
                </div>
            `;
        }
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // メッセージにアニメーション効果を追加
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(20px)';
        setTimeout(() => {
            messageDiv.style.transition = 'all 0.3s ease';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        }, 10);
    }

    formatAIResponse(text) {
        // 改行を<br>に変換
        let formatted = text.replace(/\n/g, '<br>');
        
        // URLを自動リンク化
        formatted = formatted.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
        
        return this.escapeHtml(formatted);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('aiSakuraMessages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="ai-message">
                <div class="ai-avatar">
                    <img src="ai-sakura-icon.png" alt="AIサクラ" class="sakura-mini-avatar">
                </div>
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.remove();
        }
    }

    handleKeyPress(event) {
        if (event.key === 'Enter') {
            this.sendMessage();
        }
    }

    focusInput() {
        setTimeout(() => {
            const input = document.getElementById('aiSakuraInput');
            if (input) input.focus();
        }, 100);
    }

    toggleVoiceInput() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            this.startVoiceRecognition();
        } else {
            alert('音声認識がサポートされていません。');
        }
    }

    startVoiceRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.lang = this.currentLanguage === 'ja' ? 'ja-JP' : 
                         this.currentLanguage === 'en' ? 'en-US' :
                         this.currentLanguage === 'ko' ? 'ko-KR' : 'zh-CN';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            document.getElementById('inputStatus').textContent = '🎤 音声入力中...';
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            document.getElementById('aiSakuraInput').value = transcript;
            document.getElementById('inputStatus').textContent = '';
        };

        recognition.onerror = () => {
            document.getElementById('inputStatus').textContent = '音声認識エラー';
        };

        recognition.onend = () => {
            document.getElementById('inputStatus').textContent = '';
        };

        recognition.start();
    }

    // APIキー設定メソッド（管理者用）
    setAPIKeys(openaiKey, deepLKey) {
        this.apiKey = openaiKey;
        this.deepLApiKey = deepLKey;
        localStorage.setItem('aiSakura_openai_key', openaiKey);
        localStorage.setItem('aiSakura_deepl_key', deepLKey);
    }

    // 保存されたAPIキーを読み込み
    loadAPIKeys() {
        this.apiKey = localStorage.getItem('aiSakura_openai_key');
        this.deepLApiKey = localStorage.getItem('aiSakura_deepl_key');
    }
}

// グローバルインスタンスを作成
window.aiSakura = new AISakuraChatbot();

// ページ読み込み完了後に初期化
document.addEventListener('DOMContentLoaded', () => {
    window.aiSakura.loadAPIKeys();
});