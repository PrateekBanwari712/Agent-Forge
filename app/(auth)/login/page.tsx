import { Suspense } from "react";
import { Logo } from "@/components/logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireUnauth } from "@/modules/auth/actions";
import { SignInForm } from "@/modules/auth/components/sign-in-form";
import { Spinner } from "@/components/ui/spinner";

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-full flex-1 items-center justify-center p-4">
          <Spinner className="size-6" />
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}

async function SignInContent() {
  await requireUnauth();
  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-background px-4 py-16">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mb-2 flex justify-center">
            <Logo showLabel={false} href="/login" />
          </div>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>
            Sign in to continue to Agent Builder
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignInForm />
        </CardContent>
      </Card>
    </div>
  );
}
