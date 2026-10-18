import { handleSession } from "@/lib/server/gateway"

export const GET = (request: Request) => handleSession(request)
export const POST = (request: Request) => handleSession(request)
export const DELETE = (request: Request) => handleSession(request)
