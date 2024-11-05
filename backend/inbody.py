import cv2
import numpy as np
import os

def extract_largest_contour_region(image_path, output_path='output_image.jpg'):
    # 画像の読み込み
    image = cv2.imread(image_path)

    # 画像が正常に読み込まれたか確認
    if image is None:
        raise ValueError(f"Could not open or find the image: {image_path}")

    # グレースケールに変換
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # しきい値処理
    _, binary_image = cv2.threshold(gray_image, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

    # 輪郭検出
    contours, _ = cv2.findContours(binary_image, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # 最大面積の輪郭を見つける
    max_contour = None
    max_area = 0

    for contour in contours:
        area = cv2.contourArea(contour)
        if area > max_area:
            max_area = area
            max_contour = contour

    # 最大面積の輪郭が見つからなかった場合
    if max_contour is None:
        raise ValueError("No contours found.")

    # 最大面積の輪郭の外接矩形を取得
    x, y, w, h = cv2.boundingRect(max_contour)

    # 最大領域を含む画像を切り出し
    max_region = image[y:y+h, x:x+w]

    # 切り出した領域を新しい画像として保存
    cv2.imwrite(output_path, max_region)

    return output_path

def detect_numbers(image_path):
    # テンプレート画像のパス
    template_folder = 'backend/temp'
    template_files = [f"tem ({i}).png" for i in range(1, 45)]
    templates = {}
    labels = [2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 9, 0, 0, 1, 1, 1]

    # テンプレート画像の読み込み
    for file in template_files:
        template_path = os.path.join(template_folder, file)
        template_image = cv2.imread(template_path, cv2.IMREAD_GRAYSCALE)
        
        # ファイル名からテンプレート番号を抽出
        try:
            number = int(file.split('(')[1].split(')')[0])
        except ValueError as e:
            print(f"Error extracting number from file name '{file}': {e}")
            continue
        
        templates[number] = template_image

    # 入力画像の読み込みと二値化
    input_image = cv2.imread(image_path)

    # エラーチェック
    if input_image is None:
        print(f"Error: Image file '{image_path}' not found or unable to read.")
        return []

    gray_input = cv2.cvtColor(input_image, cv2.COLOR_BGR2GRAY)
    _, binary_input = cv2.threshold(gray_input, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

    # 画像の幅と高さを取得
    height, width = binary_input.shape

    # 左側40%の部分を切り取る
    left_width = int(width * 0.4)
    binary_input_left = binary_input[:, :left_width]
    input_image_left = input_image[:, :left_width]

    # テンプレートマッチングと数字の検出
    detected_numbers = []
    for number, template in templates.items():
        result = cv2.matchTemplate(binary_input_left, template, cv2.TM_CCOEFF_NORMED)
        _, max_val, _, max_loc = cv2.minMaxLoc(result)
        
        # テンプレートが検出された場合
        if max_val > 0.8:  # 閾値は調整が必要かもしれません
            detected_numbers.append((number, max_val, max_loc))
    
    # 最もスコアが高いテンプレートを選択
    def is_close(pos1, pos2, threshold=10):
        return abs(pos1[0] - pos2[0]) < threshold and abs(pos1[1] - pos2[1]) < threshold

    filtered_numbers = []
    seen_positions = set()  # 処理済みの位置を記録するためのセット

    for number, max_val, pos in detected_numbers:
        x, y = pos
        if not any(is_close(pos, p) for _, _, p in filtered_numbers):
            # labelsを参照して数字を取得
            label_number = labels[number] if number < len(labels) else None
            if label_number is not None:
                filtered_numbers.append((label_number, max_val, pos))
                seen_positions.add((x, y))
        else:
            # 同じ位置でより高いスコアのテンプレートを選択する
            for i, (_, existing_max_val, existing_pos) in enumerate(filtered_numbers):
                if is_close(pos, existing_pos) and max_val > existing_max_val:
                    label_number = labels[number] if number < len(labels) else None
                    if label_number is not None:
                        filtered_numbers[i] = (label_number, max_val, pos)
                    break

    # 最もスコアが高いテンプレートを選んだ結果をY座標が小さい順、同じ場合はX座標が小さい順にソート
    filtered_numbers.sort(key=lambda x: (x[2][1], x[2][0]))

    # 最後の部分
    detected_list = []
    for number, _, pos in filtered_numbers:
        detected_list.append(number)

    # リストをJSON形式で出力
    import json
    print(json.dumps(detected_list))
    
    return  detected_list


