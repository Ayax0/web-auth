import { z } from "zod";

export const schema = z.object({
  username: z.string().min(3, "Username is required"),
  password: z.string(),
});
