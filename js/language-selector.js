// Custom Language Selector for yodobloom SAKE
// カスタム言語セレクター

class LanguageSelector {
    constructor() {
        this.currentLanguage = 'ja';
        this.languages = {
            'ja': { name: '日本語', flag: '🇯🇵' },
            'en': { name: 'English', flag: '🇺🇸' },
            'zh-cn': { name: '简体中文', flag: '🇨🇳' },
            'zh-tw': { name: '繁體中文', flag: '🇹🇼' },
            'fr': { name: 'Français', flag: '🇫🇷' },
            'ko': { name: '한국어', flag: '🇰🇷' },
            'es': { name: 'Español', flag: '🇪🇸' },
            'de': { name: 'Deutsch', flag: '🇩🇪' }
        };
        
        this.init();
    }
    
    init() {
        this.languageSelector = document.getElementById('languageSelector');
        this.languageBtn = document.getElementById('languageBtn');
        this.languageDropdown = document.getElementById('languageDropdown');
        this.languageText = this.languageBtn?.querySelector('.language-text');
        
        if (!this.languageSelector || !this.languageBtn || !this.languageDropdown) {
            console.warn('Language selector elements not found');
            return;
        }
        
        this.bindEvents();
        this.detectCurrentLanguage();
        
        console.log('Language selector initialized');
    }
    
    bindEvents() {
        // 言語ボタンクリック
        this.languageBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleDropdown();
        });
        
        // 言語オプションクリック
        this.languageDropdown.addEventListener('click', (e) => {
            const option = e.target.closest('.language-option');
            if (option) {
                e.preventDefault();
                const langCode = option.getAttribute('data-lang');
                this.changeLanguage(langCode);
                this.closeDropdown();
            }
        });
        
        // 外部クリックで閉じる
        document.addEventListener('click', (e) => {
            if (!this.languageSelector.contains(e.target)) {
                this.closeDropdown();
            }
        });
        
        // ESCキーで閉じる
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeDropdown();
            }
        });
    }
    
    toggleDropdown() {
        this.languageSelector.classList.toggle('active');
    }
    
    closeDropdown() {
        this.languageSelector.classList.remove('active');
    }
    
    changeLanguage(langCode) {
        if (!this.languages[langCode]) {
            console.warn(`Language ${langCode} not supported`);
            return;
        }
        
        console.log(`Changing language to: ${langCode}`);
        
        // UI更新
        this.currentLanguage = langCode;
        this.updateUI(langCode);
        
        // Google Translateを使用
        this.triggerGoogleTranslate(langCode);
        
        // チャットボットに言語変更を通知
        if (window.modernChatbot) {
            window.modernChatbot.setLanguage(langCode);
        }
        
        // 選択状態更新
        this.updateSelectedOption(langCode);
    }
    
    updateUI(langCode) {
        const language = this.languages[langCode];
        if (this.languageText) {
            this.languageText.textContent = language.name;
        }
    }
    
    updateSelectedOption(langCode) {
        // 全ての選択を解除
        this.languageDropdown.querySelectorAll('.language-option').forEach(option => {
            option.classList.remove('active');
        });
        
        // 選択された言語をアクティブに
        const selectedOption = this.languageDropdown.querySelector(`[data-lang="${langCode}"]`);
        if (selectedOption) {
            selectedOption.classList.add('active');
        }
    }
    
    triggerGoogleTranslate(langCode) {
        // Google Translateが読み込まれるまで待機
        const waitForGoogleTranslate = () => {
            if (typeof google !== 'undefined' && google.translate) {
                this.executeGoogleTranslate(langCode);
            } else {
                setTimeout(waitForGoogleTranslate, 100);
            }
        };
        
        waitForGoogleTranslate();
    }
    
    executeGoogleTranslate(langCode) {
        try {
            // Google Translateのセレクトボックスを探す
            const translateFrame = document.querySelector('.goog-te-banner-frame');
            if (translateFrame) {
                const selectElement = translateFrame.contentDocument?.querySelector('select.goog-te-combo');
                if (selectElement) {
                    selectElement.value = langCode;
                    selectElement.dispatchEvent(new Event('change'));
                    console.log(`Google Translate triggered for: ${langCode}`);
                    return;
                }
            }
            
            // フレームが見つからない場合は直接要素を探す
            const selectElement = document.querySelector('select.goog-te-combo');
            if (selectElement) {
                selectElement.value = langCode;
                selectElement.dispatchEvent(new Event('change'));
                console.log(`Google Translate triggered for: ${langCode}`);
            } else {
                console.warn('Google Translate select element not found');
                
                // フォールバック: URLベースの翻訳
                if (langCode !== 'ja') {
                    this.fallbackTranslate(langCode);
                }
            }
        } catch (error) {
            console.error('Error triggering Google Translate:', error);
            // フォールバック翻訳
            if (langCode !== 'ja') {
                this.fallbackTranslate(langCode);
            }
        }
    }
    
    fallbackTranslate(langCode) {
        // Google Translateが使えない場合のフォールバック
        const currentUrl = window.location.href.split('#')[0];
        const translateUrl = `https://translate.google.com/translate?sl=ja&tl=${langCode}&u=${encodeURIComponent(currentUrl)}`;
        
        // 新しいタブで翻訳版を開く
        const userConfirm = confirm(`Google翻訳で${this.languages[langCode].name}に翻訳しますか？\\n（新しいタブで開きます）`);
        if (userConfirm) {
            window.open(translateUrl, '_blank');
        }
    }
    
    detectCurrentLanguage() {
        // URLパラメータから言語検出
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        
        if (urlLang && this.languages[urlLang]) {
            this.changeLanguage(urlLang);
            return;
        }
        
        // ブラウザの言語設定から検出
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0];
        
        if (this.languages[langCode] && langCode !== 'ja') {
            // 自動翻訳の確認
            setTimeout(() => {
                const autoTranslate = confirm(`Automatically translate to ${this.languages[langCode].name}?\\n${this.languages[langCode].name}に自動翻訳しますか？`);
                if (autoTranslate) {
                    this.changeLanguage(langCode);
                }
            }, 2000);
        }
    }
    
    getCurrentLanguage() {
        return this.currentLanguage;
    }
}

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    window.languageSelector = new LanguageSelector();
});