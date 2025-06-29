import { PrismaClient } from "../../../../generated/prisma";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: { json: () => PromiseLike<{ email: any; password: any }> | { email: any; password: any } }) {
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
