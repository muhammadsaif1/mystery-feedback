import { z } from "zod";

export const MessageSchema = z.object({
  content: z
    .string()
    .min(3, { message: "content must be atleast 3 character long" })
    .max(300, { message: "content must be atmost 300 character long" }),
});
