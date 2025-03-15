import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { userName, code } = await request.json();

    const decodedUserName = decodeURIComponent(userName);
    const user = await UserModel.findOne({ userName: decodedUserName });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    const isCodeValid =
      user.verifyCode === code && user.verifyCodeExpiry > new Date();

    if (isCodeValid) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "User verified successfully",
        },
        {
          status: 200,
        }
      );
    }

    return Response.json(
      {
        success: false,
        message: "Invalid code",
      },
      {
        status: 400,
      }
    );
  } catch (error) {
    console.error("Error checking userName", error);
    return Response.json(
      {
        success: false,
        message: "Error checking userName",
      },
      { status: 500 }
    );
  }
}
