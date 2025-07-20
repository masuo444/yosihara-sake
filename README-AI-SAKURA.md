# 🌸 AIサクラ - 吉源酒造場専用チャットボット

## 概要

AIサクラは吉源酒造場のウェブサイト専用に開発された高度なAIチャットボットです。OpenAI GPT-4とDeepL翻訳APIを統合し、多言語対応と専門的な日本酒知識を提供します。

## 主な機能

### 🤖 AI機能
- **GPT-4統合**: OpenAI GPT-4による高度な自然言語処理
- **専門知識**: 吉源酒造場と日本酒に特化した知識ベース
- **会話記憶**: コンテキストを保持した自然な会話

### 🌐 多言語対応
- **4言語サポート**: 日本語、英語、韓国語、中国語
- **DeepL翻訳**: 高精度な自動翻訳
- **言語自動検出**: ユーザーの入力言語を自動判定

### 🎨 ユーザーインターフェース
- **和風デザイン**: 日本酒らしい上品なデザイン
- **レスポンシブ**: モバイルとデスクトップに最適化
- **アクセシビリティ**: 使いやすいインターフェース

### 🔊 音声機能
- **音声入力**: ブラウザの音声認識機能を活用
- **多言語音声認識**: 各言語での音声入力対応

## ファイル構成

```
/Users/masuo/Desktop/尾道の酒造/
├── js/
│   └── ai-sakura-chatbot.js     # メインチャットボット実装
├── css/
│   └── ai-sakura-chatbot.css    # チャットボット専用スタイル
├── api/
│   └── chatbot-proxy.js         # APIプロキシサーバー
├── .env.example                 # 環境変数設定例
├── package.json                 # Node.js依存関係
└── README-AI-SAKURA.md         # このファイル
```

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env`ファイルを作成し、APIキーを設定:

```bash
cp .env.example .env
```

`.env`ファイルを編集:

```env
OPENAI_API_KEY=sk-your-openai-api-key-here
DEEPL_API_KEY=your-deepl-api-key-here
PORT=3001
```

### 3. APIサーバーの起動

```bash
npm start
```

### 4. 開発モード

```bash
npm run dev
```

## API仕様

### チャット API

**エンドポイント**: `POST /api/chat`

**リクエスト**:
```json
{
  "message": "寿齢について教えてください",
  "conversationHistory": [
    {"role": "user", "content": "こんにちは"},
    {"role": "assistant", "content": "こんにちは！"}
  ]
}
```

**レスポンス**:
```json
{
  "success": true,
  "response": "寿齢は当蔵の代表銘柄で...",
  "usage": {
    "prompt_tokens": 150,
    "completion_tokens": 100,
    "total_tokens": 250
  }
}
```

### 翻訳 API

**エンドポイント**: `POST /api/translate`

**リクエスト**:
```json
{
  "text": "こんにちは",
  "targetLang": "EN",
  "sourceLang": "JA"
}
```

**レスポンス**:
```json
{
  "success": true,
  "translatedText": "Hello",
  "detectedSourceLang": "JA"
}
```

## 設定のカスタマイズ

### 酒造情報の更新

`brewery-template-config.json`を編集して酒造の基本情報を更新:

```json
{
  "brewery": {
    "name": "吉源酒造場",
    "address": "広島県尾道市三軒家町14-6",
    "phone": "0848-23-2771"
  },
  "products": [
    {
      "name": "寿齢特選",
      "description": "芳醇で深みがある味わい"
    }
  ]
}
```

### AIの応答をカスタマイズ

`ai-sakura-chatbot.js`の`buildSystemPrompt()`メソッドを編集:

```javascript
buildSystemPrompt() {
    return `あなたは「${this.breweryInfo.brewery.name}」の専門AIアシスタント「AIサクラ」です。
    
    【基本情報】
    - 創業: 安政元年（1854年）
    // カスタマイズ内容をここに追加
    `;
}
```

## セキュリティ機能

### レート制限
- 1時間あたり60リクエストの制限
- IPアドレスベースの制限

### 入力検証
- メッセージ長制限（1000文字）
- XSS攻撃防止
- SQLインジェクション防止

### API キー保護
- サーバーサイドでのAPIキー管理
- 環境変数による設定
- クライアントサイドにはAPIキーを露出しない

## パフォーマンス最適化

### フロントエンド
- 遅延読み込み
- アニメーション最適化
- モバイル最適化

### バックエンド
- レスポンスキャッシュ
- 会話履歴の制限
- エラーハンドリング

## トラブルシューティング

### よくある問題

1. **APIキーエラー**
   ```
   解決策: .envファイルのAPIキーを確認
   ```

2. **翻訳が動作しない**
   ```
   解決策: DeepL APIキーの有効性を確認
   ```

3. **音声認識が動作しない**
   ```
   解決策: HTTPSまたはlocalhostでのアクセスを確認
   ```

### ログの確認

```bash
# サーバーログの確認
npm start

# エラーログの確認
tail -f logs/error.log
```

## デプロイ

### Netlify デプロイ

```bash
npm run deploy
```

### 環境変数の設定

Netlifyの管理画面で以下を設定:
- `OPENAI_API_KEY`
- `DEEPL_API_KEY`

## ライセンス

MIT License

## サポート

技術的な問題やご質問がございましたら、以下までお問い合わせください：

- 吉源酒造場: 0848-23-2771
- メール: support@yoshigen.info

---

🌸 AIサクラは吉源酒造場の伝統と革新を結ぶデジタル体験を提供します。