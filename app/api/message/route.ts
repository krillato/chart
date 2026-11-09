import { NextResponse } from "next/server";

export type MessageType = {
  id: string;
  message: string;
  name: string;
};

let message: MessageType[] = [];

export function GET() {
  return NextResponse.json({ message });
}

export async function POST(request: Request) {
  const res = await request.json();
  if (!res.message || !res.name) {
    return NextResponse.json({ message: "Bad Request" }, { status: 400 });
  }
  message.push({
    id: crypto.randomUUID(),
    message: res.message,
    name: res.name,
  });
  return NextResponse.json({ message: "Created" }, { status: 201 });
}
