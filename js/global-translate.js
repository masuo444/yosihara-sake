// グローバル翻訳システム - 全世界対応
// yodobloom SAKE専用

class GlobalTranslate {
    constructor() {
        this.currentLanguage = 'ja';
        this.isInitialized = false;
        
        // 世界主要言語（地域別）
        this.languages = {
            // 東アジア
            'ja': { name: '日本語', flag: '🇯🇵', region: 'asia' },
            'ko': { name: '한국어', flag: '🇰🇷', region: 'asia' },
            'zh-cn': { name: '简体中文', flag: '🇨🇳', region: 'asia' },
            'zh-tw': { name: '繁體中文', flag: '🇹🇼', region: 'asia' },
            
            // 東南アジア
            'th': { name: 'ไทย', flag: '🇹🇭', region: 'asia' },
            'vi': { name: 'Tiếng Việt', flag: '🇻🇳', region: 'asia' },
            'ms': { name: 'Bahasa Malaysia', flag: '🇲🇾', region: 'asia' },
            'id': { name: 'Bahasa Indonesia', flag: '🇮🇩', region: 'asia' },
            
            // 南アジア
            'hi': { name: 'हिन्दी', flag: '🇮🇳', region: 'asia' },
            
            // 欧米
            'en': { name: 'English', flag: '🇺🇸', region: 'western' },
            'es': { name: 'Español', flag: '🇪🇸', region: 'western' },
            'fr': { name: 'Français', flag: '🇫🇷', region: 'western' },
            'de': { name: 'Deutsch', flag: '🇩🇪', region: 'western' },
            'it': { name: 'Italiano', flag: '🇮🇹', region: 'western' },
            'pt': { name: 'Português', flag: '🇵🇹', region: 'western' },
            'ru': { name: 'Русский', flag: '🇷🇺', region: 'western' },
            
            // 中東・アフリカ
            'ar': { name: 'العربية', flag: '🇸🇦', region: 'middle_east' }
        };
        
        this.init();
    }
    
    init() {
        if (this.isInitialized) return;
        
        this.createGlobalUI();
        this.setupGoogleTranslate();
        this.bindEvents();
        this.detectUserLanguage();
        
        this.isInitialized = true;
        console.log('🌍 Global Translate System initialized');
    }
    
