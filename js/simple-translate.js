/**
 * 強制的なGoogle翻訳実装
 * 確実に動作する方法を使用
 */

// 翻訳状態を管理
let isTranslated = false;

// 英語翻訳の切り替え
function toggleEnglishTranslation() {
    console.log('Translation button clicked');
    
    const btn = document.getElementById('englishTranslateBtn');
    
    if (isTranslated) {
        // 日本語に戻す
        restoreOriginalLanguage();
        btn.classList.remove('active');
        btn.innerHTML = '<span class="flag-icon">🇺🇸</span><span class="lang-text">EN</span>';
        isTranslated = false;
        localStorage.setItem('translate_state', 'ja');
    } else {
        // 英語に翻訳
        translateToEnglish();
        btn.classList.add('active');
        btn.innerHTML = '<span class="flag-icon">🇯🇵</span><span class="lang-text">JA</span>';
        isTranslated = true;
        localStorage.setItem('translate_state', 'en');
    }
}

// 英語に翻訳（複数の方法を試行）
function translateToEnglish() {
    console.log('Starting English translation...');
    
    // 方法1: Google翻訳URLリダイレクト
    const currentUrl = window.location.href.split('#')[0].split('?')[0];
    const translateUrl = `https://translate.google.com/translate?sl=ja&tl=en&u=${encodeURIComponent(currentUrl)}`;
    
    // 新しいタブで開く
    window.open(translateUrl, '_blank');
    
    // 方法2: 現在のページにGoogle翻訳パラメータを適用
    setTimeout(() => {
        window.location.href = currentUrl + '#googtrans(ja|en)';
        window.location.reload();
    }, 1000);
}

// 元の言語に戻す
function restoreOriginalLanguage() {
    console.log('Restoring to Japanese...');
    
    // URLから翻訳パラメータを削除
    const currentUrl = window.location.href.split('#')[0].split('?')[0];
    window.location.href = currentUrl;
    window.location.reload();
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