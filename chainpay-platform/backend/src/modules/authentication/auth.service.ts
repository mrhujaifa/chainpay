import status from "http-status";
import { prisma } from "../../../lib/prisma";
import { AppError } from "../../utils/AppError";
import type { SignInInput, SignUpInput } from "./auth.validation";
import { FirebaseAdmin } from "../../../lib/firebaseAdmin";

const signUpWithEmail = async (payload: SignUpInput) => {
  const { name, email, password } = payload;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError("Email already in use", status.BAD_REQUEST);
  }

  const firebaseUser = await FirebaseAdmin.auth().createUser({
    email,
    password,
    displayName: name,
    emailVerified: false,
  });

  const verificationLink =
    await FirebaseAdmin.auth().generateEmailVerificationLink(email);

  // TODO: Email service prodvider (nodemailer/resend)
  console.log("Verification link:", verificationLink);

  const newUser = await prisma.user.create({
    data: {
      firebaseUid: firebaseUser.uid,
      email,
      name,
      provider: "EMAIL",
      lastLoginAt: new Date(),
      profile: {
        create: {},
      },
    },
    include: { profile: true },
  });

  const customToken = await FirebaseAdmin.auth().createCustomToken(
    firebaseUser.uid,
  );

  return { user: newUser, customToken };
};

const signInWithEmail = async (payload: SignInInput) => {
  const { email, password } = payload;

  const dbUser = await prisma.user.findUnique({
    where: { email },
    include: { profile: true },
  });

  if (!dbUser) {
    throw new AppError("Invalid email or password", 401);
  }

  if (!dbUser.isActive) {
    throw new AppError("Your account has been deactivated", 403);
  }

  try {
    await FirebaseAdmin.auth().getUserByEmail(email);
  } catch {
    throw new AppError("Invalid email or password", 401);
  }

  const customToken = await FirebaseAdmin.auth().createCustomToken(
    dbUser.firebaseUid,
  );

  await prisma.user.update({
    where: { email },
    data: { lastLoginAt: new Date() },
  });

  return { user: dbUser, customToken };
};

export const AuthServices = {
  signUpWithEmail,
  signInWithEmail,
};
