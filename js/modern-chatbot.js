// Modern AI Chatbot for yodobloom SAKE
// yodobloom SAKE専用モダンAIチャットボット

// デバッグ用ログ関数（最初に定義）
function debugLog(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = `[${timestamp}] [Chatbot]`;
    
    switch(type) {
        case 'error':
            console.error(`${prefix} ❌`, message);
            break;
        case 'warn':
            console.warn(`${prefix} ⚠️`, message);
            break;
        case 'success':
            console.log(`${prefix} ✅`, message);
            break;
        default:
            console.log(`${prefix} ℹ️`, message);
    }
}

class ModernChatbot {
    constructor() {
        debugLog('Initializing ModernChatbot class...', 'info');
        
        this.config = window.aiConfig;
        this.companyManager = window.companyManager;
        this.isOpen = false;
        this.isMinimized = false;
        this.isTyping = false;
        this.conversationHistory = [];
        this.currentLanguage = 'ja';
        
        try {
            this.initializeElements();
            this.bindEvents();
            this.setupQuickActions();
            
            debugLog('ModernChatbot initialized successfully', 'success');
        } catch (error) {
            debugLog(`ModernChatbot initialization failed: ${error.message}`, 'error');
            throw error;
        }
    }
    
    initializeElements() {
        debugLog('Initializing DOM elements...', 'info');
        
        this.chatButton = document.getElementById('chatButton');
        this.chatInterface = document.getElementById('chatInterface');
        this.closeBtn = document.getElementById('closeChat');
        this.minimizeBtn = document.getElementById('minimizeChat');
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.quickBtns = document.querySelectorAll('.quick-btn');
        
        // 必須要素の存在確認
        if (!this.chatButton) {
            throw new Error('Chat button element (#chatButton) not found');
        }
        if (!this.chatInterface) {
            throw new Error('Chat interface element (#chatInterface) not found');
        }
        if (!this.chatMessages) {
            throw new Error('Chat messages element (#chatMessages) not found');
        }
        if (!this.messageInput) {
            throw new Error('Message input element (#messageInput) not found');
        }
        if (!this.sendButton) {
            throw new Error('Send button element (#sendButton) not found');
        }
        
        debugLog('All DOM elements found successfully', 'success');
    }
    
