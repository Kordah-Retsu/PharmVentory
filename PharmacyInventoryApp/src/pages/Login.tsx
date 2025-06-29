import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "../components/ui/login-page"
export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-gradient-to-br from-indigo-900 via-indigo-700 to-indigo-0 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <GalleryVerticalEnd className="size-4" />
          <span>PHARMACY INVENTORY APP.</span>
        </a>
        <LoginForm />
      </div>
    </div>
  )
}
