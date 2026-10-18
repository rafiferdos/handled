import { handleApi } from "@/lib/server/gateway"

export const maxDuration = 120
async function proxy(
  request: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  return handleApi(request, (await context.params).path)
}
export {
  proxy as GET,
  proxy as POST,
  proxy as PUT,
  proxy as PATCH,
  proxy as DELETE,
}