    bindEvents() {
        debugLog('Binding event listeners...', 'info');
        
        // チャットボタン
        if (this.chatButton) {
            this.chatButton.addEventListener('click', (e) => {
                e.preventDefault();
                debugLog('Chat button clicked', 'info');
                this.toggleChat();
            });
            debugLog('Chat button event bound', 'success');
        }
        
        // 閉じるボタン
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                debugLog('Close button clicked', 'info');
                this.closeChat();
            });
            debugLog('Close button event bound', 'success');
        }
        
        // 最小化ボタン
        if (this.minimizeBtn) {
            this.minimizeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                debugLog('Minimize button clicked', 'info');
                this.minimizeChat();
            });
            debugLog('Minimize button event bound', 'success');
        }
        
        // 送信ボタン
        if (this.sendButton) {
            this.sendButton.addEventListener('click', (e) => {
                e.preventDefault();
                debugLog('Send button clicked', 'info');
                this.sendMessage();
            });
            debugLog('Send button event bound', 'success');
        }
        
        // Enterキー
        if (this.messageInput) {
            this.messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    debugLog('Enter key pressed', 'info');
                    this.sendMessage();
                }
            });
            debugLog('Enter key event bound', 'success');
        }
        
        // クイックアクション
        if (this.quickBtns && this.quickBtns.length > 0) {
            this.quickBtns.forEach((btn, index) => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const message = btn.getAttribute('data-message');
                    debugLog(`Quick button ${index + 1} clicked: "${message}"`, 'info');
                    this.sendQuickMessage(message);
                });
            });
            debugLog(`Quick action buttons bound (${this.quickBtns.length} buttons)`, 'success');
        }
        
        debugLog('All event listeners bound successfully', 'success');
    }
    
    setupQuickActions() {
        // クイックアクションボタンのアニメーション
        this.quickBtns?.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translateY(-2px) scale(1.05)';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
    
    toggleChat() {
        debugLog(`Toggle chat called - current state: ${this.isOpen ? 'open' : 'closed'}`, 'info');
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }
    
    openChat() {
        debugLog('Opening chat interface...', 'info');
        this.isOpen = true;
        this.isMinimized = false;
        
        if (this.chatInterface) {
            this.chatInterface.classList.add('open');
            this.chatInterface.classList.remove('minimized');
            this.chatInterface.style.display = 'block';
            debugLog('Chat interface opened', 'success');
        }
        
        if (this.chatButton) {
            this.chatButton.classList.add('active');
        }
        
        // フォーカス
        setTimeout(() => {
            if (this.messageInput) {
                this.messageInput.focus();
                debugLog('Message input focused', 'info');
            }
        }, 300);
        
        // 通知ドットを非表示
        const notificationDot = this.chatButton?.querySelector('.notification-dot');
        if (notificationDot) {
            notificationDot.style.display = 'none';
        }
    }
    
    closeChat() {
        debugLog('Closing chat interface...', 'info');
        this.isOpen = false;
        this.isMinimized = false;
        
        if (this.chatInterface) {
            this.chatInterface.classList.remove('open', 'minimized');
            // ちょっと待ってから非表示にする（アニメーション用）
            setTimeout(() => {
                if (!this.isOpen && !this.isMinimized) {
                    this.chatInterface.style.display = 'none';
                }
            }, 300);
            debugLog('Chat interface closed', 'success');
        }
        
        if (this.chatButton) {
            this.chatButton.classList.remove('active');
        }
    }
    
    minimizeChat() {
        debugLog('Minimizing chat interface...', 'info');
        this.isMinimized = true;
        
        if (this.chatInterface) {
            this.chatInterface.classList.add('minimized');
            this.chatInterface.classList.remove('open');
            debugLog('Chat interface minimized', 'success');
        }
    }
    
    async sendMessage() {
        const message = this.messageInput?.value?.trim();
        debugLog(`Send message called with: "${message}"`, 'info');
        
        if (!message) {
            debugLog('Empty message, ignoring', 'warn');
            return;
        }
        
        if (this.isTyping) {
            debugLog('Bot is typing, ignoring new message', 'warn');
            return;
        }
        
        // ユーザーメッセージを表示
        this.addMessage(message, 'user');
        this.messageInput.value = '';
        
        // AI応答を取得
        await this.getAIResponse(message);
    }
    
    sendQuickMessage(message) {
        debugLog(`Quick message selected: "${message}"`, 'info');
        if (this.messageInput) {
            this.messageInput.value = message;
            this.sendMessage();
        }
    }
    
    async getAIResponse(userMessage) {
        this.showTypingIndicator();
        debugLog(`Processing user message: "${userMessage}"`, 'info');
        
        try {
            let response;
            let usingGPT = false;
            
            // GPT-4 APIを使用（APIキーがある場合）
            if (this.config?.openai?.apiKey && this.config.openai.apiKey.length > 10) {
                try {
                    debugLog('Attempting to use GPT-4 API', 'info');
                    response = await this.getGPTResponse(userMessage);
                    usingGPT = true;
                    debugLog('GPT-4 API response received', 'success');
                } catch (gptError) {
                    debugLog(`GPT API failed: ${gptError.message}`, 'warn');
                    // GPTエラーの場合は内蔵応答にフォールバック
                    response = null;
                }
            } else {
                debugLog('OpenAI API key not available, using local responses', 'info');
            }
            
            // GPTが利用できない場合は内蔵応答
            if (!response) {
                debugLog('Using local response system', 'info');
                response = this.generateLocalResponse(userMessage);
            }
            
            // DeepL翻訳（日本語以外の場合）
            if (this.currentLanguage !== 'ja' && this.config?.deepl?.apiKey && this.config.deepl.apiKey.length > 10) {
                try {
                    debugLog(`Translating response to: ${this.currentLanguage}`, 'info');
                    response = await this.translateResponse(response, this.currentLanguage);
                    debugLog('Translation completed', 'success');
                } catch (translateError) {
                    debugLog(`Translation failed: ${translateError.message}`, 'warn');
                    // 翻訳エラーの場合は元の応答をそのまま使用
                }
            }
            
            this.hideTypingIndicator();
            this.addMessage(response, 'ai');
            
            // デバッグ情報を表示
            debugLog(`Response delivered (using ${usingGPT ? 'GPT-4' : 'local'} system)`, 'success');
            
        } catch (error) {
            debugLog(`AI response error: ${error.message}`, 'error');
            console.error('AI response error:', error);
            this.hideTypingIndicator();
            
            // エラーの種類に応じたメッセージ
            let errorMessage = '申し訳ございません。一時的な問題が発生しました。🌸';
            
            if (error.message.includes('ネットワーク')) {
                errorMessage = 'ネットワーク接続に問題があります。インターネット接続をご確認ください。🌸';
            } else if (error.message.includes('APIキー')) {
                errorMessage = 'API設定に問題があります。しばらくお待ちください。🌸';
            } else if (error.message.includes('タイムアウト')) {
                errorMessage = 'リクエストがタイムアウトしました。もう一度お試しください。🌸';
            }
            
            this.addMessage(errorMessage, 'ai');
        }
    }
    
    async getGPTResponse(message) {
        debugLog(`Requesting GPT response for: "${message.substring(0, 50)}..."`, 'info');
        
        try {
            debugLog('Sending request to chat function...', 'info');
            
            // Netlify FunctionのURLを決定
            const functionUrl = window.location.hostname === 'localhost' 
                ? 'http://localhost:8888/.netlify/functions/chat'
                : '/.netlify/functions/chat';
            
            const response = await fetch(functionUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    conversationHistory: this.conversationHistory.slice(-6)
                }),
                signal: AbortSignal.timeout(30000) // 30秒タイムアウト
            });
            
            debugLog(`API Response status: ${response.status}`, response.ok ? 'success' : 'error');
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.error?.message || `HTTP ${response.status}`;
                
                if (response.status === 401) {
                    debugLog('API Key authentication failed', 'error');
                    throw new Error('APIキーが無効です。設定を確認してください。');
                } else if (response.status === 429) {
                    debugLog('Rate limit exceeded', 'warn');
                    throw new Error('リクエスト制限に達しました。しばらくお待ちください。');
                } else if (response.status === 403) {
                    debugLog('API access forbidden', 'error');
                    throw new Error('APIアクセスが拒否されました。権限を確認してください。');
                } else if (response.status >= 500) {
                    debugLog('Server error', 'error');
                    throw new Error('OpenAIサーバーエラーが発生しました。しばらくお待ちください。');
                } else {
                    throw new Error(`API Error: ${errorMessage}`);
                }
            }
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'API request failed');
            }
            
            const content = data.response;
            
            if (!content) {
                debugLog('Empty response from API', 'warn');
                throw new Error('APIからの応答が空でした');
            }
            
            debugLog('GPT response received successfully', 'success');
            return content;
            
        } catch (error) {
            if (error.name === 'AbortError') {
                debugLog('Request timeout', 'error');
                throw new Error('リクエストがタイムアウトしました');
            } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
                debugLog('Network connection error', 'error');
                throw new Error('ネットワーク接続エラーが発生しました');
            } else {
                debugLog(`GPT API error: ${error.message}`, 'error');
                throw error;
            }
        }
    }
    
    generateLocalResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('yodobloom') || lowerMessage.includes('テーマパーク') || lowerMessage.includes('について')) {
            return `yodobloom SAKEについてご紹介します🍶

🏪 **yodobloom SAKE**
📍 大阪市北区大深町1-1 2階
☎️ 06-4802-1010
🌟 モットー：季節ごとに厳選された100種類の日本酒テーマパーク

🌸 **特徴**
・認定唎酒師®によるガイド付き体験
・季節ごとに厳選された100種類の日本酒
・個人の好みに合わせたカスタマイズ推薦
・アプリ連動の酒チャレンジ

日本酒の楽しさを存分に味わえるテーマパークです✨`;
        }
        
        if (lowerMessage.includes('燗酒') || lowerMessage.includes('燗') || lowerMessage.includes('温め') || lowerMessage.includes('日本酒')) {
            return `日本酒の魅力をご紹介します🍶

🔥 **日本酒の楽しみ方**
・冷酒（5-10℃）：すっきりとした味わい
・常温（15-20℃）：お酒本来の味を楽しむ
・燗酒（40-50℃）：まろやかで奥深い味わい

🌸 **yodobloom SAKEの体験**
認定唎酒師®が季節ごとに厳選した100種類の日本酒を、それぞれの最適な温度でお楽しみいただけます。
個人の好みに合わせて最適な日本酒をご提案いたします✨`;
        }
        
        if (lowerMessage.includes('商品') || lowerMessage.includes('お酒') || lowerMessage.includes('おすすめ') || lowerMessage.includes('体験')) {
            return `yodobloom SAKEのおすすめ体験🍶

🌟 **季節限定100種類セレクション**
全国の優秀な蔵元から季節ごとに厳選された100種類の日本酒

🎯 **唎酒師®ガイド付き体験**
認定唎酒師®による30分間の専門的なガイド付き試飲体験

🎨 **カスタマイズ推薦体験**
個人の好みに合わせた30分間のカスタマイズされた日本酒推薦

📱 **アプリ連動酒チャレンジ**
モバイルアプリを使った予約システムと酒チャレンジゲーム

どの体験も日本酒の奥深さを存分に楽しめます🌸`;
        }
        
        return `ご質問ありがとうございます🌸

yodobloom SAKEは「季節ごとに厳選された100種類の日本酒テーマパーク」として、認定唎酒師®のガイド付きで日本酒の楽しさを存分に味わえる体験を提供しています。

🍶 日本酒の楽しみ方について
🏪 yodobloom SAKEについて
🎯 体験サービスについて

何でもお気軽にお聞きください！`;
    }
    
    async translateResponse(text, targetLang) {
        if (!this.config?.deepl?.apiKey || targetLang === 'ja') {
            return text;
        }
        
        debugLog(`Translating text to ${targetLang}`, 'info');
        
        try {
            const langMap = {
                'en': 'EN',
                'zh-cn': 'ZH',
                'zh-tw': 'ZH',
                'ko': 'KO',
                'fr': 'FR',
                'es': 'ES',
                'de': 'DE',
                'it': 'IT',
                'pt': 'PT'
            };
            
            const deeplTargetLang = langMap[targetLang] || 'EN';
            
            // Netlify FunctionのURLを決定
            const functionUrl = window.location.hostname === 'localhost' 
                ? 'http://localhost:8888/.netlify/functions/translate'
                : '/.netlify/functions/translate';
            
            const response = await fetch(functionUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: text,
                    targetLang: targetLang
                }),
                signal: AbortSignal.timeout(15000) // 15秒タイムアウト
            });
            
            debugLog(`DeepL API Response status: ${response.status}`, response.ok ? 'success' : 'error');
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.message || `HTTP ${response.status}`;
                
                if (response.status === 401) {
                    debugLog('DeepL API key authentication failed', 'error');
                    throw new Error('DeepL APIキーが無効です');
                } else if (response.status === 403) {
                    debugLog('DeepL API access forbidden', 'error');
                    throw new Error('DeepL APIアクセスが拒否されました');
                } else if (response.status === 429) {
                    debugLog('DeepL rate limit exceeded', 'warn');
                    throw new Error('DeepL翻訳制限に達しました');
                } else if (response.status === 456) {
                    debugLog('DeepL quota exceeded', 'warn');
                    throw new Error('DeepL翻訳の月間制限に達しました');
                } else if (response.status >= 500) {
                    debugLog('DeepL server error', 'error');
                    throw new Error('DeepLサーバーエラーが発生しました');
                } else {
                    throw new Error(`DeepL API Error: ${errorMessage}`);
                }
            }
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'Translation request failed');
            }
            
            const translatedText = data.translatedText;
            
            if (!translatedText) {
                debugLog('Empty translation response', 'warn');
                throw new Error('翻訳結果が空でした');
            }
            
            debugLog('Translation completed successfully', 'success');
            return translatedText;
            
        } catch (error) {
            if (error.name === 'AbortError') {
                debugLog('Translation timeout', 'error');
                throw new Error('翻訳リクエストがタイムアウトしました');
            } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
                debugLog('Translation network error', 'error');
                throw new Error('翻訳ネットワークエラーが発生しました');
            } else {
                debugLog(`Translation error: ${error.message}`, 'error');
                throw error;
            }
        }
    }
    
    showTypingIndicator() {
        this.isTyping = true;
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message-container typing-indicator';
        typingDiv.innerHTML = `
            <div class="avatar-mini">
                <img src="ai-sakura-icon.png" alt="AIさくら">
            </div>
            <div class="message-bubble ai-bubble typing">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        this.chatMessages?.appendChild(typingDiv);
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        this.isTyping = false;
        const typingIndicator = this.chatMessages?.querySelector('.typing-indicator');
        typingIndicator?.remove();
    }
    
    addMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message-container ${type}-message`;
        
        const currentTime = new Date().toLocaleTimeString('ja-JP', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        if (type === 'ai') {
            messageDiv.innerHTML = `
                <div class="avatar-mini">
                    <img src="ai-sakura-icon.png" alt="AIさくら">
                </div>
                <div class="message-bubble ai-bubble">
                    ${this.formatMessage(message)}
                    <div class="message-time">${currentTime}</div>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-bubble user-bubble">
                    ${this.formatMessage(message)}
                    <div class="message-time">${currentTime}</div>
                </div>
            `;
        }
        
        this.chatMessages?.appendChild(messageDiv);
        this.scrollToBottom();
        
        // 会話履歴に追加
        this.conversationHistory.push({
            role: type === 'user' ? 'user' : 'assistant',
            content: message
        });
        
        // 履歴の長さを制限
        if (this.conversationHistory.length > 20) {
            this.conversationHistory = this.conversationHistory.slice(-10);
        }
    }
    
    formatMessage(message) {
        return message
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/・([^\n]+)/g, '・<span class="highlight">$1</span>');
    }
    
    scrollToBottom() {
        setTimeout(() => {
            if (this.chatMessages) {
                this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
            }
        }, 100);
    }
    
    setLanguage(language) {
        this.currentLanguage = language;
        const languageIndicator = document.querySelector('.language-indicator');
        if (languageIndicator) {
            const langMap = {
                'ja': '🌐 日本語',
                'en': '🌐 English',
                'zh': '🌐 中文'
            };
            languageIndicator.textContent = langMap[language] || '🌐 日本語';
        }
    }
}


