// Premium Google Translate Implementation for yodobloom SAKE
// 最高レベルの多言語対応システム

class PremiumTranslate {
    constructor() {
        this.currentLanguage = 'ja';
        this.isTranslating = false;
        this.supportedLanguages = {
            // アジア圏言語（必須）
            'ja': { name: '日本語', flag: '🇯🇵', region: 'asia' },
            'zh-cn': { name: '简体中文', flag: '🇨🇳', region: 'asia' },
            'zh-tw': { name: '繁體中文', flag: '🇹🇼', region: 'asia' },
            'ko': { name: '한국어', flag: '🇰🇷', region: 'asia' },
            'th': { name: 'ไทย', flag: '🇹🇭', region: 'asia' },
            'vi': { name: 'Tiếng Việt', flag: '🇻🇳', region: 'asia' },
            'id': { name: 'Bahasa Indonesia', flag: '🇮🇩', region: 'asia' },
            'ms': { name: 'Bahasa Melayu', flag: '🇲🇾', region: 'asia' },
            'tl': { name: 'Filipino', flag: '🇵🇭', region: 'asia' },
            
            // 欧米言語（必須）
            'en': { name: 'English', flag: '🇺🇸', region: 'western' },
            'fr': { name: 'Français', flag: '🇫🇷', region: 'western' },
            'es': { name: 'Español', flag: '🇪🇸', region: 'western' },
            'de': { name: 'Deutsch', flag: '🇩🇪', region: 'western' },
            'it': { name: 'Italiano', flag: '🇮🇹', region: 'western' },
            'pt': { name: 'Português', flag: '🇵🇹', region: 'western' },
            'ru': { name: 'Русский', flag: '🇷🇺', region: 'western' },
            'ar': { name: 'العربية', flag: '🇸🇦', region: 'western' }
        };
        
        this.init();
    }
    
    init() {
        this.createTranslateUI();
        this.bindEvents();
        this.setupGoogleTranslate();
        this.loadUserPreference();
        this.setupLanguageDetection();
    }
    
    createTranslateUI() {
        // Create floating language selector
        const translateContainer = document.createElement('div');
        translateContainer.id = 'premiumTranslateContainer';
        translateContainer.className = 'premium-translate-container';
        
        translateContainer.innerHTML = `
            <div class="language-selector-premium">
                <button class="language-toggle-btn" id="languageToggleBtn">
                    <span class="current-flag" id="currentFlag">🇯🇵</span>
                    <span class="current-lang" id="currentLang">日本語</span>
                    <span class="dropdown-arrow">▼</span>
                </button>
                
                <div class="language-dropdown-premium" id="languageDropdownPremium">
                    <div class="language-search">
                        <input type="text" placeholder="言語を検索..." id="languageSearch">
                        <span class="search-icon">🔍</span>
                    </div>
                    
                    <div class="language-sections">
                        <div class="language-section">
                            <h4>🌏 アジア圏</h4>
                            <div class="language-grid" id="asiaLanguages"></div>
                        </div>
                        
                        <div class="language-section">
                            <h4>🌍 欧米圏</h4>
                            <div class="language-grid" id="westernLanguages"></div>
                        </div>
                    </div>
                    
                    <div class="translate-footer">
                        <span class="powered-by">Powered by Google Translate</span>
                        <button class="reset-btn" id="resetTranslation">原文に戻す</button>
                    </div>
                </div>
            </div>
            
            <div class="translation-status" id="translationStatus">
                <div class="status-content">
                    <span class="status-icon">🔄</span>
                    <span class="status-text">翻訳中...</span>
                </div>
            </div>
            
            <!-- Hidden Google Translate Element -->
            <div id="google_translate_element" style="display: none;"></div>
        `;
        
        document.body.appendChild(translateContainer);
        this.populateLanguageOptions();
    }
    
    populateLanguageOptions() {
        const asiaContainer = document.getElementById('asiaLanguages');
        const westernContainer = document.getElementById('westernLanguages');
        
        Object.entries(this.supportedLanguages).forEach(([code, lang]) => {
            const langBtn = document.createElement('button');
            langBtn.className = 'language-option-premium';
            langBtn.setAttribute('data-lang', code);
            langBtn.innerHTML = `
                <span class="lang-flag">${lang.flag}</span>
                <span class="lang-name">${lang.name}</span>
            `;
            
            if (lang.region === 'asia') {
                asiaContainer.appendChild(langBtn);
            } else {
                westernContainer.appendChild(langBtn);
            }
        });
    }
    
    bindEvents() {
        // Toggle dropdown
        document.getElementById('languageToggleBtn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown();
        });
        
        // Language selection
        document.addEventListener('click', (e) => {
            if (e.target.closest('.language-option-premium')) {
                const langCode = e.target.closest('.language-option-premium').getAttribute('data-lang');
                this.translateTo(langCode);
                this.closeDropdown();
            }
        });
        
