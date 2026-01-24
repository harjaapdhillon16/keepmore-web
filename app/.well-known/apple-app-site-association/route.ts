import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      applinks: {
        details: [
          {
            appIDs: ["QLPRS3M2XY.com.priyanshukumar18.keepmore"],
            components: [
              { "/": "/plaid" },
              { "/": "/plaid/*" }
            ],
          },
        ],
      },
    },
    {
      headers: {
        // IMPORTANT for Apple + avoids download behavior
        "Content-Type": "application/json",
        // safe cache choice while testing
        "Cache-Control": "public, max-age=0, must-revalidate",
      },
    }
  );
}
