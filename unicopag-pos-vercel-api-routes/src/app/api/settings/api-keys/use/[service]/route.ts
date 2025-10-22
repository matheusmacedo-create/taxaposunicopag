import { NextResponse } from "next/server";

let apiKeys: any[] = [];

export async function GET(_: Request, { params }: any) {
  const service = params.service;
  const key = apiKeys.find(k => k.service === service && k.active);
  return NextResponse.json({ key: key?.key || null });
}
