"use server";

import { v4 as uuidv4 } from "uuid";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { CreateServerFormData, CreateServerSchema } from "@/lib/schemas";

export const createServer = async (
  prevState: any,
  formData: CreateServerFormData
) => {
  try {
    const validationRes = CreateServerSchema.safeParse(formData);

    if (!validationRes.success)
      return { success: false, message: "Invalid Form Values" };

    const profile = await currentProfile();

    if (!profile) return { success: false, message: "Unauthorized" };

    const { name, imageUrl } = formData;

    await db.server.create({
      data: {
        name,
        imageUrl,
        inviteCode: uuidv4(),
        profileId: profile.id,
        channels: {
          create: [{ name: "general", profileId: profile.id }],
        },
        members: {
          create: [{ role: MemberRole.ADMIN, profileId: profile.id }],
        },
      },
    });

    revalidatePath("/");
    return { success: true, message: "Server Created Succesfully" };
  } catch (error) {
    console.log("[SERVERS_POST]", error);
    return { success: false, message: "Failed to create server" };
  }
};
