"use server";

import { FormState } from ".";
import { sendEmail } from "@/libs/nodemailer";

export async function contactFormAction(
  _state: FormState,
  formData: FormData
): Promise<FormState> {
  const email = formData.get("email");
  const name = formData.get("name");
  const message = formData.get("message");
  const honeypot = formData.get("hp");
  if (honeypot || !name || !message || !email)
    return {
      status: "error",
      message: "Merci de remplir tous les champs",
    };

  const res = await sendEmail(email, name, message);
  if (res) {
    return {
      status: "ok",
      message: "Merci pour votre message",
    };
  }
  return {
    status: "error",
    message: "Erreur lors de l'envoi du message",
  };
}
