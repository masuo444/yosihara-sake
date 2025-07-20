// Improved Modern AI Chatbot for yodobloom SAKE
// Enhanced multilingual support and better error handling

// Language detection utility
function detectLanguage(text) {
    // Basic language detection based on character patterns
    const japanesePattern = /[ひらがなカタカナ漢字]/;
    const chinesePattern = /[一-龯]/;
    const koreanPattern = /[ㄱ-ㅎㅏ-ㅣ가-힣]/;
    const thaiPattern = /[ก-๙]/;
    const vietnamesePattern = /[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđĐ]/;
    
    if (japanesePattern.test(text)) {
        return 'ja';
    } else if (chinesePattern.test(text)) {
        // Simplified check - could be improved with proper Chinese variant detection
        return 'zh-cn';
    } else if (koreanPattern.test(text)) {
        return 'ko';
    } else if (thaiPattern.test(text)) {
        return 'th';
    } else if (vietnamesePattern.test(text)) {
        return 'vi';
    } else {
        // Default to English for other Latin-based scripts
        return 'en';
    }
}

// Enhanced chatbot class with better multilingual support
class ImprovedChatbot {
    constructor() {
        this.config = window.aiConfig;
        this.companyManager = window.companyManager;
        this.isOpen = false;
        this.isMinimized = false;
        this.isTyping = false;
        this.conversationHistory = [];
        this.currentLanguage = 'ja';
        this.userDetectedLanguage = 'ja';
        
        this.initializeElements();
        this.bindEvents();
        this.setupQuickActions();
        this.showWelcomeMessage();
    }
    
    initializeElements() {
        this.chatButton = document.getElementById('chatButton');
        this.chatInterface = document.getElementById('chatInterface');
        this.closeBtn = document.getElementById('closeChat');
        this.minimizeBtn = document.getElementById('minimizeChat');
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.quickBtns = document.querySelectorAll('.quick-btn');
        
        if (!this.chatButton || !this.chatInterface || !this.chatMessages || !this.messageInput || !this.sendButton) {
            throw new Error('Required chat elements not found');
        }
    }
    
