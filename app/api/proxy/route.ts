import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {

  const body = await req.json()

  const api_url = process.env.MACHINA_CLIENT_URL

  const bearer = process.env.MACHINA_API_KEY

  if (!body.endpoint) {
    return NextResponse.json({ error: "Endpoint is required" }, { status: 400 });
  }

  if (!body.method) {
    return NextResponse.json({ error: "Method is required" }, { status: 400 });
  }

  try {

    const params: any = {
      method: body.method,
      headers: {
        "X-Api-Token": `${bearer}`,
        "Content-Type": "application/json",
        ...(body.headers || {})
      }
    }
    
    params['body'] = body.data
    
    const url = `${api_url}/${body.endpoint}`
    
    const response = await fetch(url, params);
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}