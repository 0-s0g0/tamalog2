# ベースとなるPythonのイメージを指定
FROM python:3.10-slim

# アプリケーションの作業ディレクトリを作成
WORKDIR /app

# 依存関係ファイルをコピー
COPY requirements.txt .

# 依存関係をインストール
# ※gunicornとopencv-python-headlessをrequirements.txtに追加してください
RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションのソースコードをコピー
COPY . .

# アップロード用のディレクトリを作成
RUN mkdir -p /app/uploads

# アプリケーションが使用するポートを公開
EXPOSE 5000

# アプリケーションを起動するコマンド
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "upload:app"]