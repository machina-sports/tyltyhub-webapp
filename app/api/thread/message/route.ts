import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    
    // Support both formats: direct threadId or context-agent
    const threadId = body.threadId || body["context-agent"]?.thread_id;
    const { message } = body;

    if (!threadId || !message) {
      return NextResponse.json(
        { error: "threadId and message are required" },
        { status: 400 }
      );
    }

    const apiUrl = process.env.MACHINA_CLIENT_URL;
    const apiKey = process.env.MACHINA_API_KEY;

    if (!apiUrl) {
      return NextResponse.json(
        { error: "API URL not configured" },
        { status: 500 }
      );
    }

    // First, get the current thread
    const getUrl = `${apiUrl}/document/search`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (apiKey) {
      headers["X-Api-Token"] = apiKey;
    }

    const getResponse = await fetch(getUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        filters: { _id: threadId },
        page: 1,
        page_size: 1
      }),
    });

    const threadResult = await getResponse.json();

    if (!threadResult.status || !threadResult.data || threadResult.data.length === 0) {
      return NextResponse.json(
        { error: "Thread not found" },
        { status: 404 }
      );
    }

    const threadData = threadResult.data[0];
    const threadValue = threadData.value || {};
    const currentMessages = threadValue.messages || [];

    // Add timestamp to message
    const messageWithTimestamp = {
      ...message,
      timestamp: new Date().toISOString()
    };

    // Append new message
    const updatedMessages = [...currentMessages, messageWithTimestamp];

    // Update thread
    const updateUrl = `${apiUrl}/document/${threadId}`;
    const updateResponse = await fetch(updateUrl, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        value: {
          ...threadValue,
          messages: updatedMessages,
          updated_at: new Date().toISOString()
        }
      })
    });

    const updateResult = await updateResponse.json();

    if (updateResult.status === true) {
      return NextResponse.json({
        error: false,
        message: "Message saved successfully"
      });
    }

    return NextResponse.json(
      { error: true, message: "Failed to save message" },
      { status: 500 }
    );

  } catch (error) {
    console.error("Error saving message to thread:", error);
    return NextResponse.json(
      { error: true, message: "Internal server error" },
      { status: 500 }
    );
  }
}

