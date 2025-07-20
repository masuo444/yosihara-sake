const { Octokit } = require('@octokit/rest');
const fetch = require('node-fetch');
const fs = require('fs').promises;
const path = require('path');

class BreweryWebsiteGenerator {
    constructor(githubToken, netlifyToken) {
        this.github = new Octokit({ auth: githubToken });
        this.netlifyToken = netlifyToken;
        this.baseTemplate = '/Users/masuo/Desktop/yodobloom-sake';
    }

    // メイン生成関数
    async generateBreweryWebsite(config) {
        try {
            console.log('🚀 酒造サイト生成開始:', config.brewery.name);
            
            // 1. GitHubリポジトリ作成
            const repo = await this.createGitHubRepository(config);
            
            // 2. ファイル生成
            const files = await this.generateFiles(config);
            
            // 3. リポジトリにプッシュ
            await this.pushToRepository(repo, files);
            
            // 4. Netlifyデプロイ
            const site = await this.deployToNetlify(repo, config);
            
            // 5. カスタムドメイン設定
            if (config.deployment.customDomain) {
                await this.setupCustomDomain(site, config.deployment.customDomain);
            }
            
            return {
                success: true,
                repository: repo.data.html_url,
                website: site.url,
                customDomain: config.deployment.customDomain
            };
            
        } catch (error) {
            console.error('❌ 生成エラー:', error);
            return { success: false, error: error.message };
        }
    }

    // GitHubリポジトリ自動作成
    async createGitHubRepository(config) {
        const repoName = `${config.brewery.name.toLowerCase().replace(/\s+/g, '-')}-website`;
        
        const repo = await this.github.repos.create({
            name: repoName,
            description: `${config.brewery.name}の公式ウェブサイト - AI搭載多言語対応`,
            private: false,
            auto_init: true
        });
        
        console.log('✅ GitHubリポジトリ作成:', repo.data.name);
        return repo;
    }

    // ファイル自動生成
    async generateFiles(config) {
        const files = {};
        
        // 1. index.html生成
        files['index.html'] = await this.generateIndexHTML(config);
        
        // 2. AI設定ファイル生成
        files['config/ai-config.js'] = this.generateAIConfig(config);
        
        // 3. package.json生成
        files['package.json'] = this.generatePackageJSON(config);
        
        // 4. Netlify Functions
        files['netlify/functions/openai-chat.js'] = await fs.readFile(
            path.join(this.baseTemplate, 'netlify/functions/openai-chat.js'), 'utf8'
        );
        files['netlify/functions/deepl-translate.js'] = await fs.readFile(
            path.join(this.baseTemplate, 'netlify/functions/deepl-translate.js'), 'utf8'
        );
        
        // 5. CSS（テーマ適用）
        files['css/style.css'] = await this.generateStyledCSS(config);
        
        // 6. JavaScript
        files['js/netlify-api-service.js'] = await fs.readFile(
            path.join(this.baseTemplate, 'js/netlify-api-service.js'), 'utf8'
        );
        files['js/premium-chatbot.js'] = await fs.readFile(
            path.join(this.baseTemplate, 'js/premium-chatbot.js'), 'utf8'
        );
        
        // 7. 設定ファイル
        files['netlify.toml'] = await fs.readFile(
            path.join(this.baseTemplate, 'netlify.toml'), 'utf8'
        );
        
        return files;
    }

    // index.html生成
    async generateIndexHTML(config) {
        const template = await fs.readFile(
            path.join(this.baseTemplate, 'index.html'), 'utf8'
        );
        
        return template
            .replace(/yodobloom SAKE/g, config.brewery.name)
            .replace(/ヨドブルーム サケ/g, config.brewery.name)
            .replace(/大阪市北区大深町1-1 2階/g, config.brewery.address)
            .replace(/06-4802-1010/g, config.brewery.phone)
            .replace(/日本酒テーマパーク/g, config.brewery.businessType === 'sake_brewery' ? '酒造' : config.brewery.businessType)
            .replace(/季節ごとに厳選された１００種類の日本酒を試飲しながら、認定唎酒師®がガイドしてくれる日本酒テーマパークです。/g, config.brewery.motto)
            // 商品セクションの置換
            .replace(/<div class="products-grid"[\s\S]*?<\/div>/g, this.generateProductsHTML(config.products))
            // その他の置換...
    }

    // AI設定生成
    generateAIConfig(config) {
        return `// AI Configuration for ${config.brewery.name}
window.aiConfig = {
    openai: {
        apiKey: process.env.OPENAI_API_KEY || '',
        model: 'gpt-4',
        maxTokens: 1000,
        temperature: 0.7
    },
    
    deepl: {
        apiKey: 'd266de28-0978-4216-bb9d-17f137f6e904:fx',
        apiUrl: 'https://api-free.deepl.com/v2/translate'
    },
    
    chatbot: {
        systemPrompt: \`${config.chatbot.systemPrompt}\`,
        fallbackResponses: ${JSON.stringify(config.chatbot.fallbackResponses, null, 8)}
    },
    
    quickActions: ${JSON.stringify(config.chatbot.quickActions, null, 4)},
    
    company: {
        id: '${config.brewery.name.toLowerCase().replace(/\s+/g, '_')}',
        name: '${config.brewery.name}',
        businessType: '${config.brewery.businessType}',
        specialties: ${JSON.stringify(config.brewery.features)}
    }
};`;
    }

    // Netlify自動デプロイ
    async deployToNetlify(repo, config) {
        const response = await fetch('https://api.netlify.com/api/v1/sites', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.netlifyToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: `${config.brewery.name.toLowerCase().replace(/\s+/g, '-')}-site`,
                repo: {
                    provider: 'github',
                    repo: repo.data.full_name
                },
                build_settings: {
                    cmd: '',
                    dir: '',
                    env: {
                        OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
                        DEEPL_API_KEY: process.env.DEEPL_API_KEY || ''
                    }
                }
            })
        });
        
        const site = await response.json();
        console.log('✅ Netlifyデプロイ完了:', site.url);
        return site;
    }

    // 商品HTML生成
    generateProductsHTML(products) {
        return products.map(product => `
            <div class="product-card" data-category="${product.category}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                </div>
                <div class="product-header">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-type">${product.type}</p>
                    <p class="product-description">${product.description}</p>
                </div>
                <!-- 詳細情報は省略 -->
            </div>
        `).join('');
    }
}

// 使用例
async function createBreweryWebsite() {
    const generator = new BreweryWebsiteGenerator(
        'your_github_token',
        'your_netlify_token'
    );
    
    // 設定ファイル読み込み
    const config = JSON.parse(await fs.readFile('brewery-template-config.json', 'utf8'));
    
    // サイト生成実行
    const result = await generator.generateBreweryWebsite(config);
    
    if (result.success) {
        console.log('🎉 酒造サイト生成完了！');
        console.log('📁 リポジトリ:', result.repository);
        console.log('🌐 ウェブサイト:', result.website);
        console.log('🏷️ カスタムドメイン:', result.customDomain);
    } else {
        console.error('❌ 生成失敗:', result.error);
    }
}

module.exports = BreweryWebsiteGenerator;