// 初期化
document.addEventListener('DOMContentLoaded', function() {
    debugLog('Starting chatbot initialization...', 'info');
    
    try {
        // AI Config の確認
        if (typeof window.aiConfig === 'undefined') {
            debugLog('AI Config not found', 'error');
            showInitializationError('AI設定が見つかりません。config/ai-config.js ファイルを確認してください。');
            return;
        }
        
        debugLog('AI Config found', 'success');
        
        // API キーの検証
        const openaiKey = window.aiConfig?.openai?.apiKey;
        const deeplKey = window.aiConfig?.deepl?.apiKey;
        
        if (!openaiKey || openaiKey === 'YOUR_OPENAI_API_KEY_HERE' || openaiKey.length < 10) {
            debugLog('OpenAI API key invalid or missing', 'warn');
        } else {
            debugLog('OpenAI API key found', 'success');
        }
        
        if (!deeplKey || deeplKey === 'YOUR_DEEPL_API_KEY_HERE' || deeplKey.length < 10) {
            debugLog('DeepL API key invalid or missing', 'warn');
        } else {
            debugLog('DeepL API key found', 'success');
        }
        
        // チャットボット要素の確認
        const chatButton = document.getElementById('chatButton');
        const chatInterface = document.getElementById('chatInterface');
        
        if (!chatButton) {
            debugLog('Chat button element not found', 'error');
            showInitializationError('チャットボタンが見つかりません。HTML構造を確認してください。');
            return;
        }
        
        if (!chatInterface) {
            debugLog('Chat interface element not found', 'error');
            showInitializationError('チャットインターフェースが見つかりません。HTML構造を確認してください。');
            return;
        }
        
        debugLog('All required elements found', 'success');
        
        // モダンチャットボット初期化
        window.modernChatbot = new ModernChatbot();
        debugLog('Modern Chatbot system initialized successfully', 'success');
        
        // 初期化成功の通知
        setTimeout(() => {
            showInitializationSuccess('AIさくらが準備完了しました！🌸');
        }, 1000);
        
    } catch (error) {
        debugLog(`Initialization failed: ${error.message}`, 'error');
        console.error('Chatbot initialization error:', error);
        showInitializationError(`初期化エラー: ${error.message}`);
    }
});