    bindEvents() {
        this.chatButton?.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleChat();
        });
        
        this.closeBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            this.closeChat();
        });
        
        this.minimizeBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            this.minimizeChat();
        });
        
        this.sendButton?.addEventListener('click', (e) => {
            e.preventDefault();
            this.sendMessage();
        });
        
        this.messageInput?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        this.quickBtns?.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const action = btn.getAttribute('data-action');
                this.handleQuickAction(action);
            });
        });
    }
    
    setupQuickActions() {
        // Update quick action buttons based on current language
        this.updateQuickActions();
    }
    
    updateQuickActions() {
        const quickActionsContainer = document.getElementById('quickActions');
        if (!quickActionsContainer) return;
        
        const actions = this.config.quickActions[this.currentLanguage] || this.config.quickActions.ja;
        
        quickActionsContainer.innerHTML = '';
        actions.forEach(action => {
            const button = document.createElement('button');
            button.className = 'quick-btn';
            button.setAttribute('data-action', action.action);
            button.textContent = action.text;
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleQuickAction(action.action);
            });
            quickActionsContainer.appendChild(button);
        });
    }
    
    showWelcomeMessage() {
        const welcomeMessage = this.config.chatbot.fallbackResponses[this.currentLanguage]?.welcome || 
                             this.config.chatbot.fallbackResponses.ja.welcome;
        this.addMessage(welcomeMessage, 'ai');
    }
    
    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }
    
    openChat() {
        this.isOpen = true;
        this.isMinimized = false;
        
        if (this.chatInterface) {
            this.chatInterface.style.display = 'block';
            setTimeout(() => {
                this.chatInterface.classList.add('open');
                this.chatInterface.classList.remove('minimized');
                this.scrollToBottom();
            }, 10);
        }
        
        if (this.chatButton) {
            this.chatButton.classList.add('active');
        }
    }
    
    closeChat() {
        this.isOpen = false;
        this.isMinimized = false;
        
        if (this.chatInterface) {
            this.chatInterface.classList.remove('open', 'minimized');
            setTimeout(() => {
                if (!this.isOpen && !this.isMinimized) {
                    this.chatInterface.style.display = 'none';
                }
            }, 300);
        }
        
        if (this.chatButton) {
            this.chatButton.classList.remove('active');
        }
    }
    
    minimizeChat() {
        this.isMinimized = true;
        
        if (this.chatInterface) {
            this.chatInterface.classList.add('minimized');
            this.chatInterface.classList.remove('open');
        }
    }
    
    async sendMessage() {
        const message = this.messageInput?.value?.trim();
        if (!message || this.isTyping) return;
        
        // Detect user's language
        this.userDetectedLanguage = detectLanguage(message);
        
        // Update UI language if different from current
        if (this.userDetectedLanguage !== this.currentLanguage) {
            this.currentLanguage = this.userDetectedLanguage;
            this.updateQuickActions();
        }
        
        // Add user message
        this.addMessage(message, 'user');
        this.messageInput.value = '';
        
        // Add to conversation history
        this.conversationHistory.push({
            role: 'user',
            content: message
        });
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Try to get AI response
            let response = await this.getAIResponse(message);
            
            // Add AI response to conversation history
            this.conversationHistory.push({
                role: 'assistant',
                content: response
            });
            
            // Keep only last 10 messages
            if (this.conversationHistory.length > 10) {
                this.conversationHistory = this.conversationHistory.slice(-10);
            }
            
            this.hideTypingIndicator();
            this.addMessage(response, 'ai');
            
        } catch (error) {
            console.error('Chat error:', error);
            this.hideTypingIndicator();
            
            // Show appropriate error message based on user's language
            const errorMessage = this.getErrorMessage(error);
            this.addMessage(errorMessage, 'ai');
        }
    }
    
    async getAIResponse(message) {
        // First try to get GPT response
        try {
            const gptResponse = await this.getGPTResponse(message);
            return gptResponse;
        } catch (error) {
            console.warn('GPT failed, falling back to local response:', error);
            
            // Fall back to local response system
            return this.getLocalResponse(message);
        }
    }
    
    async getGPTResponse(message) {
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
                conversationHistory: this.conversationHistory.slice(-6),
                userLanguage: this.userDetectedLanguage
            }),
            signal: AbortSignal.timeout(30000)
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || 'API request failed');
        }
        
        return data.response;
    }
    
    getLocalResponse(message) {
        // Enhanced local response system with language support
        const lang = this.userDetectedLanguage;
        const fallbackResponses = this.config.chatbot.fallbackResponses[lang] || 
                                 this.config.chatbot.fallbackResponses.ja;
        
        // Check for specific keywords and provide appropriate responses
        const lowerMessage = message.toLowerCase();
        
        // Sake-related keywords
        if (this.containsKeywords(lowerMessage, ['sake', '日本酒', '酒', 'sake', 'nihonshu'])) {
            return this.getSakeResponse(lang);
        }
        
        // Theme park keywords
        if (this.containsKeywords(lowerMessage, ['theme park', 'テーマパーク', 'park', 'experience', '体験'])) {
            return this.getThemeParkResponse(lang);
        }
        
        // Location/access keywords
        if (this.containsKeywords(lowerMessage, ['location', 'access', 'address', '場所', '住所', 'アクセス', 'where'])) {
            return this.getLocationResponse(lang);
        }
        
        // Hours keywords
        if (this.containsKeywords(lowerMessage, ['hours', 'time', 'open', 'close', '営業時間', '時間', '開店', '閉店'])) {
            return this.getHoursResponse(lang);
        }
        
        // Reservation keywords
        if (this.containsKeywords(lowerMessage, ['reservation', 'book', 'reserve', '予約', '予約方法', 'booking'])) {
            return this.getReservationResponse(lang);
        }
        
        // Default response
        return fallbackResponses.noMatch;
    }
    
    containsKeywords(text, keywords) {
        return keywords.some(keyword => text.includes(keyword.toLowerCase()));
    }
    
    getSakeResponse(lang) {
        const responses = {
            ja: `🍶 yodobloom SAKEでは、季節ごとに厳選された100種類の日本酒をご用意しております。\n\n全国の優秀な蔵元から選び抜かれた逸品を、認定唎酒師®がガイドいたします。お客様の好みに合わせて最適な日本酒をご提案いたします。\n\n詳しくは直接お問い合わせください：06-4802-1010 🌸`,
            en: `🍶 At yodobloom SAKE, we offer 100 carefully selected seasonal Japanese sakes.\n\nThese premium selections from excellent breweries across Japan are guided by certified sake sommeliers. We'll recommend the perfect sake based on your preferences.\n\nFor more details, please contact us: 06-4802-1010 🌸`,
            'zh-cn': `🍶 在yodobloom SAKE，我们提供100种精心挑选的季节性日本酒。\n\n这些来自日本全国优秀酒造的精品，由认证唎酒师®指导。我们会根据您的喜好推荐最适合的日本酒。\n\n详情请联系：06-4802-1010 🌸`
        };
        
        return responses[lang] || responses.ja;
    }
    
    getThemeParkResponse(lang) {
        const responses = {
            ja: `🏪 yodobloom SAKEは大阪・梅田にある日本酒テーマパークです。\n\n【特徴】\n• 季節ごとに厳選された100種類の日本酒\n• 認定唎酒師®による専門ガイド\n• 個人化された30分間の推薦体験\n• モバイルアプリでの予約システム\n\n日本酒の魅力を存分に味わえる特別な空間です！🌸`,
            en: `🏪 yodobloom SAKE is a Japanese sake theme park located in Osaka, Umeda.\n\n【Features】\n• 100 carefully selected seasonal Japanese sakes\n• Expert guidance by certified sake sommeliers\n• Personalized 30-minute recommendation experience\n• Mobile app reservation system\n\nA special space to fully enjoy the charm of Japanese sake! 🌸`,
            'zh-cn': `🏪 yodobloom SAKE是位于大阪・梅田的日本酒主题公园。\n\n【特色】\n• 100种精心挑选的季节性日本酒\n• 认证唎酒师®专业指导\n• 个人化的30分钟推荐体验\n• 手机应用预约系统\n\n充分享受日本酒魅力的特别空间！🌸`
        };
        
        return responses[lang] || responses.ja;
    }
    
    getLocationResponse(lang) {
        const responses = {
            ja: `📍 yodobloom SAKE所在地\n\n住所：大阪市北区大深町1-1 2階\n電話：06-4802-1010\n\n梅田駅から徒歩圏内でアクセス抜群です！🚃`,
            en: `📍 yodobloom SAKE Location\n\nAddress: 2F, 1-1 Ofuka-cho, Kita-ku, Osaka\nPhone: 06-4802-1010\n\nExcellent access within walking distance from Umeda Station! 🚃`,
            'zh-cn': `📍 yodobloom SAKE位置\n\n地址：大阪市北区大深町1-1 2楼\n电话：06-4802-1010\n\n从梅田站步行即可到达，交通便利！🚃`
        };
        
        return responses[lang] || responses.ja;
    }
    
    getHoursResponse(lang) {
        const responses = {
            ja: `🕐 yodobloom SAKE営業時間\n\n平日：12:00-22:00\n土日祝日：10:00-22:00\n※最終入場は21:00まで\n\n詳細はお電話でご確認ください：06-4802-1010 🌸`,
            en: `🕐 yodobloom SAKE Hours\n\nWeekdays: 12:00-22:00\nWeekends/Holidays: 10:00-22:00\n*Last entry at 21:00\n\nFor details, please call: 06-4802-1010 🌸`,
            'zh-cn': `🕐 yodobloom SAKE营业时间\n\n平日：12:00-22:00\n周末/节假日：10:00-22:00\n*最终入场时间21:00\n\n详情请致电：06-4802-1010 🌸`
        };
        
        return responses[lang] || responses.ja;
    }
    
    getReservationResponse(lang) {
        const responses = {
            ja: `📱 yodobloom SAKE予約方法\n\n1. モバイルアプリからの予約\n2. お電話での予約：06-4802-1010\n3. 現地での当日受付（空席状況により）\n\n30分間の個人化された日本酒体験をお楽しみください！🍶`,
            en: `📱 yodobloom SAKE Reservation\n\n1. Mobile app reservation\n2. Phone reservation: 06-4802-1010\n3. Walk-in (subject to availability)\n\nEnjoy a personalized 30-minute Japanese sake experience! 🍶`,
            'zh-cn': `📱 yodobloom SAKE预约方法\n\n1. 手机应用预约\n2. 电话预约：06-4802-1010\n3. 现场当日接待（根据空位情况）\n\n享受30分钟个人化的日本酒体验！🍶`
        };
        
        return responses[lang] || responses.ja;
    }
    
    getErrorMessage(error) {
        const lang = this.userDetectedLanguage;
        const errorMessages = this.config.errorMessages[lang] || this.config.errorMessages.ja;
        
        if (error.message.includes('network') || error.message.includes('fetch')) {
            return errorMessages.network;
        } else if (error.message.includes('timeout')) {
            return errorMessages.timeout;
        } else {
            return errorMessages.general;
        }
    }
    
    handleQuickAction(action) {
        const lang = this.currentLanguage;
        
        const responses = {
            sake_lineup: () => this.getSakeResponse(lang),
            theme_park: () => this.getThemeParkResponse(lang),
            sommelier_guide: () => this.getSommelierResponse(lang),
            reservation: () => this.getReservationResponse(lang)
        };
        
        const response = responses[action] ? responses[action]() : this.getLocalResponse(action);
        this.addMessage(response, 'ai');
    }
    
    getSommelierResponse(lang) {
        const responses = {
            ja: `👨‍🍳 認定唎酒師®によるプロガイド\n\n当店の認定唎酒師®が、お客様の好みに合わせて最適な日本酒をご提案いたします。\n\n【サービス内容】\n• 個人の好みに合わせた推薦\n• 専門的なテイスティング指導\n• 日本酒の歴史・文化の説明\n• 料理とのペアリングアドバイス\n\n日本酒の奥深い世界をお楽しみください！🍶`,
            en: `👨‍🍳 Certified Sake Sommelier Guide\n\nOur certified sake sommeliers will recommend the perfect Japanese sake based on your preferences.\n\n【Services】\n• Personalized recommendations\n• Professional tasting guidance\n• Explanation of sake history & culture\n• Food pairing advice\n\nEnjoy the deep world of Japanese sake! 🍶`,
            'zh-cn': `👨‍🍳 认证唎酒师®专业指导\n\n我们的认证唎酒师®将根据您的喜好推荐最适合的日本酒。\n\n【服务内容】\n• 个人化推荐\n• 专业品酒指导\n• 日本酒历史・文化解说\n• 料理搭配建议\n\n享受日本酒的深奥世界！🍶`
        };
        
        return responses[lang] || responses.ja;
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
        
        if (type === 'user') {
            messageDiv.innerHTML = `
                <div class="message-bubble user-bubble">
                    <div class="message-content">${this.formatMessage(message)}</div>
                    <div class="message-time">${currentTime}</div>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="avatar-mini">
                    <img src="ai-sakura-icon.png" alt="AIさくら">
                </div>
                <div class="message-bubble ai-bubble">
                    <div class="message-content">${this.formatMessage(message)}</div>
                    <div class="message-time">${currentTime}</div>
                </div>
            `;
        }
        
        this.chatMessages?.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    formatMessage(message) {
        return message.replace(/\n/g, '<br>');
    }
    
    scrollToBottom() {
        if (this.chatMessages) {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }
    }
}

// Initialize the improved chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        if (typeof window.aiConfig !== 'undefined') {
            window.improvedChatbot = new ImprovedChatbot();
            console.log('✅ Improved chatbot initialized successfully');
        } else {
            console.error('❌ AI configuration not found');
        }
    } catch (error) {
        console.error('❌ Failed to initialize improved chatbot:', error);
    }
});