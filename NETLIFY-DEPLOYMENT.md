# Netlify デプロイメントガイド

## 🚀 デプロイ手順

### 1. Netlifyアカウント準備
- [Netlify](https://netlify.com) でアカウント作成/ログイン
- GitHubリポジトリとの連携設定

### 2. サイト設定
```bash
# デプロイ用コマンド
npm run deploy:preview  # プレビューデプロイ
npm run deploy          # 本番デプロイ
```

### 3. 必須環境変数設定
Netlify管理画面の「Site Settings > Environment Variables」で以下を設定：

```
OPENAI_API_KEY=your-openai-api-key-here

DEEPL_API_KEY=your-deepl-api-key-here

NODE_ENV=production
```

### 4. ビルド設定
- **Build Command**: `npm run build`
- **Publish Directory**: `.`
- **Functions Directory**: `netlify/functions`

### 5. 機能確認項目
✅ AIサクラチャットボット（GPT-4）
✅ DeepL翻訳機能
✅ Google翻訳（サイト全体）
✅ レスポンシブデザイン
✅ 6言語対応（日本語、英語、中国語、韓国語、ベトナム語、フランス語）

## 🌐 API構成

### Netlify Functions
- `/.netlify/functions/openai-chat` - GPT-4チャットボット
- `/.netlify/functions/deepl-translate` - DeepL翻訳サービス

### セキュリティ機能
- CORS設定済み
- 環境変数によるAPIキー保護
- レート制限実装済み

## 🔧 トラブルシューティング

### デプロイエラーの場合
1. 環境変数が正しく設定されているか確認
2. Functionsディレクトリが正しく設定されているか確認
3. 依存関係が最新か確認

### API機能が動作しない場合
1. Netlify Functions Logを確認
2. APIキーの有効性を確認
3. CORS設定を確認

## 📝 更新手順
1. ローカルで変更作成
2. `npm run deploy:preview` でプレビュー確認
3. 問題なければ `npm run deploy` で本番反映