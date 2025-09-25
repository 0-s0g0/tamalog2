# ベースとなるNode.jsのイメージを指定
FROM node:18-alpine

# アプリケーションの作業ディレクトリを作成
WORKDIR /app

# 依存関係ファイルを先にコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# アプリケーションのソースコードをコピー
COPY . .

# Next.jsアプリをビルド
RUN npm run build

# アプリケーションが使用するポートを公開
EXPOSE 3000

# アプリケーションを起動するコマンド
CMD ["npm", "start"]