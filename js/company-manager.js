// yodobloom SAKE Company Manager
// yodobloom SAKE専用 企業情報管理システム

class CompanyManager {
    constructor() {
        this.companyData = {
            id: 'yodobloom_sake',
            name: 'yodobloom SAKE',
            businessType: 'sake_theme_park',
            
            // 許可されたキーワード（yodobloom SAKE専用）
            allowedKeywords: [
                'yodobloom', 'ヨドブルーム', 'SAKE', 'サケ',
                '日本酒テーマパーク', 'テーマパーク', '唎酒師', '専門',
                '大阪', '北区', '梅田', '大深町', '日本酒',
                '試飲体験', 'アプリ', 'カスタマイズ', '季節限定', '100種類',
                'ガイド付き', '個人化推薦', '認定唎酒師', '体験',
                '予約', 'チャレンジ', '酒', 'ゲーム', 'モバイル'
            ],
            
            // ブロックされた企業（他社情報は回答しない）
            blockedCompanies: [
                '他社', '他のテーマパーク', '競合', '別の酒蔵', 
                '他のワイナリー', '他の店舗', '竹浪', '青森', '津軽'
            ],
            
            // 企業基本情報
            basicInfo: {
                name: 'yodobloom SAKE (ヨドブルーム サケ)',
                location: '大阪市北区大深町1-1 2階',
                phone: '06-4802-1010',
                hours: {
                    weekdays: '12:00-22:00',
                    weekends: '10:00-22:00',
                    lastEntry: '21:00'
                },
                website: 'https://yodobloom.com',
                description: '季節ごとに厳選された100種類の日本酒を試飲しながら唎酒師®がガイドしてくれる日本酒テーマパーク'
            },
            
            // サービス情報
            services: [
                {
                    name: '唎酒師®ガイド付き体験',
                    description: '認定唎酒師®による専門的なガイド付きで日本酒の奥深さを学びながら試飲',
                    duration: '30分間',
                    features: ['専門ガイド', '教育的体験', '個別対応']
                },
                {
                    name: '季節限定100種類セレクション',
                    description: '全国の優秀な蔵元から季節ごとに厳選された100種類の日本酒',
                    features: ['季節限定', '全国蔵元厳選', '100種類']
                },
                {
                    name: 'カスタマイズ推薦体験',
                    description: '個人の好みに合わせた30分間のカスタマイズされた日本酒推薦体験',
                    features: ['個人化', '30分体験', 'カスタマイズ']
                },
                {
                    name: 'アプリ連動酒チャレンジ',
                    description: 'モバイルアプリを使った予約システムと酒チャレンジゲーム',
                    features: ['アプリ連動', 'ゲーム要素', '予約システム']
                }
            ]
        };
        
        this.init();
    }
    
    init() {
        this.validateCompanyData();
        this.setupCompanyFilter();
        console.log('yodobloom SAKE Company Manager initialized');
    }
    
    validateCompanyData() {
        if (!this.companyData.name || !this.companyData.basicInfo) {
            console.error('Company data is incomplete');
            return false;
        }
        
        console.log(`Company: ${this.companyData.name}`);
        console.log(`Business Type: ${this.companyData.businessType}`);
        console.log(`Location: ${this.companyData.basicInfo.location}`);
        
        return true;
    }
    
    setupCompanyFilter() {
        // グローバルに企業フィルターを設定
        window.companyFilter = {
            isAllowedTopic: (question) => this.isAllowedTopic(question),
            filterResponse: (response) => this.filterResponse(response),
            getCompanyInfo: () => this.getCompanyInfo()
        };
    }
    
    isAllowedTopic(question) {
        if (!question || typeof question !== 'string') {
            return false;
        }
        
        const lowerQuestion = question.toLowerCase();
        
        // 許可されたキーワードのチェック
        const hasAllowedKeyword = this.companyData.allowedKeywords.some(keyword => 
            lowerQuestion.includes(keyword.toLowerCase())
        );
        
        // ブロックされた企業名のチェック
        const hasBlockedCompany = this.companyData.blockedCompanies.some(company => 
            lowerQuestion.includes(company.toLowerCase())
        );
        
        return hasAllowedKeyword && !hasBlockedCompany;
    }
    