// 初期化エラーメッセージ表示
function showInitializationError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'chatbot-init-error';
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #ff6b6b, #ee5a5a);
        color: white;
        padding: 15px 20px;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);
        z-index: 10000;
        max-width: 350px;
        font-size: 0.9rem;
        line-height: 1.4;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    `;
    
    errorDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
            <span style="font-size: 1.2rem;">🚨</span>
            <strong>チャットボットエラー</strong>
        </div>
        <div>${message}</div>
        <div style="margin-top: 10px; font-size: 0.8rem; opacity: 0.9;">
            詳細はブラウザのコンソールをご確認ください。
        </div>
    `;
    
    document.body.appendChild(errorDiv);
    
    // 10秒後に自動で削除
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 10000);
}

// 初期化成功メッセージ表示
function showInitializationSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'chatbot-init-success';
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #48cae4, #0077b6);
        color: white;
        padding: 15px 20px;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(72, 202, 228, 0.3);
        z-index: 10000;
        max-width: 300px;
        font-size: 0.9rem;
        line-height: 1.4;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        animation: slideInRight 0.5s ease;
    `;
    
    successDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 1.2rem;">🌸</span>
            <div>${message}</div>
        </div>
    `;
    
    document.body.appendChild(successDiv);
    
    // 3秒後に自動で削除
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => successDiv.remove(), 500);
        }
    }, 3000);
}

