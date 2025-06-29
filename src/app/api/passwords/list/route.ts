import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const passwords = await prisma.password.findMany({
    where: {
      userId: Number(session.user?.id),
    },
    select: {
      id: true,
      service: true,
      username: true,
    },
    orderBy: {
      id: "desc",
    },
  });

  return Response.json(passwords);
}
