import { signout } from '@/app/login/actions'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export function SignOutButton() {
  return (
    <form action={signout}>
      <Button type="submit" variant="ghost" className="w-full gap-2">
        <LogOut className="w-4 h-4" />
        Sign out
      </Button>
    </form>
  )
}