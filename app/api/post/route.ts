import { NextResponse } from 'next/server';

// メモリ内にデータを保持するための配列
let entries: Array<any> = [];

// APIハンドラ
export async function GET() {
  return NextResponse.json(entries);
}

export async function POST(req: Request) {
  const newEntry = await req.json();
  entries.push(newEntry);
  return NextResponse.json(newEntry, { status: 201 });
}

export async function PUT(req: Request) {
  const updatedEntry = await req.json();
  entries = entries.map(entry => (entry.id === updatedEntry.id ? updatedEntry : entry));
  return NextResponse.json(updatedEntry);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  entries = entries.filter(entry => entry.id !== id);
  return NextResponse.json(null, { status: 204 }); // No Content
}
