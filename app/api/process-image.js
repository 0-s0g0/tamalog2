export const runtime = 'edge'; // Edge Runtimeを使用する場合

// POSTリクエストの処理
export default async function handler(req) {
  if (req.method === 'POST') {
    const formData = await req.formData(); // Edge RuntimeでFormDataを使う

    const file = formData.get('image'); // アップロードされたファイルを取得

    // ファイルが存在するか確認
    if (!file) {
      return new Response(JSON.stringify({ error: 'No file uploaded.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Flask APIにリクエストを送信
    const response = await fetch('http://localhost:5000/process-image', {
      method: 'POST',
      body: formData, // FormDataをそのまま渡す
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Failed to process image.' }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } else {
    return new Response(`Method ${req.method} Not Allowed`, { status: 405 });
  }
}
