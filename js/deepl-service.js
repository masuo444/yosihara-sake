class DeepLService {
    constructor() {
        this.apiKey = window.aiConfig?.deepl?.apiKey || '';
        this.apiUrl = window.aiConfig?.deepl?.apiUrl || 'https://api-free.deepl.com/v2/translate';
        this.supportedLanguages = {
            'BG': 'Bulgarian',
            'CS': 'Czech',
            'DA': 'Danish',
            'DE': 'German',
            'EL': 'Greek',
            'EN': 'English',
            'ES': 'Spanish',
            'ET': 'Estonian',
            'FI': 'Finnish',
            'FR': 'French',
            'HU': 'Hungarian',
            'ID': 'Indonesian',
            'IT': 'Italian',
            'JA': 'Japanese',
            'KO': 'Korean',
            'LT': 'Lithuanian',
            'LV': 'Latvian',
            'NB': 'Norwegian',
            'NL': 'Dutch',
            'PL': 'Polish',
            'PT': 'Portuguese',
            'RO': 'Romanian',
            'RU': 'Russian',
            'SK': 'Slovak',
            'SL': 'Slovenian',
            'SV': 'Swedish',
            'TR': 'Turkish',
            'UK': 'Ukrainian',
            'ZH': 'Chinese'
        };
    }

    async translateText(text, targetLanguage, sourceLanguage = null) {
        if (!this.apiKey || this.apiKey === 'YOUR_DEEPL_API_KEY' || this.apiKey === 'your_deepl_api_key_here') {
            throw new Error('DeepL API key is not configured');
        }

        if (!text || text.trim() === '') {
            return {
                success: false,
                error: 'No text provided for translation'
            };
        }

        const formData = new FormData();
        formData.append('text', text);
        formData.append('target_lang', targetLanguage.toUpperCase());
        
        if (sourceLanguage) {
            formData.append('source_lang', sourceLanguage.toUpperCase());
        }

        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `DeepL-Auth-Key ${this.apiKey}`,
                    'User-Agent': 'yodobloom-sake-chatbot/1.0'
                },
                body: formData,
                mode: 'cors'
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`DeepL API Error: ${response.status} - ${errorData.message || 'Unknown error'}`);
            }

            const data = await response.json();

            if (data.translations && data.translations.length > 0) {
                return {
                    success: true,
                    translatedText: data.translations[0].text,
                    detectedLanguage: data.translations[0].detected_source_language,
                    originalText: text,
                    targetLanguage: targetLanguage
                };
            } else {
                throw new Error('No translation received from DeepL');
            }
        } catch (error) {
            console.error('DeepL Service Error:', error);
            return {
                success: false,
                error: error.message,
                fallback: true
            };
        }
    }

    async detectLanguage(text) {
        if (!this.apiKey || this.apiKey === 'YOUR_DEEPL_API_KEY' || this.apiKey === 'your_deepl_api_key_here') {
            return this.fallbackLanguageDetection(text);
        }

        try {
            const result = await this.translateText(text, 'EN');
            if (result.success && result.detectedLanguage) {
                return {
                    success: true,
                    language: result.detectedLanguage.toLowerCase(),
                    confidence: 0.9
                };
            }
        } catch (error) {
            console.warn('DeepL language detection failed, using fallback:', error);
        }

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

    mapLanguageCode(code) {
        const mappings = {
            'zh-cn': 'ZH',
            'zh-tw': 'ZH',
            'pt-br': 'PT-BR',
            'pt-pt': 'PT-PT',
            'en-us': 'EN-US',
            'en-gb': 'EN-GB'
        };

        return mappings[code.toLowerCase()] || code.toUpperCase();
    }

    async translateToMultipleLanguages(text, targetLanguages) {
        const results = {};
        
        for (const lang of targetLanguages) {
            try {
                const result = await this.translateText(text, this.mapLanguageCode(lang));
                results[lang] = result;
            } catch (error) {
                results[lang] = {
                    success: false,
                    error: error.message
                };
            }
        }

        return results;
    }

    getSupportedLanguages() {
        return this.supportedLanguages;
    }

    isConfigured() {
        return this.apiKey && 
               this.apiKey !== 'YOUR_DEEPL_API_KEY' && 
               this.apiKey !== 'your_deepl_api_key_here' &&
               this.apiKey.includes(':');
    }

    getUsageInfo() {
        return {
            apiUrl: this.apiUrl,
            configured: this.isConfigured(),
            supportedLanguageCount: Object.keys(this.supportedLanguages).length
        };
    }

    async getAccountUsage() {
        if (!this.isConfigured()) {
            throw new Error('DeepL API key is not configured');
        }

        try {
            const response = await fetch('https://api-free.deepl.com/v2/usage', {
                method: 'GET',
                headers: {
                    'Authorization': `DeepL-Auth-Key ${this.apiKey}`
                }
            });

            if (!response.ok) {
                throw new Error(`DeepL Usage API Error: ${response.status}`);
            }

            const data = await response.json();
            return {
                success: true,
                usage: data
            };
        } catch (error) {
            console.error('DeepL Usage Error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

window.DeepLService = DeepLService;