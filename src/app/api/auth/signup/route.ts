import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: { json: () => PromiseLike<{ email: string; password: string }> | { email: string; password: string } }) {
  const { email, password } = await req.json();
  const userExists = await prisma.user.findUnique({ where: { email } });

  if (userExists) {
    return new Response("User already exists", { status: 400 });
  }

  const hashedPassword = await hash(password, 10);

  const user = await prisma.user.create({
    data: { email, password: hashedPassword },
  });

  return Response.json({ user });
}
