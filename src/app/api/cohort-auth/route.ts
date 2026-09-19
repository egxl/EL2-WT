import { NextResponse } from "next/server";
import { hashString } from "@/lib/cohort-auth";

const SERVER_PASSWORD = (
  process.env.COHORT_PASSWORD ||
  process.env.NEXT_PUBLIC_COHORT_PASSWORD ||
  "elemen2"
).trim();

export async function GET() {
  const hash = hashString(`elemen2_cohort_salt_${SERVER_PASSWORD}`);
  const hasCustom = Boolean(
    process.env.COHORT_PASSWORD || process.env.NEXT_PUBLIC_COHORT_PASSWORD
  );

  return NextResponse.json(
    {
      serverPasswordHash: hash,
      hasCustomServerPassword: hasCustom,
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { password } = body;

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, error: "Password is required" },
        { status: 400 }
      );
    }

    const isValid = password.trim() === SERVER_PASSWORD;
    const token = hashString(`elemen2_cohort_salt_${SERVER_PASSWORD}`);

    return NextResponse.json({
      success: isValid,
      token: isValid ? token : null,
      error: isValid ? undefined : "Incorrect password",
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request payload" },
      { status: 400 }
    );
  }
}
