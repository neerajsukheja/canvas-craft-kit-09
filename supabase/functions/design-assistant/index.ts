import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const SYSTEM_PROMPT = `You are an AI design assistant for a page builder. You receive the current page state (JSON) and a user prompt describing desired changes.

You must return a VALID JSON object representing the updated page state. The page has this structure:
{
  "id": string,
  "title": string,
  "templateName": string,
  "sections": [
    {
      "id": string,
      "name": string,
      "style": string,
      "components": [
        {
          "id": string,
          "type": "typography" | "button" | "card" | "container" | "grid" | "textfield" | "divider" | "avatar" | "image" | "list" | "stack" | "navbar" | "icon-card",
          "props": { ... },
          "layout": {
            "colSpan": 1-12,
            "colSpanMd": 1-12,
            "colSpanSm": 1-12,
            "minHeight": "auto" | "sm" | "md" | "lg" | "xl",
            "padding": "none" | "sm" | "md" | "lg" | "xl",
            "margin": "none" | "sm" | "md" | "lg",
            "alignSelf": "start" | "center" | "end" | "stretch"
          }
        }
      ],
      "layout": {
        "columns": 12,
        "gap": "none" | "sm" | "md" | "lg",
        "padding": "none" | "sm" | "md" | "lg" | "xl",
        "background": "transparent" | "white" | "light" | "dark" | "primary" | "primary-light" | "gold-light",
        "maxWidth": "sm" | "md" | "lg" | "xl" | "full",
        "minHeight": "auto" | "sm" | "md" | "lg"
      }
    }
  ]
}

Component props by type:
- typography: { text, variant (h1-h6/body1/body2/caption/overline), align (left/center/right), color (default/primary/muted/white/gold), weight (normal/medium/semibold/bold/extrabold) }
- button: { label, variant (primary/secondary/outline/ghost/link), size (sm/md/lg), fullWidth (boolean) }
- card: { title, description, cardStyle (default/bordered/elevated/flat/icon-top), icon (none/credit-card/shield/trending-up/home/dollar-sign/percent/piggy-bank/briefcase/star) }
- textfield: { label, placeholder, type (text/email/password/number) }
- divider: { thickness (thin/medium/thick), color (default/primary/gold/light) }
- image: { src (URL), alt, objectFit (cover/contain/fill), rounded (none/sm/md/lg/full) }
- list: { items (comma-separated), ordered (boolean), listStyle (default/checkmark/arrow/none) }
- stack: { direction (row/column), gap (sm/md/lg), align (start/center/end), wrap (boolean) }
- navbar: { brand, links (comma-separated), navStyle (primary/white/dark) }
- icon-card: { title, description, linkText, icon (credit-card/shield/trending-up/home/dollar-sign/percent/piggy-bank/briefcase/star/users/phone/globe) }
- avatar: { src, alt, size (sm/md/lg) }
- container: { maxWidth (sm/md/lg/xl/full), padding (none/sm/md/lg) }
- grid: { columns (1/2/3/4), gap (sm/md/lg) }

RULES:
1. Return ONLY the updated page JSON — no markdown, no code fences, no explanation.
2. Keep existing IDs unless adding new components (use format "comp-XXXX" or "section-XXXX" with random numbers).
3. Only modify what the user asks for. Preserve everything else.
4. If the user asks to add a section or component, create it with sensible defaults.
5. Make sure colSpan values add up properly within sections (total shouldn't exceed 12 per row).
6. Components support customCSS in layout (JSON object of CSS properties), textColor, bgColor, borderColorCustom for direct color values.
7. If the user attaches an image, analyze it to understand the desired layout/style and replicate it using the available components.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, pageState } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Process messages - handle both string and multimodal content
    const userMessages = messages.map((m: { role: string; content: any }) => ({
      role: m.role,
      content: m.content, // can be string or array of content parts
    }));

    // Inject the current page state into the latest user message
    const lastUserMsg = userMessages[userMessages.length - 1];
    const pageContext = `Current page state:\n${JSON.stringify(pageState, null, 2)}\n\nUser request: `;
    
    if (typeof lastUserMsg.content === 'string') {
      lastUserMsg.content = pageContext + lastUserMsg.content;
    } else if (Array.isArray(lastUserMsg.content)) {
      // Find the text part and prepend page state
      const textPart = lastUserMsg.content.find((p: any) => p.type === 'text');
      if (textPart) {
        textPart.text = pageContext + textPart.text;
      }
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...userMessages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("design-assistant error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
