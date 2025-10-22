import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

let apiKeys: any[] = [];

export async function GET() {
  return NextResponse.json(apiKeys);
}

export async function POST(req: Request) {
  const data = await req.json();
  const newKey = {
    id: uuidv4(),
    ...data,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  apiKeys.push(newKey);
  return NextResponse.json(newKey);
}
