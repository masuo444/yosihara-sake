// 使いやすさ重視のチャットボット - yodobloom SAKE専用

class EnhancedChatbot {
    constructor() {
        this.isOpen = false;
        this.isMinimized = false;
        this.messages = [];
        this.isTyping = false;
        this.currentLanguage = 'ja';
        
        // よく使われる質問
        this.quickQuestions = {
            ja: [
                '🏪 yodobloom SAKEについて教えて',
                '🍶 唎酒師ガイドについて教えて',
                '📍 場所と営業時間を教えて',
                '💰 料金について教えて',
                '📞 予約方法を教えて'
            ],
            en: [
                '🏪 Tell me about yodobloom SAKE',
                '🍶 About sake tasting guide',
                '📍 Location and hours',
                '💰 Pricing information',
                '📞 How to make reservation'
            ]
        };
        
        this.init();
    }
    
    init() {
        this.createChatInterface();
        this.bindEvents();
        this.addKeyboardShortcuts();
        console.log('✅ Enhanced Chatbot initialized');
    }
    
    createChatInterface() {
        // 既存のチャットUIを削除
        document.querySelectorAll('[id*="chat"], [class*="chat"]').forEach(el => {
            if (!el.classList.contains('enhanced-chat')) {
                el.remove();
            }
        });
        
        const chatHTML = `
            <!-- フローティングボタン -->
            <button id="enhancedChatBtn" class="enhanced-chat-btn">
                <div class="chat-btn-content">
                    <div class="chat-avatar">
                        <img src="ai-sakura-icon.png" alt="AIサポート">
                        <div class="online-indicator"></div>
                    </div>
                    <div class="chat-btn-text">
                        <span class="chat-main-text">AIサポート</span>
                        <span class="chat-sub-text">何でも聞いてください</span>
                    </div>
                </div>
                <div class="chat-notification" id="chatNotification" style="display: none;">1</div>
            </button>
            
            <!-- チャットウィンドウ -->
            <div id="enhancedChatWindow" class="enhanced-chat-window">
                <div class="chat-header">
                    <div class="chat-header-info">
                        <img src="ai-sakura-icon.png" alt="AIサポート" class="header-avatar">
                        <div class="header-details">
                            <h3>yodobloom SAKE AIサポート</h3>
                            <span class="status-text">オンライン • 即座に回答</span>
                        </div>
                    </div>
                    <div class="chat-controls">
                        <button id="minimizeChat" class="control-btn">−</button>
                        <button id="closeChat" class="control-btn">×</button>
                    </div>
                </div>
                
                <div class="chat-messages" id="chatMessages">
                    <div class="welcome-message">
                        <div class="message-avatar">
                            <img src="ai-sakura-icon.png" alt="AI">
                        </div>
                        <div class="message-content ai-message">
                            <p>こんにちは！yodobloom SAKE AIサポートです🌸</p>
                            <p>日本酒テーマパークについて何でもお聞きください！</p>
                            <div class="message-time">今すぐ</div>
                        </div>
                    </div>
                </div>
                
                
                <div class="typing-indicator" id="typingIndicator" style="display: none;">
                    <div class="typing-avatar">
                        <img src="ai-sakura-icon.png" alt="AI">
                    </div>
                    <div class="typing-dots">
                        <span></span><span></span><span></span>
                    </div>
                </div>
                
                <div class="chat-input-container">
                    <div class="input-wrapper">
                        <textarea 
                            id="chatInput" 
                            placeholder="メッセージを入力してください..." 
                            rows="1"
                            maxlength="1000"
                        ></textarea>
                        <button id="sendMessage" class="send-btn">
                            <svg viewBox="0 0 24 24" width="20" height="20">
                                <path fill="currentColor" d="M2,21L23,12L2,3V10L17,12L2,14V21Z"/>
                            </svg>
                        </button>
                    </div>
                    <div class="input-footer">
                        <span class="lang-indicator">🌐 日本語対応</span>
                        <span class="send-hint">Ctrl+Enter で送信</span>
                        <span class="char-counter"><span id="charCount">0</span>/1000</span>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', chatHTML);
        this.addChatStyles();
    }
    
    addChatStyles() {
        const style = document.createElement('style');
        style.id = 'enhanced-chat-styles';
        style.textContent = `
            /* フローティングボタン */
            .enhanced-chat-btn {
                position: fixed;
                bottom: 24px;
                right: 24px;
                background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
                border: none;
                border-radius: 16px;
                padding: 12px 16px;
                cursor: pointer;
                box-shadow: 0 8px 32px rgba(0, 123, 255, 0.3);
                z-index: 999998;
                transition: all 0.3s ease;
                min-width: 200px;
                color: white;
            }
            
            .enhanced-chat-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 12px 40px rgba(0, 123, 255, 0.4);
            }
            
