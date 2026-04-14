import { NextResponse } from "next/server";

export async function GET() {
  const endpointUrl = process.env.DATABRICKS_ENDPOINT_URL;
  const token = process.env.DATABRICKS_TOKEN;

  if (!endpointUrl || !token) {
    return NextResponse.json(
      { error: "DATABRICKS_ENDPOINT_URL and DATABRICKS_TOKEN must be set in .env.local" },
      { status: 500 }
    );
  }

  const skillsUrl = endpointUrl.replace(/\/invocations\/?$/, "/skills");

  try {
    const upstream = await fetch(skillsUrl, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const body = await upstream.text();
    return new NextResponse(body, {
      status: upstream.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to reach skills endpoint: ${String(err)}` },
      { status: 502 }
    );
  }
}
