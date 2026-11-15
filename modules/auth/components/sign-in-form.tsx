import { Button } from "@/components/ui/button";
import { signIn } from "@/modules/auth/actions";

export function SignInForm() {
  return (
    <form action={signIn} className="w-full">
      <Button type="submit" className="w-full" size="lg">
        Sign Up with GitHub
      </Button>
    </form>
  );
}
