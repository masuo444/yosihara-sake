// Sake detail data
const sakeData = {
    'narutotai-led': {
        name: '鳴門鯛 LED（レッド）',
        type: '純米吟醸',
        description: 'LED照射による独自酵母で生まれたモダンな味わい。Kura Masterプラチナ賞受賞。',
        image: '鳴門鯛 LED（レッド）（本家松浦酒造・徳島）.JPG',
        brewery: '本家松浦酒造・徳島',
        polishingRatio: '58%',
        alcoholContent: '15%',
        sakeMeter: '−20',
        acidity: '2.8',
        hasAward: true,
        overview: `<p>徳島県産「あわいちば山田錦」100%、LED夢酵母（3826 Type2）使用の全徳島仕込み。</p>
                   <p><strong>受賞歴:</strong> Kura Masterプラチナ賞、IWC銀賞ほか国内外で受賞歴多数。ANA機内食採用。</p>`,
        taste: `<p><strong>香り:</strong> りんごやトロピカルフルーツの甘香</p>
                <p><strong>味わい:</strong> ヨーグルト系の酸、リッチな酸味と重層的な旨味</p>
                <p><strong>特徴:</strong> 緻密な酸設計による爽快な酸味と控えめな甘さの調和</p>`,
        pairing: `<p><strong>おすすめ温度:</strong> よく冷やして（8〜12℃）</p>
                  <p><strong>グラス:</strong> ワイングラス推奨</p>
                  <p><strong>相性の良い料理:</strong> 前菜、チーズ、刺身</p>
                  <p><strong>プロコメント:</strong> 酸味系が好みの方に特におすすめ。食事シーンを格上げする一本。</p>`,
        breweryInfo: `<p>本家松浦酒造は徳島県に位置し、LED技術を活用した革新的な酒造りで知られています。伝統と革新を融合させた独自の製法により、世界的な評価を受けています。</p>`
    },
    'yusei': {
        name: '純米大吟醸 悠星（ゆうせい）',
        type: '純米大吟醸',
        description: '星が瞬く瀬戸内の夜と厳島神社をイメージした上品な一本。ジューシーなメロン香が特徴。',
        image: '純米大吟醸 悠星（ゆうせい）720ml（白牡丹酒造・広島）.JPG',
        brewery: '白牡丹酒造・広島',
        polishingRatio: '50%',
        alcoholContent: '15%',
        sakeMeter: '＋0.5',
        acidity: '1.6',
        hasAward: false,
        overview: `<p>広島産八反35号、広島令和一号酵母使用。星が瞬く瀬戸内の夜と厳島神社の大鳥居をイメージしたラベル。</p>
                   <p><strong>デザイン:</strong> 物語性の高い美しいボトル。贈り物や特別な日に最適。</p>`,
        taste: `<p><strong>香り:</strong> ジューシーなメロン香</p>
                <p><strong>味わい:</strong> 八反35号らしいさっぱりとした後口のキレ</p>
                <p><strong>余韻:</strong> 優雅な広がり</p>`,
        pairing: `<p><strong>おすすめ温度:</strong> よく冷やすか常温で</p>
                  <p><strong>相性の良い料理:</strong> 魚介、豆腐料理、淡麗な和食</p>
                  <p><strong>プロコメント:</strong> 洗練された香りとキレの良さが特徴。軽快な和食とのペアリングを重視する方におすすめ。</p>`,
        breweryInfo: `<p>白牡丹酒造は広島県の老舗蔵元。瀬戸内の豊かな自然環境を活かし、地元の米と水にこだわった酒造りを行っています。</p>`
    },
    'reiwa-ichigo': {
        name: '純米大吟醸 令和一号酵母',
        type: '純米大吟醸',
        description: '広島県開発の令和一号酵母で醸造。果実様の香りが特徴の優雅な仕上がり。',
        image: '純米大吟醸 令和一号酵母（れいわいちごうこうぼ）720ml（白牡丹酒造・広島）.JPG',
        brewery: '白牡丹酒造・広島',
        polishingRatio: '50%',
        alcoholContent: '15%',
        sakeMeter: '−',
        acidity: '−',
        hasAward: false,
        overview: `<p>酒造好適米「山田錦」を精米歩合50％まで磨き、広島県が開発した「令和一号酵母」で醸造。</p>
                   <p><strong>特徴:</strong> 果実香を主軸に、米の膨らみがしっかり支えるバランス構造。</p>`,
        taste: `<p><strong>香り:</strong> 柔らかなメロンやライチを思わせる果実香</p>
                <p><strong>味わい:</strong> 上品な甘みと滑らかな口当たり</p>
                <p><strong>後味:</strong> 穏やかな酸が後味を引き締める</p>`,
        pairing: `<p><strong>おすすめ温度:</strong> 10～12℃程度によく冷やして</p>
                  <p><strong>相性の良い料理:</strong> 白身魚や貝類の刺身、酒盗、浅漬け</p>
                  <p><strong>プロコメント:</strong> 開栓直後から立ち上がる香りを楽しみ、一口目から満足感。常温に戻すとさらに甘みと旨みが膨らむ。</p>`,
        breweryInfo: `<p>白牡丹酒造は、最新の技術と伝統的な製法を融合させた酒造りを行っています。令和一号酵母は広島県との共同開発により生まれました。</p>`
    },
    'hyakumoku': {
        name: '百黙 純米大吟醸',
        type: '純米大吟醸',
        description: '特A地区山田錦使用。洋梨→プラム→黄桃と続く果実香が魅力。菊正宗の技術が光る逸品。',
        image: '百黙 純米大吟醸 720ml（菊正宗・兵庫）.WEBP',
        brewery: '菊正宗・兵庫',
        polishingRatio: '59%',
        alcoholContent: '15%',
        sakeMeter: '−',
        acidity: '−',
        hasAward: false,
        overview: `<p>兵庫県三木市吉川町の特A地区山田錦を59％まで磨いた純米大吟醸。契約栽培米と「宮水」使用。</p>
                   <p><strong>特徴:</strong> 華やかな果実香に、緻密な構成。現代的な純米大吟醸の代表格。</p>`,
        taste: `<p><strong>香り:</strong> 洋梨→プラム→黄桃と柔らかく続く果実香</p>
                <p><strong>味わい:</strong> 旨味と酸のバランスが良く、穏やかでキレのある後口</p>
                <p><strong>特徴:</strong> 果実の甘みを想起させつつ酸で締めるスタイル</p>`,
        pairing: `<p><strong>おすすめ温度:</strong> 8～10℃でフルーティーに、15℃前後で味の厚みが増す</p>
                  <p><strong>相性の良い料理:</strong> 魚介のカルパッチョ、白身の塩焼き、クリーム系パスタ</p>
                  <p><strong>プロコメント:</strong> 冷やし方次第で表情を変える柔軟性が◎。</p>`,
        breweryInfo: `<p>菊正宗は江戸時代から続く老舗蔵元。「百黙」シリーズは、職人の技と最新技術を融合させた新しい挑戦です。</p>`
    },
    'hyakumoku-alt3': {
        name: '百黙 Alt.3（オルトスリー）',
        type: '純米ブレンド',
        description: '「第三の選択」を意味する特別ブレンド。グランクリュ級山田錦の複層的な味わい。',
        image: '百黙 Alt.3（オルトスリー）720ml（菊正宗・兵庫）.JPG',
        brewery: '菊正宗・兵庫',
        polishingRatio: '−',
        alcoholContent: '15%',
        sakeMeter: '−',
        acidity: '−',
        hasAward: false,
        overview: `<p>特A地区山田錦による複数の純米原酒を、熟練ブレンダーがブレンドして仕上げた逸品。</p>
                   <p><strong>コンセプト:</strong> 「第三の選択」を意味する特別なブレンド酒。</p>`,
        taste: `<p><strong>香り:</strong> 華やかでありながら、甘さ・苦味・フレッシュさ・丸みが融合</p>
                <p><strong>味わい:</strong> 複層的な味、ブレンドによる味の厚みと複雑性</p>
                <p><strong>特徴:</strong> 他の百黙シリーズより引き締まった苦味がアクセント</p>`,
        pairing: `<p><strong>おすすめ温度:</strong> 冷やしめ（8～12℃）で香りと果実感、常温～15℃で全体のバランス</p>
                  <p><strong>相性の良い料理:</strong> 生ハム、ナッツ、熟成チーズ</p>
                  <p><strong>プロコメント:</strong> お酒単体での"余韻を愉しむ"シーンにも映える重量感です。</p>`,
        breweryInfo: `<p>菊正宗の「百黙」シリーズの中でも特に革新的な一本。ブレンド技術により、単一の純米酒では表現できない複雑性を実現しています。</p>`
    },
    'souka': {
        name: '超特撰 惣花（そうか）純米大吟醸',
        type: '純米大吟醸',
        description: '特A地区の上質な山田錦使用。木箱入りで贈答にも最適な最高ランク商品。',
        image: '超特撰 惣花（そうか） 純米大吟醸 木箱入り 720ml（永澤酒造・兵庫・吉川町 特A地区山田錦）.jpg',
        brewery: '永澤酒造・兵庫',
        polishingRatio: '50%以下',
        alcoholContent: '15%',
        sakeMeter: '−',
        acidity: '−',
        hasAward: false,
        overview: `<p>特A地区の上質な山田錦を50%以下に磨いて仕込み。木箱入りで贈答にも最適とされる最高ランク商品。</p>
                   <p><strong>パッケージ:</strong> 高級感のある木箱入り。特別な贈り物に最適。</p>`,
        taste: `<p><strong>香り:</strong> 白桃やマスカットの上品な香り</p>
                <p><strong>味わい:</strong> キレの良い酸味がありつつ丸く甘い余韻</p>
                <p><strong>特徴:</strong> 無駄のない構成と透明感、しかし重量感ある口当たりのギャップ</p>`,
        pairing: `<p><strong>おすすめ温度:</strong> 8〜12℃に冷やして</p>
                  <p><strong>相性の良い料理:</strong> てんぷら、お造り、白身魚</p>
                  <p><strong>プロコメント:</strong> 贈答用ゆえの上質さを感じさせる一本。ワイングラスでじっくり楽しむのが◎。</p>`,
        breweryInfo: `<p>永澤酒造は兵庫県の蔵元で、特A地区山田錦にこだわった高品質な酒造りを行っています。</p>`
    },
    'nama': {
        name: '純米大吟醸 生酒',
        type: '純米大吟醸生酒',
        description: '青リンゴ・洋梨の香り、爽やかな甘さが特徴。フレッシュで瑞々しい生酒の魅力。',
        image: '純米大吟醸 生酒 720ml.jpg',
        brewery: '−',
        polishingRatio: '−',
        alcoholContent: '15%',
        sakeMeter: '−',
        acidity: '−',
        hasAward: false,
        overview: `<p>火入れを行わない生酒ならではのフレッシュで瑞々しい香り。控えめな甘と酸のバランスが特徴。</p>
                   <p><strong>特徴:</strong> フレッシュさと透明感が際立つ軽やかな生酒。</p>`,
        taste: `<p><strong>香り:</strong> 青リンゴや洋梨を彷彿とさせるフレッシュで瑞々しい香り</p>
                <p><strong>味わい:</strong> 控えめな甘味と酸のバランス</p>
                <p><strong>特徴:</strong> 酸味と甘味、どちらにも寄りすぎず中庸に整った軽やかさ</p>`,
        pairing: `<p><strong>おすすめ温度:</strong> やや低温で、生酒ならではの爽快さを引き立てて</p>
                  <p><strong>相性の良い料理:</strong> 春夏の魚介、フルーツ系デザート、和洋折衷の軽食</p>
                  <p><strong>プロコメント:</strong> 日常に取り入れやすいバランス型。</p>`,
        breweryInfo: `<p>生酒は、火入れ（加熱処理）を行わないことで、フレッシュな味わいを保っています。要冷蔵での管理が必要です。</p>`
    },
    'ryugagotoku': {
        name: '龍が如く 純米大吟醸 無濾過原酒',
        type: '純米大吟醸無濾過原酒',
        description: '全国新酒鑑評会で最多49回金賞の土佐鶴。しぼりたての味をそのまま封じ込めた力強い一本。',
        image: '純米大吟醸 無濾過原酒　龍が如く（土佐鶴酒造・高知.jpg',
        brewery: '土佐鶴酒造・高知',
        polishingRatio: '50%以下',
        alcoholContent: '17%',
        sakeMeter: '−',
        acidity: '−',
        hasAward: true,
        overview: `<p>酒造好適米を50%以下に精米、無濾過原酒のため加水なし、しぼりたての味をそのまま封じ込め。</p>
                   <p><strong>蔵元実績:</strong> 全国新酒鑑評会で最多49回金賞を誇る土佐鶴の代表格。</p>`,
        taste: `<p><strong>香り:</strong> 麹の厚みとお米の甘味が豊か</p>
                <p><strong>味わい:</strong> 無濾過ならではのふくらみある旨味に、酸味と若干の苦味が混ざり厚みある味わい</p>
                <p><strong>特徴:</strong> ダイナミックな味わいと余韻</p>`,
        pairing: `<p><strong>おすすめ温度:</strong> 12〜15℃でじっくりと</p>
                  <p><strong>相性の良い料理:</strong> 脂のある刺身や焼き魚（サバ、ブリ）、味噌仕立ての煮物</p>
                  <p><strong>プロコメント:</strong> 開栓直後は荒さ感じるかもしれませんが、数日経つと丸くなり深みが増します。</p>`,
        breweryInfo: `<p>土佐鶴酒造は高知県の名門蔵元。全国新酒鑑評会で最多49回の金賞受賞という偉業を達成しています。</p>`
    },
    'azure': {
        name: '吟醸酒 アジュール',
        type: '吟醸酒',
        description: '青いボトルが美しい軽やかなドライ感。azure（群青色）を思わせる爽快な味わい。',
        image: '吟醸酒 アジュール 720ml（土佐鶴酒造・高知）.jpg',
        brewery: '土佐鶴酒造・高知',
        polishingRatio: '−',
        alcoholContent: '13%台',
        sakeMeter: '−',
        acidity: '−',
        hasAward: false,
        overview: `<p>吟醸規格、アルコール度13%台で軽やかなドライ感、青いボトルが特徴的。</p>
                   <p><strong>蔵元実績:</strong> 土佐鶴は最多49回金賞受賞の実力蔵。本品もその品質を継承。</p>`,
        taste: `<p><strong>香り:</strong> azure（群青色）を思わせる爽快な青リンゴ、白ブドウの香り</p>
                <p><strong>味わい:</strong> スッキリとした余韻、シャープなキレ</p>
                <p><strong>特徴:</strong> 氷水に浮かべても似合うシャープなキレ</p>`,
        pairing: `<p><strong>おすすめ温度:</strong> しっかり冷やして</p>
                  <p><strong>相性の良い料理:</strong> 魚のマリネ、寿司、軽い前菜やサラダ</p>
                  <p><strong>プロコメント:</strong> 夏場の爽酒として最適で、和だけでなく軽い洋食にも馴染むデザイン性と味わい。</p>`,
        breweryInfo: `<p>土佐鶴酒造は、伝統的な技術を守りながら、現代的な味わいの酒造りにも挑戦しています。</p>`
    }
};

