/**
 * シンプルな英語翻訳機能
 * Google翻訳APIを直接利用
 */

// 翻訳状態を管理
let isTranslated = false;

// 英語翻訳の切り替え
function toggleEnglishTranslation() {
    console.log('Toggle translation clicked, current state:', isTranslated);
    
    const btn = document.getElementById('englishTranslateBtn');
    
    if (isTranslated) {
        // 日本語に戻す
        restoreOriginalLanguage();
        btn.classList.remove('active');
        btn.innerHTML = '<span class="flag-icon">🇺🇸</span><span class="lang-text">EN</span>';
        isTranslated = false;
    } else {
        // 英語に翻訳
        translateToEnglish();
        btn.classList.add('active');
        btn.innerHTML = '<span class="flag-icon">🇯🇵</span><span class="lang-text">JA</span>';
        isTranslated = true;
    }
}

// 英語に翻訳
function translateToEnglish() {
    console.log('Translating to English...');
    
    // URLに翻訳パラメータを追加
    const currentUrl = window.location.href.split('#')[0];
    const newUrl = currentUrl + '#googtrans(ja|en)';
    
    // Google翻訳を強制実行
    window.location.href = newUrl;
    
    // ページを再読み込みして翻訳を適用
    setTimeout(() => {
        window.location.reload();
    }, 100);
}

// 元の言語に戻す
function restoreOriginalLanguage() {
    console.log('Restoring to Japanese...');
    
    // URLから翻訳パラメータを削除
    const currentUrl = window.location.href.split('#')[0];
    window.location.href = currentUrl;
    
    // ページを再読み込み
    setTimeout(() => {
        window.location.reload();
    }, 100);
}

// ページ読み込み時に翻訳状態をチェック
document.addEventListener('DOMContentLoaded', function() {
    // URLに翻訳パラメータがあるかチェック
    if (window.location.href.includes('#googtrans(ja|en)')) {
        isTranslated = true;
        const btn = document.getElementById('englishTranslateBtn');
        if (btn) {
            btn.classList.add('active');
            btn.innerHTML = '<span class="flag-icon">🇯🇵</span><span class="lang-text">JA</span>';
        }
    }
    
    console.log('Page loaded, translation state:', isTranslated);
});

// Google翻訳ウィジェットが読み込まれた後の処理
window.addEventListener('load', function() {
    setTimeout(() => {
        // Google翻訳の自動生成されるツールバーを非表示
        const translateBar = document.querySelector('.goog-te-banner-frame');
        if (translateBar) {
            translateBar.style.display = 'none';
            document.body.style.top = '0px';
        }
        
        // Google翻訳のドロップダウンも非表示
        const googleTranslateElement = document.getElementById('google_translate_element');
        if (googleTranslateElement) {
            googleTranslateElement.style.display = 'none';
        }
    }, 2000);
});