            .chat-btn-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .chat-avatar {
                position: relative;
                width: 40px;
                height: 40px;
            }
            
            .chat-avatar img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                object-fit: cover;
            }
            
            .online-indicator {
                position: absolute;
                bottom: 2px;
                right: 2px;
                width: 12px;
                height: 12px;
                background: #28a745;
                border: 2px solid white;
                border-radius: 50%;
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
            
            .chat-btn-text {
                flex: 1;
                text-align: left;
            }
            
            .chat-main-text {
                display: block;
                font-size: 14px;
                font-weight: 600;
                margin-bottom: 2px;
            }
            
            .chat-sub-text {
                display: block;
                font-size: 11px;
                opacity: 0.9;
            }
            
            .chat-notification {
                position: absolute;
                top: -8px;
                right: -8px;
                background: #dc3545;
                color: white;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: 600;
                animation: bounce 1s infinite;
            }
            
            @keyframes bounce {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
            
            /* チャットウィンドウ */
            .enhanced-chat-window {
                position: fixed;
                bottom: 24px;
                right: 24px;
                width: 380px;
                height: 600px;
                background: white;
                border-radius: 16px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
                border: 1px solid #e9ecef;
                z-index: 999999;
                display: flex;
                flex-direction: column;
                opacity: 0;
                visibility: hidden;
                transform: translateY(20px) scale(0.95);
                transition: all 0.3s ease;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            
            .enhanced-chat-window.active {
                opacity: 1;
                visibility: visible;
                transform: translateY(0) scale(1);
            }
            
            .enhanced-chat-window.minimized {
                height: 60px;
                overflow: hidden;
            }
            
            .chat-header {
                background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
                color: white;
                padding: 16px 20px;
                border-radius: 16px 16px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .chat-header-info {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .header-avatar {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                border: 2px solid rgba(255, 255, 255, 0.3);
            }
            
            .header-details h3 {
                margin: 0;
                font-size: 14px;
                font-weight: 600;
            }
            
            .status-text {
                font-size: 11px;
                opacity: 0.9;
            }
            
            .chat-controls {
                display: flex;
                gap: 8px;
            }
            
            .control-btn {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                width: 28px;
                height: 28px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                transition: background 0.2s ease;
            }
            
            .control-btn:hover {
                background: rgba(255, 255, 255, 0.3);
            }
            
            .chat-messages {
                flex: 1;
                padding: 20px;
                overflow-y: auto;
                background: #f8f9fa;
            }
            
            .welcome-message,
            .message-item {
                display: flex;
                align-items: flex-start;
                gap: 12px;
                margin-bottom: 16px;
            }
            
            .message-avatar {
                width: 32px;
                height: 32px;
                flex-shrink: 0;
            }
            
            .message-avatar img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }
            
            .message-content {
                background: white;
                border-radius: 12px;
                padding: 12px 16px;
                max-width: 280px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                position: relative;
            }
            
            .ai-message {
                background: white;
            }
            
            .user-message {
                background: #007bff;
                color: white;
                margin-left: auto;
            }
            
            .message-content p {
                margin: 0 0 8px 0;
                font-size: 14px;
                line-height: 1.4;
            }
            
            .message-content p:last-child {
                margin-bottom: 0;
            }
            
            .message-time {
                font-size: 11px;
                color: #6c757d;
                margin-top: 4px;
            }
            
            .user-message .message-time {
                color: rgba(255, 255, 255, 0.8);
            }
            
            
            .typing-indicator {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 16px 20px;
                background: #f8f9fa;
            }
            
            .typing-avatar {
                width: 32px;
                height: 32px;
            }
            
            .typing-avatar img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }
            
            .typing-dots {
                display: flex;
                gap: 4px;
            }
            
            .typing-dots span {
                width: 8px;
                height: 8px;
                background: #6c757d;
                border-radius: 50%;
                animation: typing 1.4s infinite ease-in-out;
            }
            
            .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
            .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
            
            @keyframes typing {
                0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
                40% { transform: scale(1); opacity: 1; }
            }
            
            .chat-input-container {
                border-top: 1px solid #e9ecef;
                background: white;
                border-radius: 0 0 16px 16px;
            }
            
            .input-wrapper {
                display: flex;
                align-items: flex-end;
                padding: 16px 20px 8px;
                gap: 12px;
            }
            
            #chatInput {
                flex: 1;
                border: 1px solid #e9ecef;
                border-radius: 20px;
                padding: 10px 16px;
                font-size: 14px;
                font-family: inherit;
                resize: none;
                outline: none;
                transition: border-color 0.2s ease;
                min-height: 20px;
                max-height: 100px;
            }
            
            #chatInput:focus {
                border-color: #007bff;
            }
            
            .send-btn {
                background: #007bff;
                border: none;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                color: white;
                transition: all 0.2s ease;
            }
            
            .send-btn:hover {
                background: #0056b3;
                transform: scale(1.05);
            }
            
            .send-btn:disabled {
                background: #6c757d;
                cursor: not-allowed;
                transform: none;
            }
            
            .input-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 20px 16px;
                font-size: 11px;
                color: #6c757d;
            }
            
            .send-hint {
                color: #007bff;
                font-weight: 500;
            }
            
            .char-counter {
                color: #6c757d;
            }
            
            /* モバイル対応 */
            @media (max-width: 768px) {
                .enhanced-chat-btn {
                    bottom: 20px;
                    right: 20px;
                    min-width: 160px;
                    padding: 10px 14px;
                }
                
                .enhanced-chat-window {
                    bottom: 20px;
                    right: 20px;
                    left: 20px;
                    width: auto;
                    height: 80vh;
                    max-height: 600px;
                }
                
            }
        `;
        
        document.head.appendChild(style);
    }
    
    bindEvents() {
        const chatBtn = document.getElementById('enhancedChatBtn');
        const chatWindow = document.getElementById('enhancedChatWindow');
        const minimizeBtn = document.getElementById('minimizeChat');
        const closeBtn = document.getElementById('closeChat');
        const sendBtn = document.getElementById('sendMessage');
        const chatInput = document.getElementById('chatInput');
        
        // チャット開閉
        chatBtn.addEventListener('click', () => {
            this.toggleChat();
        });
        
        minimizeBtn.addEventListener('click', () => {
            this.minimizeChat();
        });
        
        closeBtn.addEventListener('click', () => {
            this.closeChat();
        });
        
        // メッセージ送信
        sendBtn.addEventListener('click', () => {
            this.sendMessage();
        });
        
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                // Ctrl+Enterで送信
                e.preventDefault();
                this.sendMessage();
            } else if (e.key === 'Enter' && e.shiftKey) {
                // Shift+Enterで改行（デフォルト動作）
                // 何もしない（改行される）
            }
            // 通常のEnterは改行のみ
        });
        
        // 文字数カウント
        chatInput.addEventListener('input', () => {
            const count = chatInput.value.length;
            document.getElementById('charCount').textContent = count;
            
            // 自動リサイズ
            chatInput.style.height = 'auto';
            chatInput.style.height = Math.min(chatInput.scrollHeight, 100) + 'px';
        });
        
    }
    
    addKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+K or Cmd+K でチャット開閉
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.toggleChat();
            }
            
            // Escape でチャット閉じる
            if (e.key === 'Escape' && this.isOpen) {
                this.closeChat();
            }
        });
    }
    
    toggleChat() {
        const chatWindow = document.getElementById('enhancedChatWindow');
        const chatBtn = document.getElementById('enhancedChatBtn');
        
        if (this.isOpen) {
            this.closeChat();
        } else {
            chatWindow.classList.add('active');
            chatBtn.style.display = 'none';
            this.isOpen = true;
            
            // フォーカス
            setTimeout(() => {
                document.getElementById('chatInput').focus();
            }, 300);
        }
    }
    
    minimizeChat() {
        const chatWindow = document.getElementById('enhancedChatWindow');
        chatWindow.classList.toggle('minimized');
        this.isMinimized = !this.isMinimized;
    }
    
    closeChat() {
        const chatWindow = document.getElementById('enhancedChatWindow');
        const chatBtn = document.getElementById('enhancedChatBtn');
        
        chatWindow.classList.remove('active');
        chatBtn.style.display = 'block';
        this.isOpen = false;
        this.isMinimized = false;
    }
    
    sendMessage() {
        const chatInput = document.getElementById('chatInput');
        const message = chatInput.value.trim();
        
        if (!message) return;
        
        this.addUserMessage(message);
        chatInput.value = '';
        document.getElementById('charCount').textContent = '0';
        chatInput.style.height = 'auto';
        
        // AI応答をシミュレート
        this.showTypingIndicator();
        setTimeout(() => {
            this.hideTypingIndicator();
            this.addAIResponse(message);
        }, 1500);
    }
    
    addUserMessage(message) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageHTML = `
            <div class="message-item user-item">
                <div class="message-content user-message">
                    <p>${this.escapeHtml(message)}</p>
                    <div class="message-time">${this.getCurrentTime()}</div>
                </div>
            </div>
        `;
        
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        this.scrollToBottom();
    }
    
    addAIResponse(userMessage) {
        const response = this.generateResponse(userMessage);
        const messagesContainer = document.getElementById('chatMessages');
        
        const messageHTML = `
            <div class="message-item ai-item">
                <div class="message-avatar">
                    <img src="ai-sakura-icon.png" alt="AI">
                </div>
                <div class="message-content ai-message">
                    <p>${response}</p>
                    <div class="message-time">${this.getCurrentTime()}</div>
                </div>
            </div>
        `;
        
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        this.scrollToBottom();
    }
    
    generateResponse(message) {
        const responses = {
            'yodobloom': 'yodobloom SAKEは大阪北区にある日本酒テーマパークです🍶 季節ごとに厳選された100種類の日本酒を唎酒師®ガイド付きで試飲できます！',
            '唎酒師': '認定唎酒師®が一人一人の好みに合わせて、個人化された日本酒推薦を行います。あなたにぴったりの一本を見つけるお手伝いをいたします🌸',
            '場所': '📍 大阪市北区大深町1-1 2階\n営業時間: 平日 12:00-22:00 | 土日祝日 10:00-22:00\nJR大阪駅から徒歩5分の好立地です！',
            '料金': '💰 試飲体験は種類によって異なります。詳しくは店舗までお問い合わせください📞 06-4802-1010',
            '予約': '📞 お電話でのご予約: 06-4802-1010\n当日のご来店も可能ですが、事前予約をおすすめします🌸'
        };
        
        for (const [key, response] of Object.entries(responses)) {
            if (message.includes(key)) {
                return response;
            }
        }
        
        return 'ご質問ありがとうございます🌸 yodobloom SAKEの日本酒テーマパークについて、もう少し具体的にお聞かせください。唎酒師®ガイド、営業時間、場所など、何についてお知りになりたいですか？';
    }
    
    showTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        indicator.style.display = 'flex';
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        indicator.style.display = 'none';
    }
    
    scrollToBottom() {
        const messagesContainer = document.getElementById('chatMessages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    getCurrentTime() {
        return new Date().toLocaleTimeString('ja-JP', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.enhancedChatbot = new EnhancedChatbot();
        console.log('✅ Enhanced Chatbot loaded');
    } catch (error) {
        console.error('❌ Enhanced Chatbot failed to load:', error);
    }
});