// CSS アニメーション追加
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// デバッグ用グローバル関数
window.testChatbot = function() {
    debugLog('=== CHATBOT DEBUG TEST ===', 'info');
    
    const config = window.aiConfig;
    const chatbot = window.modernChatbot;
    
    debugLog('AI Config:', 'info');
    console.log({
        openaiKey: config?.openai?.apiKey ? 'Present' : 'Missing',
        deeplKey: config?.deepl?.apiKey ? 'Present' : 'Missing',
        model: config?.openai?.model
    });
    
    debugLog('Chatbot Instance:', 'info');
    console.log({
        initialized: !!chatbot,
        isOpen: chatbot?.isOpen,
        isTyping: chatbot?.isTyping,
        hasElements: {
            chatButton: !!chatbot?.chatButton,
            chatInterface: !!chatbot?.chatInterface,
            messageInput: !!chatbot?.messageInput,
            sendButton: !!chatbot?.sendButton
        }
    });
    
    debugLog('=== TEST COMPLETE ===', 'success');
    return {
        config: !!config,
        chatbot: !!chatbot,
        ready: !!(config && chatbot)
    };
};

// ページロード時にテスト関数を通知
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        debugLog('チャットボットのテスト: コンソールで window.testChatbot() を実行してください', 'info');
    }, 2000);
});