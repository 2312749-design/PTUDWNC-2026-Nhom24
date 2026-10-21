import ResetPasswordForm from "@/app/reset-password/reset-password-form";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; token?: string }>;
}) {
  const { email = "", token = "" } = await searchParams;
  return <ResetPasswordForm email={email} token={token} />;
}
