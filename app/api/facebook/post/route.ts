// app/api/facebook/post/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  const PAGE_ID = process.env.FACEBOOK_PAGE_ID;
  const USER_TOKEN = process.env.FACEBOOK_PAGE_TOKEN; // C'est probablement un user token

  if (!PAGE_ID || !USER_TOKEN) {
    return NextResponse.json(
      { error: "Missing PAGE_ID or TOKEN" },
      { status: 500 }
    );
  }

  try {
    // ÉTAPE 1 : Obtenir le vrai Page Access Token
    const accountsRes = await fetch(
      `https://graph.facebook.com/me/accounts?access_token=${USER_TOKEN}`
    );

    const accountsData = await accountsRes.json();

    if (accountsData.error) {
      return NextResponse.json({
        error: "Erreur lors de la récupération du Page Token",
        details: accountsData.error
      }, { status: 400 });
    }

    // Trouver le token de votre page spécifique
    const pageData = accountsData.data?.find(
      (page: { id: string }) => page.id === PAGE_ID
    );

    if (!pageData) {
      return NextResponse.json({
        error: `Page ${PAGE_ID} non trouvée. Pages disponibles: ${accountsData.data?.map((p: { name: string }) => p.name).join(", ")}`
      }, { status: 404 });
    }

    const PAGE_TOKEN = pageData.access_token;

    // ÉTAPE 2 : Publier avec le vrai Page Token
    const message = "Test depuis Next.js 🚀 (mode DEV)";

    const postRes = await fetch(
      `https://graph.facebook.com/${PAGE_ID}/feed`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          access_token: PAGE_TOKEN,
        }),
      }
    );

    const postData = await postRes.json();

    if (postData.error) {
      return NextResponse.json({ error: postData.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      result: postData,
      pageInfo: { name: pageData.name, id: pageData.id }
    });

  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
