// Mobile Translation Fix for yodobloom SAKE - V2 (無限ローディング修正版)
// パフォーマンス最適化と安定性向上

class MobileTranslateFix {
    constructor() {
        // 初期化フラグで重複実行を防止
        if (window.mobileTranslateInstance) {
            console.warn('Mobile Translate already initialized');
            return window.mobileTranslateInstance;
        }
        
        this.isMobile = window.innerWidth <= 768;
        this.isInitialized = false;
        this.currentLanguage = 'ja';
        this.initTimeout = null;
        this.isDestroyed = false;
        
        // 簡略化された言語セット（パフォーマンス向上）
        this.supportedLanguages = {
            'ja': { name: '日本語', flag: '🇯🇵' },
            'en': { name: 'English', flag: '🇺🇸' },
            'zh-cn': { name: '中文', flag: '🇨🇳' },
            'ko': { name: '한국어', flag: '🇰🇷' },
            'fr': { name: 'Français', flag: '🇫🇷' }
        };
        
        // イベントハンドラーをバインド（メモリリーク防止）
        this.btnClickHandler = this.toggleDropdown.bind(this);
        this.closeBtnHandler = this.closeDropdown.bind(this);
        this.documentClickHandler = this.handleDocumentClick.bind(this);
        
        if (!this.isMobile) {
            console.log('⚠️ Not mobile device, skipping mobile translate');
            return;
        }
        
        // グローバル参照を設定
        window.mobileTranslateInstance = this;
        
        // 安全な初期化
        this.safeInit();
    }
    
    safeInit() {
        try {
            // タイムアウト設定（30秒で強制終了）
            this.initTimeout = setTimeout(() => {
                if (!this.isInitialized) {
                    console.error('❌ Mobile translate initialization timeout');
                    this.fallbackInit();
                }
            }, 30000);
            
            this.createSimpleMobileUI();
            this.setupLightweightGoogleTranslate();
            this.bindEvents();
            this.isInitialized = true;
            
            // タイムアウトをクリア
            if (this.initTimeout) {
                clearTimeout(this.initTimeout);
                this.initTimeout = null;
            }
            
            console.log('✅ Mobile Translate V2 initialized successfully');
        } catch (error) {
            console.error('❌ Mobile translate initialization failed:', error);
            this.fallbackInit();
        }
    }
    
    fallbackInit() {
        // 最小限のフォールバック
        this.createBasicUI();
        this.isInitialized = true;
        console.log('⚠️ Mobile translate running in fallback mode');
    }
    
    createSimpleMobileUI() {
        // 既存UIの削除（競合防止）
        this.removeExistingUI();
        
        // 軽量なモバイルUIを作成
        const mobileTranslateHTML = `
            <div class="mobile-translate-simple" id="mobileTranslateSimple">
                <button class="mobile-lang-btn" id="mobileLangBtn">
                    🌐 <span id="currentLangText">日本語</span>
                </button>
                <div class="mobile-lang-menu" id="mobileLangMenu">
                    ${Object.entries(this.supportedLanguages).map(([code, lang]) => `
                        <button class="mobile-lang-item" data-lang="${code}">
                            ${lang.flag} ${lang.name}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', mobileTranslateHTML);
        this.addSimpleStyles();
    }
    