    filterResponse(response) {
        if (!response || typeof response !== 'string') {
            return response;
        }
        
        const blockedCompanies = this.companyData.blockedCompanies;
        
        // 他社名が含まれていないかチェック
        for (let company of blockedCompanies) {
            if (response.toLowerCase().includes(company.toLowerCase())) {
                return '申し訳ございませんが、yodobloom SAKEに関する質問にのみお答えできます。🍶';
            }
        }
        
        return response;
    }
    
    getCompanyInfo() {
        return {
            name: this.companyData.basicInfo.name,
            location: this.companyData.basicInfo.location,
            phone: this.companyData.basicInfo.phone,
            hours: this.companyData.basicInfo.hours,
            website: this.companyData.basicInfo.website,
            description: this.companyData.basicInfo.description,
            services: this.companyData.services.map(service => ({
                name: service.name,
                description: service.description,
                features: service.features
            }))
        };
    }
    
    updateCompanyDisplay() {
        // ページ内の企業情報表示を更新
        this.updateCompanyName();
        this.updateCompanyDescription();
        this.updateContactInfo();
        this.updateBusinessHours();
    }
    
    updateCompanyName() {
        const companyNameElements = document.querySelectorAll('#companyName, .company-name');
        companyNameElements.forEach(element => {
            if (element) {
                element.textContent = this.companyData.basicInfo.name;
            }
        });
    }
    
    updateCompanyDescription() {
        const descriptionElements = document.querySelectorAll('#companyDescription, .company-description');
        descriptionElements.forEach(element => {
            if (element) {
                element.textContent = this.companyData.basicInfo.description;
            }
        });
    }
    
    updateContactInfo() {
        // 電話番号更新
        const phoneElements = document.querySelectorAll('#contactPhone, .contact-phone');
        phoneElements.forEach(element => {
            if (element) {
                element.textContent = this.companyData.basicInfo.phone;
            }
        });
        
        // 住所更新
        const addressElements = document.querySelectorAll('#contactAddress, .contact-address');
        addressElements.forEach(element => {
            if (element) {
                element.textContent = this.companyData.basicInfo.location;
            }
        });
    }
    
    updateBusinessHours() {
        const hoursElements = document.querySelectorAll('#businessHours, .business-hours');
        const hours = this.companyData.basicInfo.hours;
        const hoursText = `平日 ${hours.weekdays} | 土日祝日 ${hours.weekends} (最終入場 ${hours.lastEntry})`;
        
        hoursElements.forEach(element => {
            if (element) {
                element.textContent = hoursText;
            }
        });
    }
    
    getServiceByName(serviceName) {
        return this.companyData.services.find(service => 
            service.name.toLowerCase().includes(serviceName.toLowerCase())
        );
    }
    
    getAllServices() {
        return this.companyData.services;
    }
    
    isValidBusinessHours(currentTime = new Date()) {
        const hours = currentTime.getHours();
        const day = currentTime.getDay(); // 0=日曜日, 6=土曜日
        
        if (day === 0 || day === 6) {
            // 土日祝日: 10:00-22:00
            return hours >= 10 && hours < 22;
        } else {
            // 平日: 12:00-22:00
            return hours >= 12 && hours < 22;
        }
    }
    
    getBusinessStatus() {
        const isOpen = this.isValidBusinessHours();
        const hours = this.companyData.basicInfo.hours;
        
        return {
            isOpen: isOpen,
            status: isOpen ? '営業中' : '営業時間外',
            weekdayHours: hours.weekdays,
            weekendHours: hours.weekends,
            lastEntry: hours.lastEntry
        };
    }
}

// グローバル変数として設定
window.yodobloomCompanyManager = null;

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    window.yodobloomCompanyManager = new CompanyManager();
    
    // 企業情報の表示を更新
    if (window.yodobloomCompanyManager) {
        window.yodobloomCompanyManager.updateCompanyDisplay();
    }
    
    console.log('yodobloom SAKE Company Manager ready');
});

// 企業情報取得のヘルパー関数
function getYodobloomInfo() {
    if (window.yodobloomCompanyManager) {
        return window.yodobloomCompanyManager.getCompanyInfo();
    }
    return null;
}

function getYodobloomBusinessStatus() {
    if (window.yodobloomCompanyManager) {
        return window.yodobloomCompanyManager.getBusinessStatus();
    }
    return null;
}

function getYodobloomServices() {
    if (window.yodobloomCompanyManager) {
        return window.yodobloomCompanyManager.getAllServices();
    }
    return [];
}