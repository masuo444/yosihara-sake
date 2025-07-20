# Netlify環境変数設定手順

公式サイトでチャットボット（GPT + DeepL）を動作させるために、以下の環境変数をNetlifyに設定してください。

## 1. Netlifyダッシュボードでの設定

1. [Netlify Dashboard](https://app.netlify.com/) にログイン
2. 「yosihara-sake」サイトを選択
3. **Site settings** → **Environment variables** に移動
4. **Add variable** をクリックして以下を追加：

## 2. 必要な環境変数

### OpenAI API（チャットボット機能）
```
Key: OPENAI_API_KEY
Value: sk-xxxxxxxxxxxxxxxxxx...
```

### DeepL API（翻訳機能）
```
Key: DEEPL_API_KEY  
Value: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx:fx
```

## 3. API キーの取得方法

### OpenAI APIキー
1. [OpenAI Platform](https://platform.openai.com/) にログイン
2. **API keys** → **Create new secret key**
3. 生成されたキーをコピー（`sk-`で始まる）

### DeepL APIキー
1. [DeepL API](https://www.deepl.com/ja/pro-api) に登録
2. 無料プランでも月50万文字まで利用可能
3. APIキーを取得（`:fx`で終わる）

## 4. 設定後の動作確認

環境変数設定後、Netlifyで自動再デプロイが実行されます：
- チャットボットでGPT機能が利用可能
- 多言語翻訳機能が有効
- ヘッダーのGoogle翻訳ボタンが表示

## セキュリティ注意事項

- APIキーは絶対に公開しないでください
- Gitリポジトリにはコミットしないでください
- 定期的にAPIキーをローテーションしてください

設定完了後、サイトの動作を確認してください。