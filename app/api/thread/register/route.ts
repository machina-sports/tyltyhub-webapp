import { NextResponse } from "next/server";
import { getBrandConfig } from "@/config/brands";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const { agentId, userId, metadata } = body;

    const apiUrl = process.env.MACHINA_CLIENT_URL;
    const apiKey = process.env.MACHINA_API_KEY;

    if (!apiUrl) {
      return NextResponse.json(
        { error: "API URL not configured" },
        { status: 500 }
      );
    }

    const documentUrl = `${apiUrl}/document`;

    // Resolve brand and welcome message
    const brand = getBrandConfig(process.env.NEXT_PUBLIC_BRAND);
    const assistantName = brand.id === 'sportingbet' ? 'SportingBOT' : 'Bot And Win';
    const welcomeMessage = brand.id === 'sportingbet'
      ? "Olá! Eu sou o SportingBOT, seu assistente de apostas esportivas. Considere perguntar sobre partidas, odds, estatísticas e muito mais. Como posso ajudar?"
      : "¡Hola! Soy Bot And Win, tu asistente de apuestas deportivas. Puedo ayudarte con información sobre partidos, cuotas, estadísticas y mucho más. ¿En qué puedo ayudarte?";

    const requestBody = {
      name: "thread",
      metadata: {
        agent_id: agentId,
        user_id: userId || "anonymous",
        created_at: new Date().toISOString(),
        ...metadata
      },
      value: {
        messages: [
          {
            role: "assistant",
            content: welcomeMessage,
            timestamp: new Date().toISOString()
          }
        ],
        status: "active",
        agent_id: agentId,
        assistant_name: assistantName
      }
    };

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (apiKey) {
      headers["X-Api-Token"] = apiKey;
    }

    const response = await fetch(documentUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    });

    const result = await response.json();

    if (result.status === true && result.data?._id) {
      return NextResponse.json({
        error: false,
        threadId: result.data._id
      });
    }

    console.error("Failed to register thread:", result);
    return NextResponse.json(
      { error: true, threadId: null },
      { status: 500 }
    );

  } catch (error) {
    console.error("Error registering thread:", error);
    return NextResponse.json(
      { error: true, threadId: null },
      { status: 500 }
    );
  }
}

