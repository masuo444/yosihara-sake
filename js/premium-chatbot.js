// Premium Chatbot with Advanced UI/UX - 最高レベルのチャットボット体験

// Enhanced language detection utility with DeepL integration
async function detectLanguage(text, deeplService = null) {
    // Primary pattern-based detection
    const japanesePattern = /[ひらがなカタカナ漢字]/;
    const chinesePattern = /[一-龯]/;
    const koreanPattern = /[ㄱ-ㅎㅏ-ㅣ가-힣]/;
    const thaiPattern = /[ก-๙]/;
    const vietnamesePattern = /[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđĐ]/;
    
    if (japanesePattern.test(text)) {
        return 'ja';
    } else if (chinesePattern.test(text)) {
        return 'zh-cn';
    } else if (koreanPattern.test(text)) {
        return 'ko';
    } else if (thaiPattern.test(text)) {
        return 'th';
    } else if (vietnamesePattern.test(text)) {
        return 'vi';
    }
    
    // Use DeepL for more accurate detection if available
    if (deeplService && deeplService.isConfigured()) {
        try {
            const detection = await deeplService.detectLanguage(text);
            if (detection.success && detection.confidence > 0.8) {
                return detection.language;
            }
        } catch (error) {
            console.warn('DeepL language detection failed:', error);
        }
    }
    
    return 'en';
}

// Premium chatbot class with advanced features
class PremiumChatbot {
    constructor() {
        this.config = window.aiConfig;
        this.companyManager = window.companyManager;
        this.isOpen = false;
        this.isMinimized = false;
        this.isTyping = false;
        this.conversationHistory = [];
        this.currentLanguage = 'ja';
        this.userDetectedLanguage = 'ja';
        this.autoScrollEnabled = true;
        this.unreadMessages = 0;
        this.messageQueue = [];
        this.isProcessingQueue = false;
        
        // Initialize API services - Netlify優先でフォールバック対応
        if (window.NetlifyAPIService) {
            this.apiService = new window.NetlifyAPIService();
            this.useNetlify = true;
        } else {
            this.openaiService = new window.OpenAIService();
            this.deeplService = new window.DeepLService();
            this.useNetlify = false;
        }
        
        this.initializeElements();
        this.bindEvents();
        this.setupQuickActions();
        this.initializeScrollFeatures();
        this.initializeAdvancedFeatures();
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
        
        // Create scroll to bottom button
        this.createScrollToBottomButton();
        
        if (!this.chatButton || !this.chatInterface || !this.chatMessages || !this.messageInput || !this.sendButton) {
            throw new Error('Required chat elements not found');
        }
    }
    
    createScrollToBottomButton() {
        // Create scroll to bottom button
        this.scrollToBottomBtn = document.createElement('button');
        this.scrollToBottomBtn.className = 'scroll-to-bottom';
        this.scrollToBottomBtn.innerHTML = '↓';
        this.scrollToBottomBtn.title = 'Scroll to bottom';
        
        // Add to chat messages container
        if (this.chatMessages) {
            this.chatMessages.style.position = 'relative';
            this.chatMessages.appendChild(this.scrollToBottomBtn);
        }
    }
    
    initializeScrollFeatures() {
        if (!this.chatMessages) return;
        
        // Scroll event listener for auto-hide scroll button
        this.chatMessages.addEventListener('scroll', () => {
            this.handleScroll();
        });
        
        // Scroll to bottom button click
        if (this.scrollToBottomBtn) {
            this.scrollToBottomBtn.addEventListener('click', () => {
                this.scrollToBottom(true);
            });
        }
        
        // Intersection Observer for message visibility
        this.setupMessageVisibilityObserver();
    }
    
    initializeAdvancedFeatures() {
        // Auto-resize textarea
        this.setupAutoResizeTextarea();
        
        // Keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        // Message status indicators
        this.setupMessageStatusIndicators();
        
        // Typing sound effects (optional)
        this.setupSoundEffects();
        
        // Connection status monitoring
        this.setupConnectionMonitoring();
    }
    
    setupAutoResizeTextarea() {
        if (!this.messageInput) return;
        
        this.messageInput.addEventListener('input', () => {
            // Reset height to auto to get the correct scrollHeight
            this.messageInput.style.height = 'auto';
            
            // Set height based on content, with min and max limits
            const minHeight = 20;
            const maxHeight = 100;
            const scrollHeight = this.messageInput.scrollHeight;
            
            if (scrollHeight > maxHeight) {
                this.messageInput.style.height = maxHeight + 'px';
                this.messageInput.style.overflowY = 'auto';
            } else if (scrollHeight < minHeight) {
                this.messageInput.style.height = minHeight + 'px';
                this.messageInput.style.overflowY = 'hidden';
            } else {
                this.messageInput.style.height = scrollHeight + 'px';
                this.messageInput.style.overflowY = 'hidden';
            }
        });
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K to open chat
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                if (!this.isOpen) {
                    this.openChat();
                }
                this.messageInput?.focus();
            }
            