    createGlobalUI() {
        // 既存の翻訳UIを削除
        document.querySelectorAll('[id*="translate"], [class*="translate"]').forEach(el => {
            if (el.id !== 'google_translate_element') {
                el.remove();
            }
        });
        
        const globalUI = `
            <div id="globalTranslateSystem" class="global-translate">
                <button id="globalTranslateBtn" class="global-translate-btn">
                    <span class="current-flag">🇯🇵</span>
                    <span class="current-lang">日本語</span>
                    <span class="translate-arrow">🌐</span>
                </button>
                
                <div id="globalTranslatePanel" class="global-translate-panel">
                    <div class="translate-header">
                        <h3>🌍 言語選択 / Language</h3>
                        <button id="closeTranslatePanel" class="close-btn">×</button>
                    </div>
                    
                    <div class="language-regions">
                        <div class="region-section">
                            <h4>🏯 アジア / Asia</h4>
                            <div class="language-grid">
                                ${this.renderLanguagesByRegion('asia')}
                            </div>
                        </div>
                        
                        <div class="region-section">
                            <h4>🏛️ 欧米 / Western</h4>
                            <div class="language-grid">
                                ${this.renderLanguagesByRegion('western')}
                            </div>
                        </div>
                        
                        <div class="region-section">
                            <h4>🕌 中東・その他 / Others</h4>
                            <div class="language-grid">
                                ${this.renderLanguagesByRegion('middle_east')}
                            </div>
                        </div>
                    </div>
                    
                    <div class="translate-footer">
                        <small>Powered by Google Translate</small>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', globalUI);
        this.addGlobalStyles();
    }
    
    renderLanguagesByRegion(region) {
        return Object.entries(this.languages)
            .filter(([code, lang]) => lang.region === region)
            .map(([code, lang]) => `
                <button class="lang-option" data-lang="${code}">
                    <span class="lang-flag">${lang.flag}</span>
                    <span class="lang-name">${lang.name}</span>
                </button>
            `).join('');
    }
    
    addGlobalStyles() {
        const style = document.createElement('style');
        style.id = 'global-translate-styles';
        style.textContent = `
            .global-translate {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 999999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            
            .global-translate-btn {
                background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
                border: 2px solid #e9ecef;
                border-radius: 12px;
                padding: 10px 16px;
                display: flex;
                align-items: center;
                gap: 8px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                color: #495057;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                transition: all 0.3s ease;
                min-width: 140px;
            }
            
            .global-translate-btn:hover {
                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                border-color: #007bff;
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(0, 123, 255, 0.2);
            }
            
            .current-flag {
                font-size: 18px;
            }
            
            .current-lang {
                flex: 1;
            }
            
            .translate-arrow {
                font-size: 16px;
                opacity: 0.7;
            }
            
            .global-translate-panel {
                position: absolute;
                top: 100%;
                right: 0;
                margin-top: 10px;
                background: white;
                border-radius: 16px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
                border: 1px solid #e9ecef;
                min-width: 400px;
                max-width: 90vw;
                max-height: 70vh;
                overflow: hidden;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.3s ease;
            }
            
            .global-translate-panel.active {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }
            
            .translate-header {
                background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
                color: white;
                padding: 16px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .translate-header h3 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
            }
            
            .close-btn {
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background 0.2s ease;
            }
            
            .close-btn:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            .language-regions {
                padding: 20px;
                max-height: 50vh;
                overflow-y: auto;
            }
            
            .region-section {
                margin-bottom: 24px;
            }
            
            .region-section:last-child {
                margin-bottom: 0;
            }
            
            .region-section h4 {
                margin: 0 0 12px 0;
                font-size: 14px;
                font-weight: 600;
                color: #495057;
                border-bottom: 1px solid #e9ecef;
                padding-bottom: 8px;
            }
            
            .language-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
                gap: 8px;
            }
            
            .lang-option {
                background: #f8f9fa;
                border: 1px solid #e9ecef;
                border-radius: 8px;
                padding: 10px 12px;
                display: flex;
                align-items: center;
                gap: 8px;
                cursor: pointer;
                font-size: 13px;
                font-weight: 500;
                color: #495057;
                transition: all 0.2s ease;
            }
            
            .lang-option:hover {
                background: #007bff;
                border-color: #007bff;
                color: white;
                transform: translateY(-1px);
            }
            
            .lang-flag {
                font-size: 16px;
            }
            
            .lang-name {
                flex: 1;
                text-align: left;
            }
            
            .translate-footer {
                background: #f8f9fa;
                padding: 12px 20px;
                text-align: center;
                border-top: 1px solid #e9ecef;
                color: #6c757d;
            }
            
            /* モバイル対応 */
            @media (max-width: 768px) {
                .global-translate {
                    top: 16px;
                    right: 16px;
                }
                
                .global-translate-btn {
                    padding: 8px 12px;
                    font-size: 13px;
                    min-width: 120px;
                }
                
                .global-translate-panel {
                    min-width: 320px;
                    max-width: calc(100vw - 32px);
                    right: 0;
                }
                
                .language-grid {
                    grid-template-columns: 1fr;
                }
                
                .lang-option {
                    min-height: 44px;
                }
            }
            
            /* Google Translateバナー非表示 */
            .goog-te-banner-frame,
            .goog-te-ftab-frame {
                display: none !important;
            }
            
            body {
                top: 0 !important;
            }
        `;
        
        document.head.appendChild(style);
    }
    
    setupGoogleTranslate() {
        // Google Translate要素の準備
        if (!document.getElementById('google_translate_element')) {
            const div = document.createElement('div');
            div.id = 'google_translate_element';
            div.style.display = 'none';
            document.body.appendChild(div);
        }
        
        // Google Translate初期化
        window.googleTranslateElementInit = () => {
            if (typeof google !== 'undefined' && google.translate) {
                try {
                    // 既存の翻訳要素を削除
                    const existingGoogleBar = document.querySelector('.goog-te-banner-frame');
                    if (existingGoogleBar) {
                        existingGoogleBar.remove();
                    }
                    
                    new google.translate.TranslateElement({
                        pageLanguage: 'ja',
                        includedLanguages: Object.keys(this.languages).join(','),
                        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                        autoDisplay: false
                    }, 'google_translate_element');
                    
                    // 翻訳準備完了の確認
                    setTimeout(() => {
                        const selectElement = document.querySelector('.goog-te-combo');
                        if (selectElement) {
                            console.log('✅ Google Translate ready and functional');
                            this.showTranslationReady();
                        } else {
                            console.warn('⚠️ Google Translate select not found, retrying...');
                            setTimeout(() => window.googleTranslateElementInit(), 1000);
                        }
                    }, 1000);
                    
                } catch (error) {
                    console.error('Google Translate initialization error:', error);
                    this.showTranslationError();
                }
            } else {
                console.warn('Google Translate API not loaded, retrying...');
                setTimeout(() => window.googleTranslateElementInit(), 2000);
            }
        };
        
        // スクリプト読み込み
        if (!document.querySelector('script[src*="translate.google.com"]')) {
            const script = document.createElement('script');
            script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            script.async = true;
            document.head.appendChild(script);
        } else {
            setTimeout(window.googleTranslateElementInit, 100);
        }
    }
    
    bindEvents() {
        const btn = document.getElementById('globalTranslateBtn');
        const panel = document.getElementById('globalTranslatePanel');
        const closeBtn = document.getElementById('closeTranslatePanel');
        
        // パネル開閉
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            panel.classList.toggle('active');
        });
        
        closeBtn.addEventListener('click', () => {
            panel.classList.remove('active');
        });
        
        // 言語選択
        panel.addEventListener('click', (e) => {
            const langOption = e.target.closest('.lang-option');
            if (langOption) {
                const langCode = langOption.dataset.lang;
                this.translateTo(langCode);
                panel.classList.remove('active');
            }
        });
        
        // 外部クリックで閉じる
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.global-translate')) {
                panel.classList.remove('active');
            }
        });
    }
    
    translateTo(langCode) {
        if (!this.languages[langCode]) return;
        
        const lang = this.languages[langCode];
        const btn = document.getElementById('globalTranslateBtn');
        
        // ボタン更新
        btn.querySelector('.current-flag').textContent = lang.flag;
        btn.querySelector('.current-lang').textContent = lang.name;
        
        // Google Translateで翻訳実行
        setTimeout(() => {
            const select = document.querySelector('.goog-te-combo');
            if (select) {
                select.value = langCode;
                select.dispatchEvent(new Event('change'));
            }
        }, 300);
        
        this.currentLanguage = langCode;
        console.log(`🌍 Language changed to: ${lang.name}`);
    }
    
    showTranslationReady() {
        // 翻訳準備完了の表示
        const btn = document.getElementById('globalTranslateBtn');
        if (btn) {
            btn.style.borderColor = '#28a745';
            btn.title = '翻訳機能が利用可能です';
        }
    }
    
    showTranslationError() {
        // 翻訳エラーの表示
        const btn = document.getElementById('globalTranslateBtn');
        if (btn) {
            btn.style.borderColor = '#dc3545';
            btn.title = '翻訳機能の読み込みに失敗しました';
        }
    }
    
    detectUserLanguage() {
        // ブラウザ言語の自動検出
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0];
        
        if (this.languages[langCode] && langCode !== 'ja') {
            setTimeout(() => {
                this.showLanguageSuggestion(langCode);
            }, 2000);
        }
    }
    
    showLanguageSuggestion(langCode) {
        const lang = this.languages[langCode];
        if (!lang) return;
        
        const suggestion = document.createElement('div');
        suggestion.className = 'language-suggestion';
        suggestion.innerHTML = `
            <div class="suggestion-content">
                <p>🌍 ${lang.flag} Translate to ${lang.name}?</p>
                <div class="suggestion-actions">
                    <button class="suggest-yes" data-lang="${langCode}">Yes</button>
                    <button class="suggest-no">No, thanks</button>
                </div>
            </div>
        `;
        
        suggestion.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: white;
            border-radius: 12px;
            padding: 16px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
            border: 1px solid #e9ecef;
            z-index: 999998;
            animation: slideInUp 0.3s ease;
        `;
        
        document.body.appendChild(suggestion);
        
        // イベント処理
        suggestion.addEventListener('click', (e) => {
            if (e.target.classList.contains('suggest-yes')) {
                this.translateTo(e.target.dataset.lang);
            }
            suggestion.remove();
        });
        
        // 10秒後に自動削除
        setTimeout(() => {
            if (suggestion.parentNode) {
                suggestion.remove();
            }
        }, 10000);
    }
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.globalTranslate = new GlobalTranslate();
        console.log('✅ Global Translate System loaded');
    } catch (error) {
        console.error('❌ Global Translate System failed to load:', error);
    }
});