    createBasicUI() {
        // 最低限のUI（フォールバック用）
        const basicHTML = `
            <div class="mobile-translate-basic">
                <button onclick="this.style.display='none'">🌐 翻訳</button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', basicHTML);
    }
    
    removeExistingUI() {
        const existingElements = [
            '.mobile-translate-container',
            '.mobile-translate-simple',
            '.mobile-translate-basic',
            '.premium-translate-container'
        ];
        
        existingElements.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.remove();
            }
        });
    }
    
    addSimpleStyles() {
        // 軽量なCSSを追加
        const style = document.createElement('style');
        style.id = 'mobile-translate-styles';
        style.textContent = `
            .mobile-translate-simple {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 999999;
                font-family: system-ui, -apple-system, sans-serif;
            }
            
            .mobile-lang-btn {
                background: rgba(255, 255, 255, 0.95);
                border: 1px solid #ffb6c1;
                border-radius: 8px;
                padding: 8px 12px;
                font-size: 14px;
                cursor: pointer;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                transition: transform 0.2s ease;
            }
            
            .mobile-lang-btn:active {
                transform: scale(0.95);
            }
            
            .mobile-lang-menu {
                position: absolute;
                top: 100%;
                right: 0;
                margin-top: 5px;
                background: white;
                border: 1px solid #ffb6c1;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                opacity: 0;
                visibility: hidden;
                transform: translateY(-5px);
                transition: all 0.2s ease;
                min-width: 120px;
            }
            
            .mobile-lang-menu.active {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }
            
            .mobile-lang-item {
                width: 100%;
                background: none;
                border: none;
                padding: 10px 12px;
                text-align: left;
                cursor: pointer;
                font-size: 13px;
                border-bottom: 1px solid #f0f0f0;
            }
            
            .mobile-lang-item:last-child {
                border-bottom: none;
            }
            
            .mobile-lang-item:hover {
                background: #f8f9fa;
            }
            
            .mobile-translate-basic {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 999999;
            }
            
            .mobile-translate-basic button {
                background: #ffb6c1;
                border: none;
                border-radius: 6px;
                padding: 8px 12px;
                color: white;
                font-size: 12px;
                cursor: pointer;
            }
            
            @media (max-width: 480px) {
                .mobile-translate-simple {
                    top: 15px;
                    right: 15px;
                }
                
                .mobile-lang-btn {
                    padding: 6px 10px;
                    font-size: 13px;
                }
            }
        `;
        
        // 既存のスタイルを削除してから追加
        const existingStyle = document.getElementById('mobile-translate-styles');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        document.head.appendChild(style);
    }
    
    setupLightweightGoogleTranslate() {
        // 軽量なGoogle Translate設定
        if (!document.getElementById('google_translate_element')) {
            const translateDiv = document.createElement('div');
            translateDiv.id = 'google_translate_element';
            translateDiv.style.display = 'none';
            document.body.appendChild(translateDiv);
        }
        
        // 簡単な初期化（タイムアウト付き）
        window.googleTranslateElementInit = () => {
            try {
                if (typeof google !== 'undefined' && google.translate && !this.isDestroyed) {
                    // 既存の翻訳要素をチェック
                    const existingCombo = document.querySelector('.goog-te-combo');
                    if (existingCombo) {
                        console.log('✅ Google Translate already initialized');
                        return;
                    }
                    
                    new google.translate.TranslateElement({
                        pageLanguage: 'ja',
                        includedLanguages: 'ja,en,zh-cn,ko,fr',
                        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                        autoDisplay: false
                    }, 'google_translate_element');
                    
                    console.log('✅ Lightweight Google Translate initialized');
                }
            } catch (error) {
                console.warn('Google Translate initialization error:', error);
            }
        };
        
        // スクリプト読み込み（重複チェック付き）
        if (!document.querySelector('script[src*="translate.google.com"]')) {
            const script = document.createElement('script');
            script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            script.async = true;
            script.onload = () => console.log('Google Translate script loaded');
            script.onerror = () => console.warn('Failed to load Google Translate script');
            document.head.appendChild(script);
        } else {
            // 既に読み込み済みの場合
            setTimeout(window.googleTranslateElementInit, 500);
        }
    }
    
    bindEvents() {
        const btn = document.getElementById('mobileLangBtn');
        const menu = document.getElementById('mobileLangMenu');
        const langItems = document.querySelectorAll('.mobile-lang-item');
        
        if (btn) {
            btn.addEventListener('click', this.btnClickHandler, { passive: true });
        }
        
        langItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const langCode = e.target.dataset.lang;
                this.changeLanguage(langCode);
            }, { passive: true });
        });
        
        // 外部クリックで閉じる
        document.addEventListener('click', this.documentClickHandler, { passive: true });
    }
    
    toggleDropdown() {
        const menu = document.getElementById('mobileLangMenu');
        if (menu) {
            menu.classList.toggle('active');
        }
    }
    
    closeDropdown() {
        const menu = document.getElementById('mobileLangMenu');
        if (menu) {
            menu.classList.remove('active');
        }
    }
    
    handleDocumentClick(e) {
        if (!e.target.closest('.mobile-translate-simple')) {
            this.closeDropdown();
        }
    }
    
    changeLanguage(langCode) {
        if (!this.supportedLanguages[langCode]) return;
        
        const lang = this.supportedLanguages[langCode];
        const currentText = document.getElementById('currentLangText');
        
        if (currentText) {
            currentText.textContent = lang.name;
        }
        
        // Google Translateで翻訳実行
        const selectElement = document.querySelector('.goog-te-combo');
        if (selectElement) {
            selectElement.value = langCode;
            selectElement.dispatchEvent(new Event('change'));
        }
        
        this.currentLanguage = langCode;
        this.closeDropdown();
        
        console.log(`🌐 Language changed to: ${lang.name}`);
    }
    
    destroy() {
        this.isDestroyed = true;
        
        // タイムアウトをクリア
        if (this.initTimeout) {
            clearTimeout(this.initTimeout);
        }
        
        // イベントリスナーを削除
        const btn = document.getElementById('mobileLangBtn');
        if (btn) {
            btn.removeEventListener('click', this.btnClickHandler);
        }
        
        document.removeEventListener('click', this.documentClickHandler);
        
        // UIを削除
        this.removeExistingUI();
        
        // スタイルを削除
        const style = document.getElementById('mobile-translate-styles');
        if (style) {
            style.remove();
        }
        
        // グローバル参照をクリア
        window.mobileTranslateInstance = null;
        
        console.log('✅ Mobile Translate V2 destroyed');
    }
}

// 安全な初期化（重複防止）
function initMobileTranslateSafely() {
    if (window.mobileTranslateInstance) {
        console.log('Mobile Translate already exists');
        return;
    }
    
    if (window.innerWidth <= 768) {
        try {
            new MobileTranslateFix();
        } catch (error) {
            console.error('Mobile Translate initialization failed:', error);
        }
    }
}

// DOM準備完了時の初期化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileTranslateSafely);
} else {
    initMobileTranslateSafely();
}

// リサイズ対応（デバウンス付き）
let resizeTimer = null;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        const isMobile = window.innerWidth <= 768;
        const hasInstance = !!window.mobileTranslateInstance;
        
        if (isMobile && !hasInstance) {
            initMobileTranslateSafely();
        } else if (!isMobile && hasInstance) {
            window.mobileTranslateInstance.destroy();
        }
    }, 300);
}, { passive: true });

// デバッグ用グローバル関数
window.debugMobileTranslate = () => {
    console.log('=== Mobile Translate Debug ===');
    console.log('Window width:', window.innerWidth);
    console.log('Instance exists:', !!window.mobileTranslateInstance);
    console.log('Google Translate ready:', typeof google !== 'undefined' && !!google.translate);
    console.log('Mobile UI exists:', !!document.querySelector('.mobile-translate-simple'));
    console.log('=============================');
};