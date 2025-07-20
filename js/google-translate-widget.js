/**
 * Google翻訳ウィジェット統合
 * 公式Google翻訳ウィジェットを使用したシンプルな実装
 */

// Google翻訳要素の初期化
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'ja',
        includedLanguages: 'ja,en,zh-CN,ko,vi,fr',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false,
        multilanguagePage: true
    }, 'google_translate_element');
    
    // スタイリングのカスタマイズ
    setTimeout(() => {
        customizeGoogleTranslate();
    }, 1000);
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

// 既存のtoggleLanguageMenu機能を維持
window.googleTranslate = window.googleTranslate || {};
window.googleTranslate.toggleLanguageMenu = function() {
    const dropdown = document.getElementById('languageDropdown');
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

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    addTranslateStateClass();
});

// Google翻訳スクリプトを動的に読み込み
(function() {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.head.appendChild(script);
})();