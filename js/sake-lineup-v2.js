// Enhanced Sake Lineup JavaScript
// オシャレな日本酒ラインナップ専用スクリプト

document.addEventListener('DOMContentLoaded', function() {
    initializeSakeLineup();
});

function initializeSakeLineup() {
    setupFilterButtons();
    setupTabSwitching();
    setupScrollAnimations();
    console.log('Enhanced Sake Lineup initialized');
}

// フィルター機能
function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sakeCards = document.querySelectorAll('.sake-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            
            // アクティブボタンの切り替え
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // カードのフィルタリング
            filterSakeCards(category, sakeCards);
        });
    });
}

function filterSakeCards(category, cards) {
    cards.forEach((card, index) => {
        const cardCategory = card.getAttribute('data-category');
        
        if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
            
            // アニメーション効果
            setTimeout(() => {
                card.style.animation = 'fadeIn 0.6s ease-in-out';
            }, index * 100);
        } else {
            card.style.animation = 'none';
            card.style.display = 'none';
        }
    });
}

// 詳細展開・収納機能
function toggleSakeDetails(sakeId) {
    const detailsElement = document.getElementById(`${sakeId}-details`);
    const toggleButton = document.querySelector(`[onclick="toggleSakeDetails('${sakeId}')"]`);
    const toggleText = toggleButton.querySelector('.toggle-text');
    const toggleIcon = toggleButton.querySelector('.toggle-icon');
    
    if (detailsElement.classList.contains('expanded')) {
        // 収納
        detailsElement.classList.remove('expanded');
        toggleButton.classList.remove('expanded');
        toggleText.textContent = '詳細を見る';
        toggleIcon.textContent = '▼';
    } else {
        // 展開
        detailsElement.classList.add('expanded');
        toggleButton.classList.add('expanded');
        toggleText.textContent = '詳細を閉じる';
        toggleIcon.textContent = '▲';
        
        // スムーズスクロール
        setTimeout(() => {
            detailsElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' 
            });
        }, 200);
    }
}

// タブ切り替え機能
function setupTabSwitching() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('tab-btn')) {
            const tabName = e.target.getAttribute('data-tab');
            const detailsContainer = e.target.closest('.sake-details');
            
            if (!detailsContainer || !tabName) return;
            
            // 同じ詳細セクション内のタブボタンのアクティブ状態を更新
            const tabButtons = detailsContainer.querySelectorAll('.tab-btn');
            tabButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            
            // 同じ詳細セクション内のタブコンテンツを更新
            const tabContents = detailsContainer.querySelectorAll('.tab-content');
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.getAttribute('data-tab') === tabName) {
                    content.classList.add('active');
                }
            });
        }
    });
}

// スクロールアニメーション
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideIn 0.8s ease-out';
                entry.target.style.opacity = '1';
            }
        });
    }, observerOptions);

    // カードを監視対象に追加
    const sakeCards = document.querySelectorAll('.sake-card');
    sakeCards.forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
    });
}

// 検索機能（オプション）
function searchSake(searchTerm) {
    const sakeCards = document.querySelectorAll('.sake-card');
    const normalizedSearch = searchTerm.toLowerCase();

    sakeCards.forEach(card => {
        const sakeName = card.querySelector('.sake-name').textContent.toLowerCase();
        const sakeDescription = card.querySelector('.sake-description').textContent.toLowerCase();
        const sakeTags = Array.from(card.querySelectorAll('.sake-tag')).map(tag => tag.textContent.toLowerCase()).join(' ');
        
        const isMatch = sakeName.includes(normalizedSearch) || 
                       sakeDescription.includes(normalizedSearch) ||
                       sakeTags.includes(normalizedSearch);

        if (isMatch || searchTerm === '') {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.5s ease-in-out';
        } else {
            card.style.display = 'none';
        }
    });
}

// レスポンシブメニュー（モバイル対応）
function setupResponsiveFeatures() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // モバイル専用の機能
        document.querySelectorAll('.sake-card').forEach(card => {
            card.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            });
            
            card.addEventListener('touchend', function() {
                this.style.transform = '';
            });
        });
    }
}

// ページ読み込み時にレスポンシブ機能を初期化
window.addEventListener('resize', setupResponsiveFeatures);
setupResponsiveFeatures();

// エクスポート（他のファイルで使用する場合）
window.sakeLineupFunctions = {
    toggleSakeDetails,
    searchSake,
    filterSakeCards
};