            // Escape to close chat
            if (e.key === 'Escape' && this.isOpen) {
                this.closeChat();
            }
        });
        
        // Input-specific shortcuts
        if (this.messageInput) {
            this.messageInput.addEventListener('keydown', (e) => {
                // Shift + Enter for new line, Enter to send
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
                
                // Ctrl/Cmd + A to select all in input
                if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
                    e.stopPropagation();
                }
            });
        }
    }
    
    setupMessageStatusIndicators() {
        // Create message status system
        this.messageStatusTypes = {
            sending: '⏳',
            sent: '✓',
            delivered: '✓✓',
            error: '❌'
        };
    }
    
    setupSoundEffects() {
        // Optional: Add subtle sound effects
        this.sounds = {
            send: this.createSound(800, 100, 'triangle'),
            receive: this.createSound(600, 150, 'sine'),
            error: this.createSound(300, 200, 'square')
        };
    }
    
    createSound(frequency, duration, type = 'sine') {
        return () => {
            if (!window.AudioContext && !window.webkitAudioContext) return;
            
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = type;
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration / 1000);
        };
    }
    
    setupConnectionMonitoring() {
        // Monitor online/offline status
        window.addEventListener('online', () => {
            this.updateConnectionStatus(true);
        });
        
        window.addEventListener('offline', () => {
            this.updateConnectionStatus(false);
        });
    }
    
    updateConnectionStatus(isOnline) {
        const statusIndicator = document.querySelector('.status-indicator');
        if (statusIndicator) {
            statusIndicator.style.background = isOnline ? '#22c55e' : '#ef4444';
        }
        
        const statusText = document.querySelector('.status-text');
        if (statusText) {
            statusText.textContent = isOnline ? 'オンライン • yodobloom SAKE' : 'オフライン • 接続を確認中...';
        }
    }
    
    setupMessageVisibilityObserver() {
        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Mark message as read
                    entry.target.classList.add('message-read');
                }
            });
        }, {
            root: this.chatMessages,
            threshold: 0.5
        });
    }
    
    handleScroll() {
        if (!this.chatMessages || !this.scrollToBottomBtn) return;
        
        const { scrollTop, scrollHeight, clientHeight } = this.chatMessages;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
        
        // Show/hide scroll to bottom button
        if (isAtBottom) {
            this.scrollToBottomBtn.classList.remove('visible');
            this.autoScrollEnabled = true;
        } else {
            this.scrollToBottomBtn.classList.add('visible');
            this.autoScrollEnabled = false;
        }
    }
    
    bindEvents() {
        this.chatButton?.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleChat();
            this.playSound('send');
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
        
        // Enhanced input events
        this.messageInput?.addEventListener('focus', () => {
            this.messageInput.parentElement?.classList.add('focused');
        });
        
        this.messageInput?.addEventListener('blur', () => {
            this.messageInput.parentElement?.classList.remove('focused');
        });
        
        // Real-time character count and validation
        this.messageInput?.addEventListener('input', () => {
            this.updateInputValidation();
        });
        
        this.quickBtns?.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const action = btn.getAttribute('data-action');
                this.handleQuickAction(action);
                this.addRippleEffect(btn, e);
            });
        });
    }
    
    updateInputValidation() {
        if (!this.messageInput) return;
        
        const text = this.messageInput.value;
        const maxLength = 1000;
        
        // Update send button state
        if (this.sendButton) {
            this.sendButton.disabled = !text.trim() || text.length > maxLength;
        }
        
        // Update character counter (if exists)
        const counter = document.querySelector('.char-counter');
        if (counter) {
            counter.textContent = `${text.length}/${maxLength}`;
            counter.style.color = text.length > maxLength ? '#ef4444' : '#6b7280';
        }
    }
    
    addRippleEffect(element, event) {
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
    
    setupQuickActions() {
        this.updateQuickActions();
    }
    
    updateQuickActions() {
        const quickActionsContainer = document.querySelector('.quick-actions');
        if (!quickActionsContainer) return;
        
        const actions = this.config.quickActions[this.currentLanguage] || this.config.quickActions.ja;
        
        quickActionsContainer.innerHTML = '';
        actions.forEach((action, index) => {
            const button = document.createElement('button');
            button.className = 'quick-btn';
            button.setAttribute('data-action', action.action);
            button.textContent = action.text;
            button.style.animationDelay = `${index * 100}ms`;
            
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleQuickAction(action.action);
                this.addRippleEffect(button, e);
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
        this.unreadMessages = 0;
        
        if (this.chatInterface) {
            this.chatInterface.style.display = 'flex';
            
            // Trigger animation
            requestAnimationFrame(() => {
                this.chatInterface.classList.add('open');
                this.chatInterface.classList.remove('minimized');
            });
            
            // Focus input after animation
            setTimeout(() => {
                this.messageInput?.focus();
                this.scrollToBottom(true);
            }, 400);
        }
        
        if (this.chatButton) {
            this.chatButton.classList.add('active');
        }
        
        // Update notification dot
        this.updateNotificationDot();
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
            }, 400);
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
        
        // Play send sound
        this.playSound('send');
        
        // Detect user's language (enhanced detection)
        if (this.useNetlify) {
            this.userDetectedLanguage = await this.apiService.detectLanguage(message).then(result => result.language).catch(() => 'ja');
        } else {
            this.userDetectedLanguage = await detectLanguage(message, this.deeplService);
        }
        
        // Update UI language if different from current
        if (this.userDetectedLanguage !== this.currentLanguage) {
            this.currentLanguage = this.userDetectedLanguage;
            this.updateQuickActions();
        }
        
        // Add user message with status
        const messageId = this.addMessage(message, 'user');
        this.updateMessageStatus(messageId, 'sending');
        
        // Clear input
        this.messageInput.value = '';
        this.updateInputValidation();
        
        // Auto-resize input back to original size
        this.messageInput.style.height = '20px';
        
        // Add to conversation history
        this.conversationHistory.push({
            role: 'user',
            content: message
        });
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Update message status
            this.updateMessageStatus(messageId, 'sent');
            
            // Get AI response
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
            
            // Play receive sound
            this.playSound('receive');
            
            // Update message status
            this.updateMessageStatus(messageId, 'delivered');
            
        } catch (error) {
            console.error('Chat error:', error);
            this.hideTypingIndicator();
            
            // Play error sound
            this.playSound('error');
            
            // Update message status
            this.updateMessageStatus(messageId, 'error');
            
            // Show appropriate error message based on user's language
            const errorMessage = this.getErrorMessage(error);
            this.addMessage(errorMessage, 'ai');
        }
    }
    
    updateMessageStatus(messageId, status) {
        const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
        if (!messageElement) return;
        
        let statusElement = messageElement.querySelector('.message-status');
        if (!statusElement) {
            statusElement = document.createElement('span');
            statusElement.className = 'message-status';
            messageElement.querySelector('.message-time')?.appendChild(statusElement);
        }
        
        statusElement.textContent = this.messageStatusTypes[status] || '';
        statusElement.setAttribute('data-status', status);
    }
    
    playSound(type) {
        try {
            if (this.sounds && this.sounds[type]) {
                this.sounds[type]();
            }
        } catch (error) {
            // Silently fail if audio is not available
        }
    }
    
    updateNotificationDot() {
        const notificationDot = document.querySelector('.notification-dot');
        if (notificationDot) {
            notificationDot.style.display = this.unreadMessages > 0 && !this.isOpen ? 'block' : 'none';
        }
    }
    
    async getAIResponse(message) {
        // Try to get GPT response first
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
        try {
            if (this.useNetlify) {
                return await this.getNetlifyGPTResponse(message);
            } else {
                return await this.getDirectGPTResponse(message);
            }
        } catch (error) {
            console.error('GPT Response Error:', error);
            throw error;
        }
    }

    async getNetlifyGPTResponse(message) {
        try {
            let processedMessage = message;
            let targetResponseLanguage = this.userDetectedLanguage;
            
            // If user language is not Japanese, translate to Japanese for better context
            if (this.userDetectedLanguage !== 'ja') {
                const translationResult = await this.apiService.translateText(message, 'JA', this.userDetectedLanguage);
                if (translationResult.success) {
                    processedMessage = translationResult.translatedText;
                    console.log('Translated user input to Japanese:', processedMessage);
                }
            }
            
            // Get response from OpenAI via Netlify function
            const aiResult = await this.apiService.sendToOpenAI(processedMessage, this.config.chatbot.systemPrompt);
            
            if (!aiResult.success) {
                throw new Error(aiResult.error || 'OpenAI service failed');
            }
            
            let finalResponse = aiResult.message;
            
            // If user language is not Japanese, translate response back
            if (targetResponseLanguage !== 'ja') {
                const responseTranslation = await this.apiService.translateText(finalResponse, targetResponseLanguage.toUpperCase(), 'JA');
                if (responseTranslation.success) {
                    finalResponse = responseTranslation.translatedText;
                    console.log('Translated AI response to user language:', finalResponse);
                }
            }
            
            return finalResponse;
            
        } catch (error) {
            console.error('Netlify GPT Response Error:', error);
            throw error;
        }
    }

    async getDirectGPTResponse(message) {
        try {
            // Enhanced GPT response with translation support
            let processedMessage = message;
            let targetResponseLanguage = this.userDetectedLanguage;
            
            // If user language is not Japanese and DeepL is configured, translate to Japanese for better context
            if (this.userDetectedLanguage !== 'ja' && this.deeplService.isConfigured()) {
                const translationResult = await this.deeplService.translateText(message, 'JA', this.userDetectedLanguage);
                if (translationResult.success) {
                    processedMessage = translationResult.translatedText;
                    console.log('Translated user input to Japanese:', processedMessage);
                }
            }
            
            // Prepare conversation context
            const conversationMessages = [
                { role: 'system', content: this.config.chatbot.systemPrompt },
                ...this.conversationHistory.slice(-6),
                { role: 'user', content: processedMessage }
            ];
            
            // Get response from OpenAI using the service
            const aiResult = await this.openaiService.sendMessage(processedMessage, this.config.chatbot.systemPrompt);
            
            if (!aiResult.success) {
                throw new Error(aiResult.error || 'OpenAI service failed');
            }
            
            let finalResponse = aiResult.message;
            
            // If user language is not Japanese and we have a Japanese response, translate back
            if (targetResponseLanguage !== 'ja' && this.deeplService.isConfigured()) {
                const responseTranslation = await this.deeplService.translateText(finalResponse, targetResponseLanguage.toUpperCase(), 'JA');
                if (responseTranslation.success) {
                    finalResponse = responseTranslation.translatedText;
                    console.log('Translated AI response to user language:', finalResponse);
                }
            }
            
            return finalResponse;
            
        } catch (error) {
            console.error('Direct GPT Response Error:', error);
            throw error;
        }
    }
    
    getLocalResponse(message) {
        // Enhanced local response system with language support
        const lang = this.userDetectedLanguage;
        const fallbackResponses = this.config.chatbot.fallbackResponses[lang] || 
                                 this.config.chatbot.fallbackResponses.ja;
        
        // Check for specific keywords and provide appropriate responses
        const lowerMessage = message.toLowerCase();
        
        // Sake-related keywords
        if (this.containsKeywords(lowerMessage, ['sake', '日本酒', '酒', 'nihonshu'])) {
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
        const messageId = 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        const messageDiv = document.createElement('div');
        messageDiv.className = `message-container ${type}-message`;
        messageDiv.setAttribute('data-message-id', messageId);
        
        const currentTime = new Date().toLocaleTimeString('ja-JP', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        if (type === 'user') {
            messageDiv.innerHTML = `
                <div class="message-bubble user-bubble">
                    <div class="message-content">${this.formatMessage(message)}</div>
                    <div class="message-time">${currentTime} <span class="message-status"></span></div>
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
            
            // If chat is not open, increment unread messages
            if (!this.isOpen) {
                this.unreadMessages++;
                this.updateNotificationDot();
            }
        }
        
        this.chatMessages?.appendChild(messageDiv);
        
        // Observe message for read status
        if (this.intersectionObserver) {
            this.intersectionObserver.observe(messageDiv);
        }
        
        // Auto-scroll if enabled
        if (this.autoScrollEnabled) {
            this.scrollToBottom();
        }
        
        return messageId;
    }
    
    formatMessage(message) {
        return message.replace(/\n/g, '<br>');
    }
    
    scrollToBottom(force = false) {
        if (!this.chatMessages) return;
        
        if (force || this.autoScrollEnabled) {
            this.chatMessages.scrollTo({
                top: this.chatMessages.scrollHeight,
                behavior: 'smooth'
            });
        }
    }
}

// Add CSS animations dynamically
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes ripple {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    .message-container {
        animation-delay: var(--message-delay, 0ms);
    }
    
    .quick-btn {
        animation: slideInUp 0.5s ease-out forwards;
        opacity: 0;
        transform: translateY(20px);
    }
    
    @keyframes slideInUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .input-container.focused {
        transform: scale(1.02);
    }
    
    .message-status[data-status="sending"] {
        opacity: 0.6;
        animation: pulse 1s infinite;
    }
    
    .message-status[data-status="error"] {
        color: #ef4444;
    }
    
    .message-status[data-status="delivered"] {
        color: #22c55e;
    }
`;
document.head.appendChild(styleSheet);

// Initialize the premium chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        if (typeof window.aiConfig !== 'undefined') {
            window.premiumChatbot = new PremiumChatbot();
            console.log('✅ Premium chatbot initialized successfully');
        } else {
            console.error('❌ AI configuration not found');
        }
    } catch (error) {
        console.error('❌ Failed to initialize premium chatbot:', error);
    }
});