import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { encrypt } from "../../../lib/encryption";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: {
  json: () =>
    | PromiseLike<{ service: string; username: string; password: string; secondPwd: string }>
    | { service: string; username: string; password: string; secondPwd: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { service, username, password, secondPwd } = await req.json();
  const encryptedPwd = encrypt(password);

  await prisma.password.create({
    data: {
      service,
      username,
      encryptedPwd,
      secondPwd,
      user: { connect: { email: session.user?.email } },
    },
  });

  return Response.json({ success: true });
}
