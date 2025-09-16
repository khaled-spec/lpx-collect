import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { SignUp } from '@clerk/nextjs'
import SignUpPage from '@/app/sign-up/[[...sign-up]]/page'

vi.mocked(SignUp)

describe('SignUpPage', () => {
  it('renders the welcome message', () => {
    render(<SignUpPage />)

    expect(screen.getByText('Create Account')).toBeInTheDocument()
    expect(screen.getByText('Join LPX Collect today')).toBeInTheDocument()
  })

  it('renders the SignUp component', () => {
    render(<SignUpPage />)

    expect(SignUp).toHaveBeenCalled()
  })

  it('passes correct appearance configuration to SignUp', () => {
    render(<SignUpPage />)

    expect(SignUp).toHaveBeenCalledWith(
      expect.objectContaining({
        appearance: expect.objectContaining({
          elements: expect.objectContaining({
            rootBox: "mx-auto",
            card: "shadow-xl border-0"
          })
        })
      }),
      expect.any(Object)
    )
  })

  it('has proper layout structure', () => {
    render(<SignUpPage />)

    const container = screen.getByText('Create Account').closest('div')
    expect(container).toHaveClass('text-center')

    const mainContainer = screen.getByText('Create Account').closest('.min-h-screen')
    expect(mainContainer).toHaveClass('flex', 'items-center', 'justify-center', 'bg-background')
  })

  it('renders with proper semantic structure', () => {
    render(<SignUpPage />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Create Account')
  })

  it('has consistent styling with sign-in page', () => {
    render(<SignUpPage />)

    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveClass('text-3xl', 'font-bold', 'tracking-tight')

    const description = screen.getByText('Join LPX Collect today')
    expect(description).toHaveClass('text-muted-foreground', 'mt-2')
  })
})