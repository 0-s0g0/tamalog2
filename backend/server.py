from flask import Flask, request, jsonify
import os
import cv2
import numpy as np

app = Flask(__name__)

@app.route('/process-image', methods=['POST'])
def process_image():
    # 画像ファイルの取得
    image_file = request.files.get('image')
    if not image_file:
        return jsonify({'error': 'No file uploaded'}), 400

    image_path = os.path.join('temp', image_file.filename)
    image_file.save(image_path)  # 一時的に画像を保存

    # 画像処理を呼び出す
    detected_numbers = detect_numbers(image_path)
    os.remove(image_path)  # 処理後に画像ファイルを削除

    return jsonify({'detected_numbers': detected_numbers})

def detect_numbers(image_path):
    # あなたの画像処理ロジックをここに追加
    # 例として空のリストを返す
    return []

if __name__ == '__main__':
    app.run(port=5000)  # Flaskサーバーを5000ポートで起動
