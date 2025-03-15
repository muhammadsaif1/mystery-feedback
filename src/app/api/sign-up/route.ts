import { sendVerificationEmail } from "@/helpers/verificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { email, userName, password } = await request.json();

    const existingUserVerifiedByUserName = await UserModel.findOne({
      userName,
      isVerified: true,
    });
    if (existingUserVerifiedByUserName) {
      return Response.json(
        {
          success: false,
          message: "Username already exists!",
        },
        {
          status: 400,
        }
      );
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const existingUserByEmail = await UserModel.findOne({
      email,
      isVerified: true,
    });
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "Email already exists!",
          },
          {
            status: 400,
          }
        );
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = otp;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const expirtDate = new Date();
      expirtDate.setHours(expirtDate.getHours() + 1);
      const user = new UserModel({
        userName,
        email,
        password: hashedPassword,
        verifyCode: otp,
        verifyCodeExpire: expirtDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });
      await user.save();
    }
    // send verification email
    const emailResponse = await sendVerificationEmail(email, userName, otp);
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: email.message,
        },
        {
          status: 500,
        }
      );
    }
    return Response.json(
      {
        success: true,
        message: "User created successfully, Please verify your email",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user", error);
    return Response.json(
      { success: false, message: "Error creating user" },
      {
        status: 500,
      }
    );
  }
}
