import { decrypt } from "../../../lib/encryption";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const { id } = await req.json();
  const password = await prisma.password.findUnique({ where: { id } });

  if (!password) return new NextResponse("Not found", { status: 404 });
  if (password.userId !== parseInt(session.user?.id)) return new NextResponse("Forbidden", { status: 403 });

  return NextResponse.json({ password: decrypt(password.encryptedPwd) });
}
