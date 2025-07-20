/**
 * Google翻訳ウィジェット統合
 * 公式Google翻訳ウィジェットを使用したシンプルな実装
 */

// Google翻訳要素の初期化
function googleTranslateElementInit() {
    console.log('Initializing Google Translate...');
    
    // メインのGoogle翻訳要素（隠し）
    new google.translate.TranslateElement({
        pageLanguage: 'ja',
        includedLanguages: 'ja,en,zh-CN,ko,vi,fr',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false,
        multilanguagePage: true
    }, 'google_translate_element');
    
    console.log('Main Google Translate element created');
    
    // スタイリングのカスタマイズ
    setTimeout(() => {
        customizeGoogleTranslate();
        console.log('Google Translate customization applied');
    }, 1500);
}

// Google翻訳ウィジェットのスタイルカスタマイズ
function customizeGoogleTranslate() {
    // デフォルトのGoogle翻訳バーを非表示
    const translateBar = document.querySelector('.goog-te-banner-frame');
    if (translateBar) {
        translateBar.style.display = 'none';
    }
    
    // bodyタグのtop位置を調整
    document.body.style.top = '0px';
    
    // カスタムセレクターとGoogle翻訳の連携
    connectCustomSelector();
}

// カスタム言語セレクターとGoogle翻訳の連携
function connectCustomSelector() {
    const googleSelect = document.querySelector('.goog-te-combo');
    if (!googleSelect) {
        setTimeout(connectCustomSelector, 500);
        return;
    }
    
    // Google翻訳セレクトボックスを非表示
    const googleTranslateElement = document.getElementById('google_translate_element');
    if (googleTranslateElement) {
        googleTranslateElement.style.display = 'none';
    }
    
    // カスタムセレクターのイベントリスナーを更新
    document.querySelectorAll('.language-option').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const langCode = this.dataset.lang;
            
            // Google翻訳の言語コードマッピング
            const googleLangMap = {
                'ja': '',  // 日本語（元の言語）
                'en': 'en',
                'zh': 'zh-CN',
                'ko': 'ko',
                'vi': 'vi',
                'fr': 'fr'
            };
            
            const googleLang = googleLangMap[langCode];
            
            if (googleLang === '') {
                // 日本語に戻す（翻訳を解除）
                const googleFrame = document.querySelector('.goog-te-banner-frame');
                if (googleFrame) {
                    const iframe = googleFrame.contentWindow;
                    const restore = iframe.document.querySelector('.goog-te-banner-frame-buttons button:first-child');
                    if (restore) {
                        restore.click();
                    }
                }
                // 別の方法で元に戻す
                if (googleSelect) {
                    googleSelect.value = '';
                    googleSelect.dispatchEvent(new Event('change'));
                }
            } else {
                // 他の言語に翻訳
                if (googleSelect) {
                    googleSelect.value = googleLang;
                    googleSelect.dispatchEvent(new Event('change'));
                }
            }
            
            // UI更新
            updateLanguageUI(langCode);
        });
    });
}

// 言語UI更新
function updateLanguageUI(langCode) {
    const langInfo = {
        'ja': { name: '日本語', flag: '🇯🇵' },
        'en': { name: 'English', flag: '🇺🇸' },
        'zh': { name: '中文', flag: '🇨🇳' },
        'ko': { name: '한국어', flag: '🇰🇷' },
        'vi': { name: 'Tiếng Việt', flag: '🇻🇳' },
        'fr': { name: 'Français', flag: '🇫🇷' }
    };
    
    const currentLang = document.querySelector('.current-language');
    if (currentLang && langInfo[langCode]) {
        currentLang.innerHTML = `
            <span class="flag">${langInfo[langCode].flag}</span>
            <span class="lang-code">${langInfo[langCode].name}</span>
            <span class="chevron">▼</span>
        `;
    }
    
    // アクティブ状態を更新
    document.querySelectorAll('.language-option').forEach(option => {
        option.classList.toggle('active', option.dataset.lang === langCode);
    });
    
    // ドロップダウンを閉じる
    const dropdown = document.getElementById('languageDropdown');
    if (dropdown) {
        dropdown.style.display = 'none';
        dropdown.classList.remove('show');
    }
}

