import { NextResponse } from "next/server";

let apiKeys: any[] = [];

export async function GET() {
  return NextResponse.json(apiKeys);
}

export async function POST(req: Request) {
  const data = await req.json();
  const newKey = {
    id: crypto.randomUUID(),
    ...data,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  apiKeys.push(newKey);
  return NextResponse.json(newKey);
}