// Get sake ID from URL parameter
function getSakeIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Load sake data
function loadSakeData() {
    const sakeId = getSakeIdFromUrl();
    const sake = sakeData[sakeId];
    
    if (!sake) {
        // Redirect to home if sake not found
        window.location.href = 'index.html';
        return;
    }
    
    // Update page title
    document.title = `${sake.name} | yodobloom SAKE`;
    
    // Update main info
    document.getElementById('sakeImage').src = sake.image;
    document.getElementById('sakeImage').alt = sake.name;
    document.getElementById('sakeName').textContent = sake.name;
    document.getElementById('sakeType').textContent = sake.type;
    document.getElementById('sakeDescription').textContent = sake.description;
    
    // Update specs
    document.getElementById('brewery').textContent = sake.brewery;
    document.getElementById('polishingRatio').textContent = sake.polishingRatio;
    document.getElementById('alcoholContent').textContent = sake.alcoholContent;
    document.getElementById('sakeMeter').textContent = sake.sakeMeter;
    document.getElementById('acidity').textContent = sake.acidity;
    
    // Show award badge if applicable
    if (sake.hasAward) {
        document.getElementById('awardBadge').style.display = 'block';
    }
    
    // Update tab content
    document.getElementById('overviewContent').innerHTML = sake.overview;
    document.getElementById('tasteContent').innerHTML = sake.taste;
    document.getElementById('pairingContent').innerHTML = sake.pairing;
    document.getElementById('breweryContent').innerHTML = sake.breweryInfo;
}

// Tab functionality
function initTabs() {
    const tabButtons = document.querySelectorAll('.detail-tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            button.classList.add('active');
            document.querySelector(`.tab-pane[data-tab="${targetTab}"]`).classList.add('active');
        });
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadSakeData();
    initTabs();
});