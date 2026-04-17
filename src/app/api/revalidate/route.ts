import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidate-secret");
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { tags, clearAll } = body;

    if (clearAll) {
      revalidatePath("/", "layout");
    }

    if (tags && Array.isArray(tags)) {
      tags.forEach((tag) => revalidateTag(tag, "max"));
    }

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (error) {
    return NextResponse.json({ message: "Error parsing request" }, { status: 400 });
  }
}