        // Search functionality
        document.getElementById('languageSearch')?.addEventListener('input', (e) => {
            this.filterLanguages(e.target.value);
        });
        
        // Reset translation
        document.getElementById('resetTranslation')?.addEventListener('click', () => {
            this.resetTranslation();
            this.closeDropdown();
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.language-selector-premium')) {
                this.closeDropdown();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Alt + L to open language selector
            if (e.altKey && e.key === 'l') {
                e.preventDefault();
                this.toggleDropdown();
            }
            
            // Escape to close dropdown
            if (e.key === 'Escape') {
                this.closeDropdown();
            }
        });
    }
    
    setupGoogleTranslate() {
        // Enhanced Google Translate setup
        if (!window.googleTranslateElementInit) {
            window.googleTranslateElementInit = () => {
                this.googleTranslateInstance = new google.translate.TranslateElement({
                    pageLanguage: 'ja',
                    includedLanguages: Object.keys(this.supportedLanguages).join(','),
                    layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                    autoDisplay: false,
                    multilanguagePage: true
                }, 'google_translate_element');
                
                this.setupTranslateObserver();
            };
            
            // Load Google Translate script if not already loaded
            if (!document.querySelector('script[src*="translate.google.com"]')) {
                const script = document.createElement('script');
                script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
                script.async = true;
                document.head.appendChild(script);
            }
        }
    }
    
    setupTranslateObserver() {
        // Monitor for translation changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    // Check if translation is active
                    const translateFrame = document.querySelector('iframe.goog-te-banner-frame');
                    if (translateFrame) {
                        this.onTranslationActive();
                    } else {
                        this.onTranslationInactive();
                    }
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }
    
    setupLanguageDetection() {
        // Detect user's preferred language
        const userLang = navigator.language || navigator.userLanguage;
        const detectedLang = this.detectLanguageCode(userLang);
        
        if (detectedLang && detectedLang !== 'ja') {
            this.suggestTranslation(detectedLang);
        }
    }
    
    detectLanguageCode(browserLang) {
        const langMap = {
            'en': 'en', 'en-US': 'en', 'en-GB': 'en',
            'zh': 'zh-cn', 'zh-CN': 'zh-cn', 'zh-TW': 'zh-tw',
            'ko': 'ko', 'ko-KR': 'ko',
            'th': 'th', 'th-TH': 'th',
            'vi': 'vi', 'vi-VN': 'vi',
            'id': 'id', 'id-ID': 'id',
            'ms': 'ms', 'ms-MY': 'ms',
            'tl': 'tl', 'fil': 'tl',
            'fr': 'fr', 'fr-FR': 'fr',
            'es': 'es', 'es-ES': 'es',
            'de': 'de', 'de-DE': 'de',
            'it': 'it', 'it-IT': 'it',
            'pt': 'pt', 'pt-BR': 'pt', 'pt-PT': 'pt',
            'ru': 'ru', 'ru-RU': 'ru',
            'ar': 'ar', 'ar-SA': 'ar'
        };
        
        return langMap[browserLang] || langMap[browserLang.split('-')[0]];
    }
    
    suggestTranslation(langCode) {
        if (!this.supportedLanguages[langCode]) return;
        
        const suggestion = document.createElement('div');
        suggestion.className = 'translation-suggestion';
        suggestion.innerHTML = `
            <div class="suggestion-content">
                <span class="suggestion-icon">🌍</span>
                <span class="suggestion-text">
                    ${this.supportedLanguages[langCode].flag} 
                    ${this.supportedLanguages[langCode].name}で表示しますか？
                </span>
                <div class="suggestion-actions">
                    <button class="suggestion-yes" data-lang="${langCode}">はい</button>
                    <button class="suggestion-no">いいえ</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(suggestion);
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            suggestion?.remove();
        }, 10000);
        
        // Bind events
        suggestion.querySelector('.suggestion-yes')?.addEventListener('click', () => {
            this.translateTo(langCode);
            suggestion.remove();
        });
        
        suggestion.querySelector('.suggestion-no')?.addEventListener('click', () => {
            suggestion.remove();
        });
    }
    
    toggleDropdown() {
        const dropdown = document.getElementById('languageDropdownPremium');
        if (dropdown) {
            dropdown.classList.toggle('active');
            
            if (dropdown.classList.contains('active')) {
                document.getElementById('languageSearch')?.focus();
            }
        }
    }
    
    closeDropdown() {
        const dropdown = document.getElementById('languageDropdownPremium');
        dropdown?.classList.remove('active');
    }
    
    filterLanguages(searchTerm) {
        const options = document.querySelectorAll('.language-option-premium');
        const term = searchTerm.toLowerCase();
        
        options.forEach(option => {
            const langName = option.querySelector('.lang-name').textContent.toLowerCase();
            const isVisible = langName.includes(term) || term === '';
            option.style.display = isVisible ? 'flex' : 'none';
        });
    }
    
    translateTo(langCode) {
        if (this.isTranslating || langCode === this.currentLanguage) return;
        
        this.isTranslating = true;
        this.showTranslationStatus(true);
        
        // Update current language display
        this.updateCurrentLanguageDisplay(langCode);
        
        // Trigger Google Translate
        this.triggerGoogleTranslate(langCode);
        
        // Save user preference
        this.saveUserPreference(langCode);
        
        this.currentLanguage = langCode;
    }
    
    triggerGoogleTranslate(langCode) {
        try {
            // Get Google Translate select element
            const select = document.querySelector('.goog-te-combo');
            if (select) {
                select.value = langCode;
                select.dispatchEvent(new Event('change'));
                
                // Monitor translation completion
                this.monitorTranslationProgress();
            } else {
                // Fallback: reload page with language parameter
                setTimeout(() => {
                    window.location.href = window.location.href.split('#')[0] + `#googtrans(ja|${langCode})`;
                    window.location.reload();
                }, 100);
            }
        } catch (error) {
            console.error('Translation error:', error);
            this.showTranslationError();
        }
    }
    
    monitorTranslationProgress() {
        let attempts = 0;
        const maxAttempts = 50;
        
        const checkProgress = () => {
            attempts++;
            
            // Check if translation is complete
            const translatedElements = document.querySelectorAll('[class*="translated"]');
            const hasTranslatedContent = translatedElements.length > 0;
            
            if (hasTranslatedContent || attempts >= maxAttempts) {
                setTimeout(() => {
                    this.onTranslationComplete();
                }, 1000);
            } else {
                setTimeout(checkProgress, 200);
            }
        };
        
        setTimeout(checkProgress, 500);
    }
    
    onTranslationComplete() {
        this.isTranslating = false;
        this.showTranslationStatus(false);
        
        // Trigger custom event
        window.dispatchEvent(new CustomEvent('translationComplete', {
            detail: { language: this.currentLanguage }
        }));
        
        // Update chatbot language if available
        if (window.premiumChatbot) {
            window.premiumChatbot.currentLanguage = this.currentLanguage;
            window.premiumChatbot.updateQuickActions();
        }
    }
    
    onTranslationActive() {
        document.body.classList.add('translation-active');
    }
    
    onTranslationInactive() {
        document.body.classList.remove('translation-active');
    }
    
    resetTranslation() {
        this.translateTo('ja');
        
        // Remove translation parameters from URL
        if (window.location.hash.includes('googtrans')) {
            window.location.hash = '';
        }
    }
    
    updateCurrentLanguageDisplay(langCode) {
        const lang = this.supportedLanguages[langCode];
        if (!lang) return;
        
        const flagElement = document.getElementById('currentFlag');
        const langElement = document.getElementById('currentLang');
        
        if (flagElement) flagElement.textContent = lang.flag;
        if (langElement) langElement.textContent = lang.name;
        
        // Update page title
        document.title = document.title.replace(/\| .+$/, `| ${lang.name}`);
    }
    
    showTranslationStatus(show) {
        const status = document.getElementById('translationStatus');
        if (status) {
            if (show) {
                status.classList.add('active');
            } else {
                status.classList.remove('active');
            }
        }
    }
    
    showTranslationError() {
        this.isTranslating = false;
        this.showTranslationStatus(false);
        
        const errorMsg = document.createElement('div');
        errorMsg.className = 'translation-error';
        errorMsg.innerHTML = `
            <div class="error-content">
                <span class="error-icon">⚠️</span>
                <span class="error-text">翻訳に失敗しました。再度お試しください。</span>
            </div>
        `;
        
        document.body.appendChild(errorMsg);
        
        setTimeout(() => {
            errorMsg?.remove();
        }, 5000);
    }
    
    saveUserPreference(langCode) {
        try {
            localStorage.setItem('yodobloom_preferred_language', langCode);
        } catch (error) {
            console.warn('Could not save language preference:', error);
        }
    }
    
    loadUserPreference() {
        try {
            const savedLang = localStorage.getItem('yodobloom_preferred_language');
            if (savedLang && savedLang !== 'ja' && this.supportedLanguages[savedLang]) {
                setTimeout(() => {
                    this.translateTo(savedLang);
                }, 1000);
            }
        } catch (error) {
            console.warn('Could not load language preference:', error);
        }
    }
    
    // Public API methods
    getCurrentLanguage() {
        return this.currentLanguage;
    }
    
    getSupportedLanguages() {
        return this.supportedLanguages;
    }
    
    isTranslationActive() {
        return this.currentLanguage !== 'ja';
    }
}

// Initialize premium translate when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.premiumTranslate = new PremiumTranslate();
        console.log('✅ Premium Translate initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize Premium Translate:', error);
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PremiumTranslate;
}