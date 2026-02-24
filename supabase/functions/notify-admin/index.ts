import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    const anonKey = Deno.env.get("SUPABASE_PUBLISHABLE_KEY") || Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      anonKey,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } =
      await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    const userId = claimsData.claims.sub;
    const userEmail = claimsData.claims.email;

    const { title, description, reference_urls } = await req.json();

    // Insert the thumbnail request
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: request, error: insertError } = await serviceClient
      .from("thumbnail_requests")
      .insert({
        user_id: userId,
        title,
        description,
        reference_urls: reference_urls || [],
        status: "pending",
      })
      .select()
      .single();

    if (insertError) {
      return new Response(JSON.stringify({ error: insertError.message }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Deduct credits
    await serviceClient.rpc("deduct_credits", {
      p_user_id: userId,
      p_amount: 10,
    });

    // Send email notification to admin
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const adminEmail = "naveensalviai@gmail.com";
    const adminPhone = "+919358935758";

    if (RESEND_API_KEY) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "AntiGeneric AI <onboarding@resend.dev>",
            to: [adminEmail],
            subject: `New Thumbnail Request: ${title}`,
            html: `
              <h2>New Thumbnail Request</h2>
              <p><strong>From:</strong> ${userEmail}</p>
              <p><strong>Title:</strong> ${title}</p>
              <p><strong>Description:</strong> ${description || "N/A"}</p>
              <p><strong>Reference URLs:</strong> ${reference_urls?.join(", ") || "None"}</p>
              <p><strong>Request ID:</strong> ${request.id}</p>
              <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            `,
          }),
        });
      } catch (emailError) {
        console.error("Email send failed:", emailError);
      }
    }

    // Send WhatsApp notification via wa.me link (log it for now)
    const whatsappMsg = encodeURIComponent(
      `🎨 New Thumbnail Request!\n\nFrom: ${userEmail}\nTitle: ${title}\nDescription: ${description || "N/A"}\nID: ${request.id}`
    );
    console.log(
      `WhatsApp link: https://wa.me/${adminPhone.replace("+", "")}?text=${whatsappMsg}`
    );

    return new Response(
      JSON.stringify({ success: true, request_id: request.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
