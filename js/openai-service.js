class OpenAIService {
    constructor() {
        this.apiKey = window.aiConfig?.openai?.apiKey || '';
        this.model = window.aiConfig?.openai?.model || 'gpt-4';
        this.maxTokens = window.aiConfig?.openai?.maxTokens || 1000;
        this.temperature = window.aiConfig?.openai?.temperature || 0.7;
        this.apiUrl = 'https://api.openai.com/v1/chat/completions';
    }

    async sendMessage(userMessage, systemPrompt = null) {
        if (!this.apiKey || this.apiKey === 'YOUR_OPENAI_API_KEY' || this.apiKey === 'your_openai_api_key_here') {
            throw new Error('OpenAI API key is not configured');
        }

        const prompt = systemPrompt || window.aiConfig?.chatbot?.systemPrompt || 'You are a helpful assistant for yodobloom SAKE.';

        const requestData = {
            model: this.model,
            messages: [
                {
                    role: 'system',
                    content: prompt
                },
                {
                    role: 'user',
                    content: userMessage
                }
            ],
            max_tokens: this.maxTokens,
            temperature: this.temperature,
            stream: false
        };

        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                    'User-Agent': 'yodobloom-sake-chatbot/1.0'
                },
                body: JSON.stringify(requestData),
                mode: 'cors'
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`OpenAI API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
            }

            const data = await response.json();
            
            if (data.choices && data.choices.length > 0) {
                return {
                    success: true,
                    message: data.choices[0].message.content.trim(),
                    usage: data.usage
                };
            } else {
                throw new Error('No response received from OpenAI');
            }
        } catch (error) {
            console.error('OpenAI Service Error:', error);
            return {
                success: false,
                error: error.message,
                fallback: true
            };
        }
    }

    async streamMessage(userMessage, systemPrompt = null, onChunk = null) {
        if (!this.apiKey || this.apiKey === 'YOUR_OPENAI_API_KEY' || this.apiKey === 'your_openai_api_key_here') {
            throw new Error('OpenAI API key is not configured');
        }

        const prompt = systemPrompt || window.aiConfig?.chatbot?.systemPrompt || 'You are a helpful assistant for yodobloom SAKE.';

        const requestData = {
            model: this.model,
            messages: [
                {
                    role: 'system',
                    content: prompt
                },
                {
                    role: 'user',
                    content: userMessage
                }
            ],
            max_tokens: this.maxTokens,
            temperature: this.temperature,
            stream: true
        };

        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                    'User-Agent': 'yodobloom-sake-chatbot/1.0'
                },
                body: JSON.stringify(requestData),
                mode: 'cors'
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`OpenAI API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullMessage = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') continue;

                        try {
                            const parsed = JSON.parse(data);
                            const content = parsed.choices?.[0]?.delta?.content;
                            if (content) {
                                fullMessage += content;
                                if (onChunk) {
                                    onChunk(content, fullMessage);
                                }
                            }
                        } catch (e) {
                            console.warn('Failed to parse SSE data:', data);
                        }
                    }
                }
            }

            return {
                success: true,
                message: fullMessage
            };
        } catch (error) {
            console.error('OpenAI Streaming Error:', error);
            return {
                success: false,
                error: error.message,
                fallback: true
            };
        }
    }

    isConfigured() {
        return this.apiKey && 
               this.apiKey !== 'YOUR_OPENAI_API_KEY' && 
               this.apiKey !== 'your_openai_api_key_here' &&
               this.apiKey.startsWith('sk-');
    }

    getUsageInfo() {
        return {
            model: this.model,
            maxTokens: this.maxTokens,
            temperature: this.temperature,
            configured: this.isConfigured()
        };
    }
}

window.OpenAIService = OpenAIService;