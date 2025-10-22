import { NextResponse } from "next/server";

let apiKeys: any[] = [];

export async function PATCH(req: Request, { params }: any) {
  const body = await req.json();
  const id = params.id;
  apiKeys = apiKeys.map(k => k.id === id ? { ...k, ...body, updatedAt: new Date().toISOString() } : k);
  const updated = apiKeys.find(k => k.id === id);
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: any) {
  const id = params.id;
  apiKeys = apiKeys.filter(k => k.id !== id);
  return new NextResponse(null, { status: 204 });
}
