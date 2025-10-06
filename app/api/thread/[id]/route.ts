import { NextRequest, NextResponse } from "next/server";

// Disable caching for this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const threadId = params.id;
    const apiUrl = process.env.MACHINA_CLIENT_URL;
    const apiKey = process.env.MACHINA_API_KEY;

    if (!apiUrl) {
      return NextResponse.json(
        { error: "API URL not configured" },
        { status: 500 }
      );
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (apiKey) {
      headers["X-Api-Token"] = apiKey;
    }

    // Get thread document from MongoDB
    const response = await fetch(`${apiUrl}/document/search`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        filters: { _id: threadId },
        page: 1,
        page_size: 1,
      }),
      cache: "no-store",
      next: { revalidate: 0 }
    });

    const result = await response.json();

    if (result.status && result.data && result.data.length > 0) {
      const thread = result.data[0];
      const messages = thread.value?.messages || [];

      return NextResponse.json({
        error: false,
        messages: messages,
      });
    }

    return NextResponse.json(
      { error: true, messages: [] },
      { status: 404 }
    );
  } catch (error) {
    console.error("Error retrieving thread:", error);
    return NextResponse.json(
      { error: true, messages: [] },
      { status: 500 }
    );
  }
}

