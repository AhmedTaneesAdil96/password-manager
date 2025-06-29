import { NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { id } = await request.json();
    await prisma.password.delete({
      where: {
        id: id,
        user: {
          email: session.user.email, // Ensure user can only delete their own passwords
        },
      },
    });

    return NextResponse.json({ message: "Password deleted successfully" });
  } catch (error) {
    console.error("Delete password error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
