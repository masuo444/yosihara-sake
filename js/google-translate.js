/**
 * Google翻訳API統合 - サイト全体翻訳
 * 対応言語: 中国語、韓国語、ベトナム語、フランス語
 */

class GoogleTranslateService {
    constructor() {
        this.apiKey = null; // Google Cloud Translation API Key
        this.currentLanguage = 'ja';
        this.supportedLanguages = {
            'ja': { name: '日本語', flag: '🇯🇵', code: 'ja' },
            'en': { name: 'English', flag: '🇺🇸', code: 'en' },
            'zh': { name: '中文', flag: '🇨🇳', code: 'zh' },
            'ko': { name: '한국어', flag: '🇰🇷', code: 'ko' },
            'vi': { name: 'Tiếng Việt', flag: '🇻🇳', code: 'vi' },
            'fr': { name: 'Français', flag: '🇫🇷', code: 'fr' }
        };
        this.originalTexts = new Map(); // 元のテキストを保存
        this.translationCache = new Map(); // 翻訳キャッシュ
        this.isTranslating = false;
        
        this.init();
    }

    init() {
        this.createLanguageSelector();
        this.setupEventListeners();
        this.loadAPIKey();
        console.log('🌐 Google翻訳サービスが初期化されました');
    }

    createLanguageSelector() {
        const header = document.querySelector('.header-content');
        if (!header) return;

        const translateContainer = document.createElement('div');
        translateContainer.className = 'translate-container';
        translateContainer.innerHTML = `
            <div class="language-selector-wrapper">
                <button class="language-toggle" onclick="googleTranslate.toggleLanguageMenu()">
                    <span class="current-language">
                        <span class="flag">🇯🇵</span>
                        <span class="lang-code">日本語</span>
                        <span class="chevron">▼</span>
                    </span>
                </button>
                <div class="language-dropdown" id="languageDropdown" style="display: none;">
                    <div class="language-dropdown-header">
                        <span class="translate-icon">🌐</span>
                        <span>言語を選択</span>
                    </div>
                    <div class="language-options">
                        ${Object.entries(this.supportedLanguages).map(([code, info]) => `
                            <button class="language-option ${code === 'ja' ? 'active' : ''}" 
                                    data-lang="${code}" 
                                    onclick="googleTranslate.changeLanguage('${code}')">
                                <span class="flag">${info.flag}</span>
                                <span class="lang-name">${info.name}</span>
                                ${code === 'ja' ? '<span class="original-badge">原文</span>' : ''}
                            </button>
                        `).join('')}
                    </div>
                    <div class="translation-info">
                        <small>Powered by Google Translate</small>
                    </div>
                </div>
            </div>
        `;

        // ナビゲーションの前に挿入
        const nav = header.querySelector('.nav');
        header.insertBefore(translateContainer, nav);
    }

