/**
 * iframeベースのGoogle翻訳実装
 * 確実に動作する翻訳機能
 */

// 翻訳モーダルの作成
function createTranslateModal() {
    // 既存のモーダルがあれば削除
    const existingModal = document.getElementById('translateModal');
    if (existingModal) {
        existingModal.remove();
    }

    // モーダル要素を作成
    const modal = document.createElement('div');
    modal.id = 'translateModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 10000;
        display: flex;
        justify-content: center;
        align-items: center;
    `;

    // モーダルコンテンツ
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        width: 90%;
        height: 90%;
        max-width: 1200px;
        border-radius: 8px;
        position: relative;
        overflow: hidden;
    `;

    // 閉じるボタン
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
        position: absolute;
        top: 10px;
        right: 15px;
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        z-index: 10001;
        color: #333;
    `;
    closeBtn.onclick = () => modal.remove();

    // iframe要素
    const iframe = document.createElement('iframe');
    const currentUrl = window.location.href.split('#')[0].split('?')[0];
    const translateUrl = `https://translate.google.com/translate?sl=ja&tl=en&u=${encodeURIComponent(currentUrl)}`;
    
    iframe.src = translateUrl;
    iframe.style.cssText = `
        width: 100%;
        height: 100%;
        border: none;
    `;

    modalContent.appendChild(closeBtn);
    modalContent.appendChild(iframe);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // ESCキーで閉じる
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            modal.remove();
        }
    });
}

// 英語翻訳の切り替え（改良版）
function toggleEnglishTranslation() {
    console.log('English translation requested');
    
    const btn = document.getElementById('englishTranslateBtn');
    
    // 翻訳状態をチェック
    const isCurrentlyTranslated = localStorage.getItem('translate_state') === 'en';
    
    if (isCurrentlyTranslated) {
        // 日本語に戻す
        localStorage.setItem('translate_state', 'ja');
        btn.classList.remove('active');
        btn.innerHTML = '<span class="flag-icon">🇺🇸</span><span class="lang-text">EN</span>';
        
        // 現在のページを日本語で再読み込み
        const currentUrl = window.location.href.split('#')[0].split('?')[0];
        window.location.href = currentUrl;
        window.location.reload();
    } else {
        // 英語翻訳オプションを表示
        showTranslationOptions();
        
        localStorage.setItem('translate_state', 'en');
        btn.classList.add('active');
        btn.innerHTML = '<span class="flag-icon">🇯🇵</span><span class="lang-text">JA</span>';
    }
}

// 翻訳オプションを表示
function showTranslationOptions() {
    // オプション選択モーダル
    const optionModal = document.createElement('div');
    optionModal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        text-align: center;
        border: 2px solid var(--primary-color);
    `;

    optionModal.innerHTML = `
        <h3 style="margin-bottom: 1rem; color: var(--primary-color);">英語翻訳オプション</h3>
        <p style="margin-bottom: 2rem; color: #666;">翻訳方法を選択してください</p>
        <div style="display: flex; gap: 1rem; justify-content: center;">
            <button id="newTabTranslate" style="
                background: var(--primary-color);
                color: white;
                border: none;
                padding: 0.8rem 1.5rem;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.9rem;
            ">新しいタブで翻訳</button>
            <button id="modalTranslate" style="
                background: #007cba;
                color: white;
                border: none;
                padding: 0.8rem 1.5rem;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.9rem;
            ">モーダルで翻訳</button>
            <button id="closeOptions" style="
                background: #666;
                color: white;
                border: none;
                padding: 0.8rem 1.5rem;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.9rem;
            ">キャンセル</button>
        </div>
    `;

    document.body.appendChild(optionModal);

    // イベントリスナー
    document.getElementById('newTabTranslate').onclick = () => {
        const currentUrl = window.location.href.split('#')[0].split('?')[0];
        const translateUrl = `https://translate.google.com/translate?sl=ja&tl=en&u=${encodeURIComponent(currentUrl)}`;
        window.open(translateUrl, '_blank');
        optionModal.remove();
    };

    document.getElementById('modalTranslate').onclick = () => {
        createTranslateModal();
        optionModal.remove();
    };

    document.getElementById('closeOptions').onclick = () => {
        // ボタンの状態を元に戻す
        const btn = document.getElementById('englishTranslateBtn');
        localStorage.setItem('translate_state', 'ja');
        btn.classList.remove('active');
        btn.innerHTML = '<span class="flag-icon">🇺🇸</span><span class="lang-text">EN</span>';
        optionModal.remove();
    };

    // 3秒後に自動で新しいタブで開く
    setTimeout(() => {
        if (document.body.contains(optionModal)) {
            document.getElementById('newTabTranslate').click();
        }
    }, 3000);
}