import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, vi, expect } from 'vitest'
import { Button } from './button'

describe('Button', () => {
    it('renders children and handles click', async () => {
        const user = userEvent.setup()
        const handleClick = vi.fn()
        render(<Button onClick={handleClick}>Press</Button>)
        const btn = screen.getByRole('button', { name: /press/i })
        await user.click(btn)
        expect(handleClick).toHaveBeenCalled()
    })
})