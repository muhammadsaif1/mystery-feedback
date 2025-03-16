import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { userNameValidation } from "@/schemas/signUpSchema";

const UserNameQuerySchema = z.object({
  userName: userNameValidation,
});

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      userName: searchParams.get("userName"),
    };
    // validate with zod
    const result = UserNameQuerySchema.safeParse(queryParam);
    if (!result.success) {
      const userNameErrors = result.error.format().userName?._errors || [];
      return Response.json(
        {
          success: false,
          message: "Invalid userName",
          errors: userNameErrors,
        },
        { status: 400 }
      );
    }

    const { userName } = result.data;
    const existingUser = await UserModel.findOne({
      userName,
      isVerified: true,
    });
    if (existingUser) {
      return Response.json(
        {
          success: false,
          message: "Username already exists!",
        },
        { status: 400 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Username is unique",
      },
      { status: 200 }
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
