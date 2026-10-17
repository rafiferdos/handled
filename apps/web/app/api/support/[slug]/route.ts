import { handleIntake } from "@/lib/server/gateway"

export const maxDuration = 120
export async function POST(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  return handleIntake(request, (await context.params).slug)
}
