import { Laptop, Moon, Sun } from 'lucide-react'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { useTheme } from '../context/ThemeProvider'

export function ThemeToggle() {
  const { mode, resolved, setTheme, toggle } = useTheme()

  const icon = resolved === 'dark' ? (
    <Moon className="size-4" />
  ) : (
    <Sun className="size-4" />
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="transition-colors duration-300 cursor-pointer"
          aria-label="Cambiar tema"
          title="Cambiar tema"
        >
          {icon}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        <DropdownMenuItem onClick={toggle} className="sm:hidden">
          {resolved === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}<span>Alternar</span>
        </DropdownMenuItem>
        <DropdownMenuRadioGroup value={mode} onValueChange={(v) => setTheme(v as any)}>
          <DropdownMenuRadioItem value="light">
            <Sun className="size-4" />
            <span>Claro</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">
            <Moon className="size-4" />
            <span>Oscuro</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">
            <Laptop className="size-4" />
            <span>Sistema</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