    setupEventListeners() {
        // ページ外クリックでドロップダウンを閉じる
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.translate-container')) {
                this.closeLanguageMenu();
            }
        });

        // ESCキーでドロップダウンを閉じる
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeLanguageMenu();
            }
        });
    }

    loadAPIKey() {
        // 実際のAPIキーは環境変数から取得
        this.apiKey = process.env.GOOGLE_TRANSLATE_API_KEY || localStorage.getItem('google_translate_api_key');
    }

    toggleLanguageMenu() {
        const dropdown = document.getElementById('languageDropdown');
        const isVisible = dropdown.style.display !== 'none';
        
        if (isVisible) {
            this.closeLanguageMenu();
        } else {
            this.openLanguageMenu();
        }
    }

    openLanguageMenu() {
        const dropdown = document.getElementById('languageDropdown');
        const toggle = document.querySelector('.language-toggle');
        
        dropdown.style.display = 'block';
        toggle.classList.add('active');
        
        // アニメーション
        setTimeout(() => {
            dropdown.classList.add('show');
        }, 10);
    }

    closeLanguageMenu() {
        const dropdown = document.getElementById('languageDropdown');
        const toggle = document.querySelector('.language-toggle');
        
        dropdown.classList.remove('show');
        toggle.classList.remove('active');
        
        setTimeout(() => {
            dropdown.style.display = 'none';
        }, 300);
    }

    async changeLanguage(langCode) {
        if (this.isTranslating || langCode === this.currentLanguage) {
            this.closeLanguageMenu();
            return;
        }

        this.showTranslationProgress();
        
        try {
            if (langCode === 'ja') {
                // 日本語に戻す
                await this.restoreOriginalText();
            } else {
                // 他の言語に翻訳
                await this.translatePageTo(langCode);
            }
            
            this.currentLanguage = langCode;
            this.updateLanguageDisplay(langCode);
            
        } catch (error) {
            console.error('翻訳エラー:', error);
            this.showTranslationError();
        } finally {
            this.hideTranslationProgress();
            this.closeLanguageMenu();
        }
    }

    async translatePageTo(targetLang) {
        this.isTranslating = true;
        
        // 翻訳対象の要素を収集
        const elements = this.collectTranslatableElements();
        
        for (const element of elements) {
            const originalText = element.textContent.trim();
            if (!originalText || this.shouldSkipElement(element)) continue;
            
            // 元のテキストを保存
            if (!this.originalTexts.has(element)) {
                this.originalTexts.set(element, originalText);
            }
            
            // キャッシュをチェック
            const cacheKey = `${originalText}_${targetLang}`;
            if (this.translationCache.has(cacheKey)) {
                element.textContent = this.translationCache.get(cacheKey);
                continue;
            }
            
            try {
                const translatedText = await this.translateText(originalText, targetLang);
                element.textContent = translatedText;
                
                // キャッシュに保存
                this.translationCache.set(cacheKey, translatedText);
                
                // 翻訳速度を調整（API制限対応）
                await this.delay(100);
                
            } catch (error) {
                console.error(`翻訳失敗 (${originalText}):`, error);
            }
        }
        
        this.isTranslating = false;
    }

    async translateText(text, targetLang) {
        try {
            // APIプロキシサーバー経由で翻訳
            const response = await fetch('/api/google-translate/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: text,
                    target: targetLang,
                    source: 'ja'
                })
            });

            if (!response.ok) {
                throw new Error(`Translation API error: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success) {
                return data.translatedText;
            } else if (data.fallbackTranslation) {
                return data.fallbackTranslation;
            } else {
                throw new Error(data.message || '翻訳に失敗しました');
            }
        } catch (error) {
            console.error('翻訳エラー:', error);
            // フォールバック翻訳を使用
            return this.getFallbackTranslation(text, targetLang);
        }
    }

    getFallbackTranslation(text, targetLang) {
        // APIキーがない場合の簡易翻訳辞書
        const fallbackTranslations = {
            'en': {
                '吉源酒造場': 'Yoshigen Sake Brewery',
                '寿齢': 'Jurei',
                '商品一覧': 'Product List',
                '蔵元について': 'About the Brewery',
                '歴史': 'History',
                'アクセス': 'Access',
                '営業時間': 'Business Hours',
                '定休日': 'Closed Days',
                '日曜日、祝日': 'Sundays, Holidays',
                '特選': 'Special Selection',
                '上撰': 'Premium Selection',
                '本醸造原酒': 'Honjozo Genshu',
                '地元復活銘柄': 'Local Revival Brand'
            },
            'zh': {
                '吉源酒造場': '吉源酒造场',
                '寿齢': '寿龄',
                '商品一覧': '产品列表',
                '蔵元について': '关于酒厂',
                '歴史': '历史',
                'アクセス': '交通',
                '営業時間': '营业时间',
                '定休日': '休息日',
                '日曜日、祝日': '周日、节假日',
                '特選': '特选',
                '上撰': '上选',
                '本醸造原酒': '本酿造原酒',
                '地元復活銘柄': '当地复活品牌'
            },
            'ko': {
                '吉源酒造場': '요시겐 양조장',
                '寿齢': '수령',
                '商品一覧': '상품 목록',
                '蔵元について': '양조장 소개',
                '歴史': '역사',
                'アクセス': '오시는 길',
                '営業時間': '영업시간',
                '定休日': '정기휴일',
                '日曜日、祝日': '일요일, 공휴일',
                '特選': '특선',
                '上撰': '상선',
                '本醸造原酒': '혼조조 겐슈',
                '地元復活銘柄': '지역 부활 브랜드'
            },
            'vi': {
                '吉源酒造場': 'Nhà máy rượu Yoshigen',
                '寿齢': 'Jurei',
                '商品一覧': 'Danh sách sản phẩm',
                '蔵元について': 'Về nhà máy rượu',
                '歴史': 'Lịch sử',
                'アクセス': 'Cách đến',
                '営業時間': 'Giờ làm việc',
                '定休日': 'Ngày nghỉ',
                '日曜日、祝日': 'Chủ nhật, ngày lễ',
                '特選': 'Đặc tuyển',
                '上撰': 'Thượng tuyển',
                '本醸造原酒': 'Honjozo Genshu',
                '地元復活銘柄': 'Thương hiệu phục hồi địa phương'
            },
            'fr': {
                '吉源酒造場': 'Brasserie de saké Yoshigen',
                '寿齢': 'Jurei',
                '商品一覧': 'Liste des produits',
                '蔵元について': 'À propos de la brasserie',
                '歴史': 'Histoire',
                'アクセス': 'Accès',
                '営業時間': 'Heures d\'ouverture',
                '定休日': 'Jour de fermeture',
                '日曜日、祝日': 'Dimanche, jours fériés',
                '特選': 'Sélection spéciale',
                '上撰': 'Sélection supérieure',
                '本醸造原酒': 'Honjozo Genshu',
                '地元復活銘柄': 'Marque de renaissance locale'
            }
        };

        return fallbackTranslations[targetLang]?.[text] || text;
    }

    async restoreOriginalText() {
        for (const [element, originalText] of this.originalTexts.entries()) {
            if (element && element.parentNode) {
                element.textContent = originalText;
            }
        }
    }

    collectTranslatableElements() {
        const selectors = [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'p', 'span:not(.flag):not(.lang-code)',
            '.nav-link', '.btn:not(.language-option)',
            '.product-name', '.product-type', '.product-description',
            '.section-title', '.feature-tag',
            '.footer-section h3', '.footer-section p'
        ];

        const elements = [];
        selectors.forEach(selector => {
            const found = document.querySelectorAll(selector);
            elements.push(...Array.from(found));
        });

        return elements.filter(el => 
            !el.closest('.translate-container') && 
            !el.closest('#chatbotWindow') &&
            !this.shouldSkipElement(el)
        );
    }

    shouldSkipElement(element) {
        // スキップする要素の条件
        const skipClasses = ['flag', 'lang-code', 'lang-name', 'original-badge'];
        const skipParents = ['.translate-container', '#chatbotWindow', '.language-dropdown'];
        
        if (skipClasses.some(cls => element.classList.contains(cls))) {
            return true;
        }
        
        if (skipParents.some(selector => element.closest(selector))) {
            return true;
        }
        
        // 数字のみ、記号のみの要素はスキップ
        const text = element.textContent.trim();
        if (/^\d+$/.test(text) || /^[^\w\s]+$/.test(text)) {
            return true;
        }
        
        return false;
    }

    updateLanguageDisplay(langCode) {
        const currentLang = document.querySelector('.current-language');
        const langInfo = this.supportedLanguages[langCode];
        
        if (currentLang && langInfo) {
            currentLang.innerHTML = `
                <span class="flag">${langInfo.flag}</span>
                <span class="lang-code">${langInfo.name}</span>
                <span class="chevron">▼</span>
            `;
        }

        // アクティブな言語オプションを更新
        document.querySelectorAll('.language-option').forEach(option => {
            option.classList.toggle('active', option.dataset.lang === langCode);
        });
    }

    showTranslationProgress() {
        const toggle = document.querySelector('.language-toggle');
        toggle.classList.add('translating');
        toggle.innerHTML = `
            <span class="translation-progress">
                <span class="spinner">🔄</span>
                <span>翻訳中...</span>
            </span>
        `;
    }

    hideTranslationProgress() {
        const toggle = document.querySelector('.language-toggle');
        toggle.classList.remove('translating');
        this.updateLanguageDisplay(this.currentLanguage);
    }

    showTranslationError() {
        alert('翻訳中にエラーが発生しました。しばらく後にお試しください。');
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 管理者用: APIキー設定
    setAPIKey(apiKey) {
        this.apiKey = apiKey;
        localStorage.setItem('google_translate_api_key', apiKey);
        console.log('Google Translate APIキーが設定されました');
    }
}

// グローバルインスタンスを作成
window.googleTranslate = new GoogleTranslateService();

// ページ読み込み完了後に初期化
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌐 Google翻訳サービスが起動しました');
});