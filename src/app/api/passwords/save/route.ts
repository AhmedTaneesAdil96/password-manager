import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

import { encrypt } from "../../../lib/encryption";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) return new Response("Unauthorized", { status: 401 });

  const { service, username, password, secondPwd } = await req.json();
  const encryptedPwd = encrypt(password);

  await prisma.password.create({
    data: {
      service,
      username,
      encryptedPwd,
      secondPwd,
      user: { connect: { email: session.user.email } },
    },
  });

  return Response.json({ success: true });
}
