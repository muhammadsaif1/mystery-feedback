import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request: Request) {
  dbConnect();
  const { userName, content } = await request.json();
  try {
    const user = await UserModel.findOne({ userName }).exec();
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    if (!user.isAcceptingMessages) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting messages",
        },
        { status: 403 }
      );
    }
    const message = {
      content,
      createdAt: new Date(),
    };
    user.messages.push(message as Message);
    await user.save();
    return Response.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to send message", error);
    return Response.json(
      {
        success: false,
        message: "Failed to send message",
      },
      { status: 500 }
    );
  }
}
