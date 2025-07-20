// 超シンプルなモバイル翻訳システム - リロードなし、安定動作

(function() {
    'use strict';
    
    // モバイルでない場合は何もしない
    if (window.innerWidth > 768) {
        return;
    }
    
    // 既に初期化済みの場合は何もしない
    if (window.simpleMobileTranslateLoaded) {
        return;
    }
    window.simpleMobileTranslateLoaded = true;
    
    // シンプルな言語セット
    const languages = {
        'ja': '🇯🇵 日本語',
        'en': '🇺🇸 English',
        'zh-cn': '🇨🇳 中文',
        'ko': '🇰🇷 한국어'
    };
    
    let currentLang = 'ja';
    let isOpen = false;
    
    // UIを作成
    function createUI() {
        // 既存のUIを削除
        const existing = document.querySelector('#simpleMobileTranslate');
        if (existing) {
            existing.remove();
        }
        
        const html = `
            <div id="simpleMobileTranslate" style="
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 999999;
                font-family: system-ui, sans-serif;
            ">
                <button id="simpleLangBtn" style="
                    background: white;
                    border: 1px solid #ccc;
                    border-radius: 6px;
                    padding: 8px 12px;
                    font-size: 14px;
                    cursor: pointer;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                ">${languages[currentLang]}</button>
                
                <div id="simpleLangMenu" style="
                    position: absolute;
                    top: 100%;
                    right: 0;
                    margin-top: 5px;
                    background: white;
                    border: 1px solid #ccc;
                    border-radius: 6px;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                    display: none;
                    min-width: 120px;
                ">
                    ${Object.entries(languages).map(([code, name]) => 
                        `<div data-lang="${code}" style="
                            padding: 8px 12px;
                            cursor: pointer;
                            border-bottom: 1px solid #eee;
                            font-size: 13px;
                        " onmouseover="this.style.background='#f5f5f5'" 
                           onmouseout="this.style.background='white'">${name}</div>`
                    ).join('')}
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', html);
        
        // イベント設定
        const btn = document.getElementById('simpleLangBtn');
        const menu = document.getElementById('simpleLangMenu');
        
        btn.onclick = function(e) {
            e.stopPropagation();
            isOpen = !isOpen;
            menu.style.display = isOpen ? 'block' : 'none';
        };
        
        // 言語選択
        menu.addEventListener('click', function(e) {
            const langCode = e.target.dataset.lang;
            if (langCode && languages[langCode]) {
                currentLang = langCode;
                btn.textContent = languages[langCode];
                menu.style.display = 'none';
                isOpen = false;
                
                // Google Translateで翻訳実行
                translatePage(langCode);
            }
        });
        
        // 外部クリックで閉じる
        document.addEventListener('click', function() {
            if (isOpen) {
                menu.style.display = 'none';
                isOpen = false;
            }
        });
    }
    
    // Google Translate設定
    function setupGoogleTranslate() {
        // 隠しGoogle Translate要素
        if (!document.getElementById('google_translate_element')) {
            const div = document.createElement('div');
            div.id = 'google_translate_element';
            div.style.display = 'none';
            document.body.appendChild(div);
        }
        
        // 初期化関数
        window.googleTranslateElementInit = function() {
            if (typeof google !== 'undefined' && google.translate) {
                try {
                    new google.translate.TranslateElement({
                        pageLanguage: 'ja',
                        includedLanguages: 'ja,en,zh-cn,ko',
                        layout: google.translate.TranslateElement.InlineLayout.SIMPLE
                    }, 'google_translate_element');
                } catch (e) {
                    console.log('Google Translate init error:', e);
                }
            }
        };
        
        // スクリプト読み込み（1回のみ）
        if (!document.querySelector('script[src*="translate.google.com"]')) {
            const script = document.createElement('script');
            script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            script.async = true;
            document.head.appendChild(script);
        }
    }
    
    // 翻訳実行
    function translatePage(langCode) {
        setTimeout(function() {
            const select = document.querySelector('.goog-te-combo');
            if (select) {
                select.value = langCode;
                select.dispatchEvent(new Event('change'));
            }
        }, 500);
    }
    
    // 初期化
    function init() {
        createUI();
        setupGoogleTranslate();
    }
    
    // DOM準備完了時に実行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();