// 英語翻訳ボタンの制御
window.toggleEnglishTranslation = function() {
    console.log('English translation button clicked');
    const btn = document.getElementById('englishTranslateBtn');
    const isActive = btn.classList.contains('active');
    
    // Google翻訳の隠されたセレクトボックスを探す
    let googleSelect = document.querySelector('.goog-te-combo');
    
    if (!googleSelect) {
        console.log('Google translate not ready, waiting...');
        // Google翻訳がまだ読み込まれていない場合は初期化を試行
        if (typeof googleTranslateElementInit === 'function') {
            googleTranslateElementInit();
        }
        
        // 再試行
        setTimeout(() => {
            googleSelect = document.querySelector('.goog-te-combo');
            if (googleSelect) {
                executeTranslation(googleSelect, btn, isActive);
            } else {
                console.error('Google Translate failed to initialize');
                // フォールバック: 直接Google翻訳URLにリダイレクト
                const currentUrl = window.location.href;
                if (isActive) {
                    // 元のURLに戻す
                    window.location.href = currentUrl.split('#googtrans')[0];
                } else {
                    // 英語翻訳URLにリダイレクト
                    window.location.href = currentUrl + '#googtrans(ja|en)';
                    window.location.reload();
                }
            }
        }, 1000);
        return;
    }
    
    executeTranslation(googleSelect, btn, isActive);
};

function executeTranslation(googleSelect, btn, isActive) {
    console.log('Executing translation, isActive:', isActive);
    
    if (isActive) {
        // 日本語（元の言語）に戻す
        googleSelect.value = '';
        googleSelect.dispatchEvent(new Event('change'));
        btn.classList.remove('active');
        btn.innerHTML = '<span class="flag-icon">🇺🇸</span><span class="lang-text">EN</span>';
        console.log('Switching to Japanese');
    } else {
        // 英語に翻訳
        googleSelect.value = 'en';
        googleSelect.dispatchEvent(new Event('change'));
        btn.classList.add('active');
        btn.innerHTML = '<span class="flag-icon">🇯🇵</span><span class="lang-text">JA</span>';
        console.log('Switching to English');
    }
}

// 既存のtoggleLanguageMenu機能を維持
window.googleTranslate = window.googleTranslate || {};
window.googleTranslate.toggleLanguageMenu = function() {
    const dropdown = document.getElementById('languageDropdown');
    if (!dropdown) return;
    
    const isVisible = dropdown.style.display !== 'none';
    
    if (isVisible) {
        dropdown.classList.remove('show');
        setTimeout(() => {
            dropdown.style.display = 'none';
        }, 300);
    } else {
        dropdown.style.display = 'block';
        setTimeout(() => {
            dropdown.classList.add('show');
        }, 10);
    }
};

// ページ外クリックでドロップダウンを閉じる
document.addEventListener('click', (e) => {
    if (!e.target.closest('.translate-container')) {
        const dropdown = document.getElementById('languageDropdown');
        if (dropdown && dropdown.style.display !== 'none') {
            dropdown.classList.remove('show');
            setTimeout(() => {
                dropdown.style.display = 'none';
            }, 300);
        }
    }
});

// CSSクラスを追加して翻訳状態を管理
function addTranslateStateClass() {
    const observer = new MutationObserver((mutations) => {
        const html = document.documentElement;
        if (html.classList.contains('translated-ltr')) {
            document.body.classList.add('is-translated');
        } else {
            document.body.classList.remove('is-translated');
        }
    });
    
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
    });
}

// 翻訳状態の監視と英語ボタンの同期
function monitorTranslationState() {
    const observer = new MutationObserver(() => {
        const html = document.documentElement;
        const btn = document.getElementById('englishTranslateBtn');
        
        if (!btn) return;
        
        // 翻訳されている状態を検出
        if (html.classList.contains('translated-ltr')) {
            // 現在の翻訳言語を確認
            const googleSelect = document.querySelector('.goog-te-combo');
            if (googleSelect && googleSelect.value === 'en') {
                btn.classList.add('active');
                btn.innerHTML = '<span class="flag-icon">🇯🇵</span><span class="lang-text">JA</span>';
            }
            document.body.classList.add('is-translated');
        } else {
            // 翻訳が解除された状態
            btn.classList.remove('active');
            btn.innerHTML = '<span class="flag-icon">🇺🇸</span><span class="lang-text">EN</span>';
            document.body.classList.remove('is-translated');
        }
    });
    
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
    });
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    addTranslateStateClass();
    monitorTranslationState();
});

// Google翻訳スクリプトを動的に読み込み
(function() {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.head.appendChild(script);
})();