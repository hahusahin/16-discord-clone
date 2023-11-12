import { object, string, TypeOf } from "zod";

export const createServerSchema = object({
  name: string().min(1, {
    message: "Server name is required.",
  }),
  imageUrl: string().min(1, {
    message: "Server image is required.",
  }),
});

export type CreateServerFormData = TypeOf<typeof createServerSchema>;
