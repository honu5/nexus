const z = require("zod");

const sigupSchema = z.object({
  name: z.string().min(1, "Name shall be atleast one character"),
  email: z.email("Invalid Email Address"),
  password: z.string().min(8, "Password must be atleast 8 chars"),
  role: z.enum(["user", "admin"]).optional(),
});

const loginSchema = z.object({
  email: z.email("Invalid Email Address"),
  password: z.string().min(8, "Password must be atleast 8 chars"),
});
module.exports = { sigupSchema, loginSchema };
//
