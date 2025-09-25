#upload
from flask import Flask, request, jsonify
import os
from inbody import detect_numbers
from inbody import extract_largest_contour_region 
from flask_cors import CORS  # CORSをインポート
import uuid  # 一意のファイル名を作成するためにuuidをインポート

app = Flask(__name__)

# CORSを有効にして、全てのオリジンからのアクセスを許可
CORS(app)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    """許可されたファイルタイプかどうかを判定する関数"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/backend/upload', methods=['POST'])
def upload_image():
    """画像アップロードのエンドポイント"""
    if 'image' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        # ファイル名にUUIDを付けて一意にする
        filename = str(uuid.uuid4()) + '.' + file.filename.rsplit('.', 1)[1].lower()
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        if not os.path.exists(app.config['UPLOAD_FOLDER']):
            os.makedirs(app.config['UPLOAD_FOLDER'])  # アップロード先ディレクトリがなければ作成
        
        file.save(file_path)
        
        # 画像処理を実行（detect_numbers関数）
        image_path_with_contours = extract_largest_contour_region(file_path)  # 輪郭を検出した画像のパスを取得
        result = detect_numbers(image_path_with_contours)  # 輪郭描画済み画像をdetect_numbersに渡す
        return jsonify(result)
    
    return jsonify({'error': 'File type not allowed'}), 400

# アプリケーションを実行
if __name__ == '__main__':
    app.run(debug=True)
