import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { SignIn } from '@clerk/nextjs'
import SignInPage from '@/app/sign-in/[[...sign-in]]/page'

vi.mocked(SignIn)

describe('SignInPage', () => {
  it('renders the welcome message', () => {
    render(<SignInPage />)

    expect(screen.getByText('Welcome Back')).toBeInTheDocument()
    expect(screen.getByText('Sign in to your LPX Collect account')).toBeInTheDocument()
  })

  it('renders the SignIn component', () => {
    render(<SignInPage />)

    expect(SignIn).toHaveBeenCalled()
  })

  it('passes correct appearance configuration to SignIn', () => {
    render(<SignInPage />)

    expect(SignIn).toHaveBeenCalledWith(
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
    render(<SignInPage />)

    const container = screen.getByText('Welcome Back').closest('div')
    expect(container).toHaveClass('text-center')

    const mainContainer = screen.getByText('Welcome Back').closest('.min-h-screen')
    expect(mainContainer).toHaveClass('flex', 'items-center', 'justify-center', 'bg-background')
  })

  it('renders with proper semantic structure', () => {
    render(<SignInPage />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Welcome Back')
  })
})