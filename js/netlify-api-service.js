class NetlifyAPIService {
    constructor() {
        // 本番環境では自動的にNetlify関数のURLを使用
        this.baseUrl = window.location.hostname === 'localhost' 
            ? 'http://localhost:8888/.netlify/functions' 
            : '/.netlify/functions';
    }

    async sendToOpenAI(message, systemPrompt = null) {
        try {
            const response = await fetch(`${this.baseUrl}/openai-chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    systemPrompt: systemPrompt
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP ${response.status}`);
            }

            const data = await response.json();
            return data;

        } catch (error) {
            console.error('Netlify OpenAI Service Error:', error);
            return {
                success: false,
                error: error.message,
                fallback: true
            };
        }
    }

    async translateText(text, targetLanguage, sourceLanguage = null) {
        try {
            const response = await fetch(`${this.baseUrl}/deepl-translate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: text,
                    targetLanguage: targetLanguage,
                    sourceLanguage: sourceLanguage
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP ${response.status}`);
            }

            const data = await response.json();
            return data;

        } catch (error) {
            console.error('Netlify DeepL Service Error:', error);
            return {
                success: false,
                error: error.message,
                fallback: true
            };
        }
    }

    async detectLanguage(text) {
        // DeepL APIの言語検出を使用（EN翻訳でdetected_source_languageを取得）
        try {
            const result = await this.translateText(text, 'EN');
            if (result.success && result.detectedLanguage) {
                return {
                    success: true,
                    language: result.detectedLanguage.toLowerCase(),
                    confidence: 0.9,
                    method: 'deepl'
                };
            }
        } catch (error) {
            console.warn('DeepL language detection failed, using fallback:', error);
        }

        // フォールバック言語検出
        return this.fallbackLanguageDetection(text);
    }

    fallbackLanguageDetection(text) {
        const patterns = {
            'ja': /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/,
            'ko': /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/,
            'zh': /[\u4E00-\u9FFF]/,
            'th': /[\u0E00-\u0E7F]/,
            'vi': /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i,
            'ar': /[\u0600-\u06FF]/,
            'ru': /[\u0400-\u04FF]/,
            'en': /^[a-zA-Z\s.,!?'"()-]+$/
        };

        for (const [lang, pattern] of Object.entries(patterns)) {
            if (pattern.test(text)) {
                return {
                    success: true,
                    language: lang,
                    confidence: 0.7,
                    method: 'fallback'
                };
            }
        }

        return {
            success: true,
            language: 'en',
            confidence: 0.5,
            method: 'fallback'
        };
    }

    isConfigured() {
        // Netlify関数を使用するため、常にtrueを返す
        return true;
    }

    getUsageInfo() {
        return {
            service: 'Netlify Functions',
            openai: 'Available via server-side',
            deepl: 'Available via server-side',
            configured: this.isConfigured()
        };
    }
}

// グローバルに公開
window.NetlifyAPIService = NetlifyAPIService;