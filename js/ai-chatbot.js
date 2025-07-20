// yodobloom SAKE AI Chatbot
// yodobloom SAKE専用 AIチャットボット機能

class ModernChatbot {
    constructor() {
        this.currentLanguage = 'ja';
        this.isMinimized = false;
        this.isVisible = false;
        this.messageHistory = [];
        this.isTyping = false;
        this.quickReplies = [
            'yodobloom SAKEについて教えて',
            '唎酒師®ガイド付き試飲について',
            '100種類の日本酒について',
            '営業時間とアクセス方法',
            'アプリの使い方を教えて',
            'カスタマイズ推薦とは？',
            '予約方法について',
            '料金システムについて'
        ];
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.initializeWelcomeMessage();
        this.setupQuickReplies();
        console.log('yodobloom SAKE Modern Chatbot initialized');
    }
    
    bindEvents() {
        // チャットボタン
        const chatButton = document.getElementById('chatButton');
        if (chatButton) {
            chatButton.addEventListener('click', () => this.toggleChat());
        }
        
        // 閉じるボタン
        const closeBtn = document.getElementById('closeChat');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeChat());
        }
        
        // 最小化ボタン
        const minimizeBtn = document.getElementById('minimizeChat');
        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', () => this.minimizeChat());
        }
        
        // 送信機能
        const sendButton = document.getElementById('sendButton');
        const messageInput = document.getElementById('messageInput');
        
        if (sendButton) {
            sendButton.addEventListener('click', () => this.sendMessage());
        }
        
        if (messageInput) {
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
            
            messageInput.addEventListener('input', () => {
                this.updateCharacterCount();
            });
        }
        
        // クイック返信ボタン
        this.bindQuickReplyEvents();
    }
    
    bindQuickReplyEvents() {
        const quickBtns = document.querySelectorAll('.quick-btn');
        quickBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const message = btn.getAttribute('data-message');
                if (message) {
                    this.sendQuickReply(message);
                }
            });
        });
    }
    
    setupQuickReplies() {
        const quickActions = document.querySelector('.quick-actions');
        if (quickActions) {
            quickActions.innerHTML = this.quickReplies.map(reply => 
                `<button class="quick-btn" data-message="${reply}">${this.getQuickReplyIcon(reply)} ${reply}</button>`
            ).join('');
            this.bindQuickReplyEvents();
        }
    }
    
    getQuickReplyIcon(reply) {
        if (reply.includes('yodobloom SAKE')) return '🏢';
        if (reply.includes('唎酒師')) return '🍶';
        if (reply.includes('100種類')) return '⭐';
        if (reply.includes('営業時間')) return '🕐';
        if (reply.includes('アプリ')) return '📱';
        if (reply.includes('カスタマイズ')) return '🎯';
        if (reply.includes('予約')) return '📅';
        if (reply.includes('料金')) return '💰';
        return '💬';
    }
    
    initializeWelcomeMessage() {
        const welcomeMessage = 
            'こんにちは！yodobloom SAKE AIサポートです🍶\n日本酒テーマパークについて何でもお聞きください！';
        
        // ウェルカムメッセージが既に存在するかチェック
        const existingWelcome = document.querySelector('.welcome-message .message-bubble p');
        if (existingWelcome) {
            existingWelcome.textContent = welcomeMessage;
        }
    }
    
    toggleChat() {
        const chatContainer = document.getElementById('modernChatContainer');
        if (chatContainer) {
            if (this.isVisible) {
                this.closeChat();
            } else {
                this.openChat();
            }
        }
    }
    
    openChat() {
        const chatContainer = document.getElementById('modernChatContainer');
        const chatButton = document.getElementById('chatButton');
        
        if (chatContainer && chatButton) {
            chatContainer.classList.add('active');
            chatButton.style.display = 'none';
            this.isVisible = true;
            this.isMinimized = false;
            
            // フォーカス
            setTimeout(() => {
                const messageInput = document.getElementById('messageInput');
                if (messageInput) {
                    messageInput.focus();
                }
            }, 300);
        }
    }
    
    closeChat() {
        const chatContainer = document.getElementById('modernChatContainer');
        const chatButton = document.getElementById('chatButton');
        
        if (chatContainer && chatButton) {
            chatContainer.classList.remove('active');
            chatButton.style.display = 'flex';
            this.isVisible = false;
            this.isMinimized = false;
        }
    }
    
    minimizeChat() {
        const chatContainer = document.getElementById('modernChatContainer');
        if (chatContainer) {
            chatContainer.classList.toggle('minimized');
            this.isMinimized = !this.isMinimized;
        }
    }
    
    async sendMessage() {
        const messageInput = document.getElementById('messageInput');
        if (!messageInput) return;
        
        const message = messageInput.value.trim();
        if (!message) return;
        
        // ユーザーメッセージを表示
        this.addMessage(message, 'user');
        messageInput.value = '';
        this.updateCharacterCount();
        
        // タイピングインジケーター表示
        this.showTypingIndicator();
        
        try {
            // AI応答を取得
            const response = await this.getAIResponse(message);
            
            // タイピング削除して応答表示
            this.hideTypingIndicator();
            this.addMessage(response, 'ai');
            
        } catch (error) {
            console.error('AI Response Error:', error);
            this.hideTypingIndicator();
            this.addMessage('申し訳ございません。一時的な問題が発生しました。しばらくしてから再度お試しください。🍶', 'ai');
        }
    }
    
    sendQuickReply(message) {
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
            messageInput.value = message;
            this.sendMessage();
        }
    }
    
    addMessage(text, sender) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const time = new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
        
        if (sender === 'user') {
            messageDiv.innerHTML = `
                <div class="message-bubble user-bubble">
                    <p>${this.escapeHtml(text)}</p>
                    <div class="message-time">${time}</div>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="avatar-mini">
                    <img src="yodobloom-ai-icon.png" alt="yodobloom AI">
                </div>
                <div class="message-bubble ai-bubble">
                    <p>${this.formatAIResponse(text)}</p>
                    <div class="message-time">${time}</div>
                </div>
            `;
        }
        
        chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
        
        // メッセージ履歴に追加
        this.messageHistory.push({ text, sender, time });
    }
    
    formatAIResponse(text) {
        // 改行を<br>に変換
        let formatted = text.replace(/\n/g, '<br>');
        
        // 【】で囲まれた部分を強調
        formatted = formatted.replace(/【([^】]+)】/g, '<strong>【$1】</strong>');
        
        // ・で始まる行をリスト化
        formatted = formatted.replace(/・([^<br>]+)/g, '• $1');
        
        return formatted;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    showTypingIndicator() {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai-message typing-indicator';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="avatar-mini">
                <img src="yodobloom-ai-icon.png" alt="yodobloom AI">
            </div>
            <div class="message-bubble ai-bubble">
                <div class="typing-animation">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
        this.isTyping = true;
    }
    
    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
        this.isTyping = false;
    }
    
    scrollToBottom() {
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            setTimeout(() => {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 100);
        }
    }
    
    updateCharacterCount() {
        const messageInput = document.getElementById('messageInput');
        if (!messageInput) return;
        
        const currentLength = messageInput.value.length;
        const maxLength = messageInput.getAttribute('maxlength') || 500;
        
        // 文字数カウンター更新（必要に応じて）
        const counter = document.getElementById('characterCounter');
        if (counter) {
            counter.textContent = `${currentLength}/${maxLength}`;
        }
    }
    
    async getAIResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        // yodobloom SAKE基本情報
        if (lowerMessage.includes('yodobloom') || lowerMessage.includes('ヨドブルーム') || lowerMessage.includes('テーマパーク')) {
            return `yodobloom SAKEは大阪市北区大深町にある日本酒テーマパークです🍶\n\n【基本情報】\n・所在地：大阪市北区大深町1-1 2階\n・電話：06-4802-1010\n・営業時間：平日 12:00-22:00、土日祝日 10:00-22:00\n・最終入場：21:00\n\n【特徴】\n・季節ごとに厳選された100種類の日本酒\n・認定唎酒師®によるガイド付き体験\n・個人化された日本酒推薦体験\n・アプリ連動の酒チャレンジ\n\n大阪・梅田の便利な立地で、日本酒の新しい世界をお楽しみください🎌`;
        }
        
        // 唎酒師について
        if (lowerMessage.includes('唎酒師') || lowerMessage.includes('ガイド') || lowerMessage.includes('専門')) {
            return `唎酒師®ガイド付き体験についてご紹介します🍶\n\n【唎酒師®とは】\n・日本酒の専門資格を持つプロフェッショナル\n・テイスティング技術と豊富な知識を持つ専門家\n・お客様一人一人に最適な日本酒を提案\n\n【体験内容】\n・30分間の個人化された推薦体験\n・100種類から厳選したテイスティング\n・日本酒の基礎知識から応用まで学べる\n・個人の好みに合わせたカスタマイズ\n\n初心者の方も安心してお楽しみいただけます✨`;
        }
        
        // 100種類の日本酒について
        if (lowerMessage.includes('100種類') || lowerMessage.includes('日本酒') || lowerMessage.includes('種類')) {
            return `100種類の日本酒セレクションについてご案内します🍶\n\n【ラインナップ】\n・純米大吟醸：最高級の洗練された味わい\n・純米吟醸：バランスの取れた上品な香り\n・特別限定酒：季節ごとの希少な逸品\n・地域限定酒：全国各地の特色ある銘柄\n\n【特徴】\n・季節ごとに内容が変わる厳選セレクション\n・全国の優秀な蔵元から直接仕入れ\n・鳴門鯛LED、純米大吟醸悠星など受賞酒も\n・初心者から上級者まで楽しめる幅広い選択\n\n毎回新しい発見がある、日本酒の宝庫です⭐`;
        }
        
        // 営業時間・アクセスについて
        if (lowerMessage.includes('営業') || lowerMessage.includes('時間') || lowerMessage.includes('アクセス') || lowerMessage.includes('場所')) {
            return `営業時間・アクセス情報をご案内します🕐\n\n【営業時間】\n・平日：12:00-22:00\n・土日祝日：10:00-22:00\n・最終入場：21:00\n\n【所在地】\n大阪市北区大深町1-1 2階\n\n【アクセス】\n・梅田駅から徒歩圏内\n・アクセス抜群の立地\n・大阪の中心部で便利\n\n【お問い合わせ】\n電話：06-4802-1010\n\nお気軽にお越しください🎌`;
        }
        
        // アプリについて
        if (lowerMessage.includes('アプリ') || lowerMessage.includes('予約') || lowerMessage.includes('チャレンジ')) {
            return `モバイルアプリについてご紹介します📱\n\n【主な機能】\n・簡単予約システム\n・酒チャレンジゲーム\n・個人の好み記録\n・体験履歴管理\n・推薦酒の記録\n\n【酒チャレンジ】\n・日本酒の知識を深めるゲーム要素\n・テイスティング能力の向上\n・達成感のある学習体験\n・ソーシャル機能で友人と競争\n\n【予約特典】\n・アプリ経由でスムーズな予約\n・特別な体験プランの案内\n・リピーター特典\n\nダウンロードしてyodobloom SAKEをより楽しく体験しましょう✨`;
        }
        
        // カスタマイズ推薦について
        if (lowerMessage.includes('カスタマイズ') || lowerMessage.includes('推薦') || lowerMessage.includes('個人化')) {
            return `カスタマイズ推薦体験についてご説明します🎯\n\n【30分間の個人化体験】\n・あなたの好みを詳しくヒアリング\n・味の傾向分析（甘口・辛口・香りなど）\n・過去の日本酒経験を考慮\n・食事との相性も含めた提案\n\n【推薦プロセス】\n1. 簡単な質問票記入\n2. 唎酒師®との対話\n3. テイスティング実施\n4. 個人専用推薦リスト作成\n\n【体験後】\n・あなた専用の推薦記録\n・今後の参考データとして保存\n・次回来店時により精度の高い提案\n\n一人一人に合わせた、世界に一つだけの日本酒体験です🌟`;
        }
        
        return `yodobloom SAKEについてお答えします🍶\n\nyodobloom SAKEは大阪・梅田にある日本酒テーマパークです。認定唎酒師®のガイド付きで、季節ごとに厳選された100種類の日本酒をお楽しみいただけます。\n\n他にも唎酒師®体験やアプリ機能について、お気軽にお聞きください🎌`;
    }
    
    setLanguage(langCode) {
        this.currentLanguage = langCode;
        console.log(`Chatbot language set to: ${langCode}`);
        
        // 言語変更時の処理（必要に応じて）
        this.updateLanguageIndicator(langCode);
    }
    
    updateLanguageIndicator(langCode) {
        const languageIndicator = document.querySelector('.language-indicator');
        if (languageIndicator) {
            const languageNames = {
                'ja': '🇯🇵 日本語',
                'en': '🇺🇸 English',
                'zh-cn': '🇨🇳 简体中文',
                'zh-tw': '🇹🇼 繁體中文',
                'fr': '🇫🇷 Français',
                'ko': '🇰🇷 한국어',
                'es': '🇪🇸 Español',
                'de': '🇩🇪 Deutsch'
            };
            
            languageIndicator.textContent = languageNames[langCode] || '🌐 Language';
        }
    }
}

// グローバル関数（後方互換性のため）
function openAISakuraChat() {
    if (window.modernChatbot) {
        window.modernChatbot.openChat();
    }
}

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    window.modernChatbot = new ModernChatbot();
    console.log('yodobloom SAKE Chatbot ready');
});

// yodobloom SAKE専用クイック返信設定
yodobloom SAKE専門知識:
- 日本酒テーマパーク運営
- 認定唎酒師®ガイド体験
- 季節限定100種類セレクション
- アプリ連動システム
- 個人化推薦サービス
- 大阪・梅田立地
- カスタマイズ体験