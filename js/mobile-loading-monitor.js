// Mobile Loading State Monitor for yodobloom SAKE
// モバイル読み込み状態監視システム

class MobileLoadingMonitor {
    constructor() {
        this.loadStartTime = Date.now();
        this.loadTimeout = 30000; // 30秒でタイムアウト
        this.isLoading = true;
        this.loadingSteps = [];
        this.errors = [];
        
        this.init();
    }
    
    init() {
        console.log('🔍 Mobile Loading Monitor initialized');
        
        // ページロード完了を監視
        this.monitorPageLoad();
        
        // スクリプトエラーを監視
        this.monitorScriptErrors();
        
        // パフォーマンス監視
        this.monitorPerformance();
        
        // タイムアウト監視
        this.setupTimeout();
        
        // デバッグ情報表示
        this.setupDebugInfo();
    }
    
    monitorPageLoad() {
        // DOMContentLoaded監視
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.logStep('DOMContentLoaded fired');
                this.checkLoadingComplete();
            });
        } else {
            this.logStep('DOM already loaded');
        }
        
        // window.onload監視
        if (document.readyState !== 'complete') {
            window.addEventListener('load', () => {
                this.logStep('Window load fired');
                this.checkLoadingComplete();
            });
        } else {
            this.logStep('Window already loaded');
        }
        
        // 重要なスクリプトの読み込みを監視
        this.monitorCriticalScripts();
    }
    
    monitorCriticalScripts() {
        const criticalScripts = [
            'main.js',
            'premium-translate.js',
            'mobile-translate-fix.js',
            'premium-chatbot.js'
        ];
        
        criticalScripts.forEach(scriptName => {
            const script = document.querySelector(`script[src*="${scriptName}"]`);
            if (script) {
                script.addEventListener('load', () => {
                    this.logStep(`${scriptName} loaded`);
                    this.checkLoadingComplete();
                });
                
                script.addEventListener('error', (error) => {
                    this.logError(`${scriptName} failed to load`, error);
                });
            }
        });
        
        // グローバルオブジェクトの初期化を監視
        this.monitorGlobalObjects();
    }
    
    monitorGlobalObjects() {
        const checkInterval = setInterval(() => {
            const objects = {
                'yodobloomSAKE': window.yodobloomSAKE,
                'premiumTranslate': window.premiumTranslate,
                'mobileTranslateFix': window.mobileTranslateFix,
                'modernChatbot': window.modernChatbot
            };
            
            let allLoaded = true;
            for (const [name, obj] of Object.entries(objects)) {
                if (!obj && window.innerWidth <= 768 && name === 'mobileTranslateFix') {
                    allLoaded = false;
                } else if (!obj && name !== 'mobileTranslateFix') {
                    allLoaded = false;
                }
            }
            
            if (allLoaded) {
                this.logStep('All critical objects initialized');
                clearInterval(checkInterval);
                this.checkLoadingComplete();
            }
        }, 100);
        
        // 10秒後にタイムアウト
        setTimeout(() => {
            clearInterval(checkInterval);
        }, 10000);
    }
    
    monitorScriptErrors() {
        window.addEventListener('error', (event) => {
            this.logError('Script error', {
                message: event.message,
                source: event.filename,
                line: event.lineno,
                column: event.colno,
                error: event.error
            });
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            this.logError('Unhandled promise rejection', event.reason);
        });
    }
    
    monitorPerformance() {
        if ('performance' in window) {
            // ナビゲーションタイミング
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const navigation = performance.getEntriesByType('navigation')[0];
                    if (navigation) {
                        this.logStep(`Page load time: ${navigation.loadEventEnd - navigation.fetchStart}ms`);
                        
                        // 遅すぎる場合は警告
                        if (navigation.loadEventEnd - navigation.fetchStart > 5000) {
                            this.logError('Slow page load detected', `${navigation.loadEventEnd - navigation.fetchStart}ms`);
                        }
                    }
                }, 100);
            });
        }
    }
    
    setupTimeout() {
        setTimeout(() => {
            if (this.isLoading) {
                this.logError('Loading timeout', `Page failed to load within ${this.loadTimeout}ms`);
                this.showTimeoutMessage();
            }
        }, this.loadTimeout);
    }
    
    setupDebugInfo() {
        // デバッグ用のコンソールコマンド
        window.debugMobileLoading = () => {
            console.group('🔍 Mobile Loading Debug Info');
            console.log('Loading time:', Date.now() - this.loadStartTime + 'ms');
            console.log('Loading steps:', this.loadingSteps);
            console.log('Errors:', this.errors);
            console.log('Is loading:', this.isLoading);
            console.log('Screen size:', window.innerWidth + 'x' + window.innerHeight);
            console.log('User agent:', navigator.userAgent);
            console.log('Global objects:');
            console.log('  - yodobloomSAKE:', !!window.yodobloomSAKE);
            console.log('  - premiumTranslate:', !!window.premiumTranslate);
            console.log('  - mobileTranslateFix:', !!window.mobileTranslateFix);
            console.log('  - modernChatbot:', !!window.modernChatbot);
            console.groupEnd();
        };
        
        // 5秒後に自動デバッグ情報出力（開発用）
        setTimeout(() => {
            if (this.errors.length > 0 || this.isLoading) {
                console.warn('🚨 Mobile loading issues detected. Run debugMobileLoading() for details.');
            }
        }, 5000);
    }
    
    logStep(step) {
        const timestamp = Date.now() - this.loadStartTime;
        this.loadingSteps.push({ step, timestamp });
        console.log(`✅ [${timestamp}ms] ${step}`);
    }
    
    logError(error, details) {
        const timestamp = Date.now() - this.loadStartTime;
        this.errors.push({ error, details, timestamp });
        console.error(`❌ [${timestamp}ms] ${error}:`, details);
    }
    
    checkLoadingComplete() {
        // すべての重要な要素がロードされているかチェック
        const requiredElements = [
            '#chatButton',
            '#chatInterface',
            '.header',
            '.hero'
        ];
        
        const allElementsPresent = requiredElements.every(selector => 
            document.querySelector(selector) !== null
        );
        
        if (allElementsPresent && document.readyState === 'complete') {
            this.isLoading = false;
            const loadTime = Date.now() - this.loadStartTime;
            this.logStep(`Loading completed in ${loadTime}ms`);
            
            // 読み込み完了イベントを発火
            window.dispatchEvent(new CustomEvent('mobileLoadingComplete', {
                detail: { loadTime, steps: this.loadingSteps, errors: this.errors }
            }));
        }
    }
    
    showTimeoutMessage() {
        const timeoutDiv = document.createElement('div');
        timeoutDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.95);
            border: 2px solid #ff4444;
            border-radius: 12px;
            padding: 20px;
            max-width: 300px;
            text-align: center;
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        `;
        
        timeoutDiv.innerHTML = `
            <h3 style="margin: 0 0 12px 0; color: #ff4444;">⚠️ 読み込みエラー</h3>
            <p style="margin: 0 0 16px 0; font-size: 14px; color: #666;">
                ページの読み込みに時間がかかっています。<br>
                再読み込みしてください。
            </p>
            <button onclick="window.location.reload()" style="
                background: #ff4444;
                color: white;
                border: none;
                border-radius: 6px;
                padding: 8px 16px;
                cursor: pointer;
                font-size: 14px;
            ">再読み込み</button>
        `;
        
        document.body.appendChild(timeoutDiv);
        
        // 10秒後に自動で削除
        setTimeout(() => {
            if (timeoutDiv.parentNode) {
                timeoutDiv.parentNode.removeChild(timeoutDiv);
            }
        }, 10000);
    }
}

// モバイルデバイスでのみ監視を開始
if (window.innerWidth <= 768) {
    new MobileLoadingMonitor();
}