import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Authentication is required",
      },
      { status: 401 }
    );
  }
  const userId = user._id;
  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessages: acceptMessages,
      },
      { new: true }
    );
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "User status updated successfully for accepting Messages",
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update status of user to accept messages", error);
    return Response.json(
      {
        success: false,
        message: "Failed to update status of user to accept messages",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Authentication is required",
      },
      { status: 401 }
    );
  }
  const userId = user._id;

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "User found",
        isAccepttingMessages: user.isAcceptingMessages,
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to find user", error);
    return Response.json(
      {
        success: false,
        message: "Failed to find user",
      },
      { status: 500 }
    );
  }
}
