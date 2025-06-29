import { decrypt } from "../../../lib/encryption";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

const prisma = new PrismaClient();

export async function POST(req: { json: () => PromiseLike<{ id: number }> | { id: number } }) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { id } = await req.json();
  const password = await prisma.password.findUnique({ where: { id } });

  if (!password) return new Response("Not found", { status: 404 });
  if (password.userId !== session.user?.id) return new Response("Forbidden", { status: 403 });

  return Response.json({ password: decrypt(password.encryptedPwd) });
}
