import formidable from 'formidable';

// APIルートの設定（Next.js 13以降の構文）
export const runtime = 'edge'; // Edge Runtimeを使用する場合

// POSTリクエストの処理
export default async function handler(req) {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();

    return new Promise((resolve, reject) => {
      form.parse(req, async (err, fields, files) => {
        if (err) {
          return reject({ status: 500, message: 'Error parsing the files.' });
        }

        const file = files.image; // アップロードされたファイルを取得

        // ファイルが存在するか確認
        if (!file) {
          return reject({ status: 400, message: 'No file uploaded.' });
        }

        const imagePath = file.filepath; // 画像のパスを取得

        // Flask APIにリクエストを送信
        const response = await fetch('http://localhost:5000/process-image', {
          method: 'POST',
          body: new FormData().append('image', file.filepath),
        });

        if (!response.ok) {
          return reject({ status: response.status, message: 'Failed to process image.' });
        }

        const data = await response.json();
        resolve(new Response(JSON.stringify(data), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }));
      });
    });
  } else {
    return new Response(`Method ${req.method} Not Allowed`, { status: 405 });
  }
}
