import { NextResponse } from "next/server";
import { setConfig, resetAllData } from "@/lib/db/queries";

export const dynamic = "force-static";

export async function GET() {
  return new NextResponse(null, { status: 405 });
}

export async function POST(request: Request) {
  const data = await request.json();

  if (data.model) await setConfig("model", data.model);

  await setConfig("capping", {
    headMessages: data.headMessages,
    tailMessages: data.tailMessages,
    middleSample: data.middleSample,
    maxTokens: data.maxTokens,
  });

  await setConfig("scan", {
    limit: data.scanLimit,
    maxAgeDays: data.scanMaxAgeDays,
  });

  return NextResponse.json({ saved: true });
}

export async function DELETE() {
  const result = await resetAllData();
  return NextResponse.json(result);
}
