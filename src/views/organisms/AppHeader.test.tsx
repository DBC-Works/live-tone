import { AppHeader } from './AppHeader'

import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'

describe('AppHeader component', () => {
  const setup = () => {
    render(<AppHeader />)
  }

  it('should contain app title', () => {
    // arrange & act
    setup()

    // assert
    expect(screen.getByText('live tone')).toBeInTheDocument()
  })

  it('should contain link to Tone.js document', () => {
    // arrange & act
    setup()

    // assert
    const linkElement = screen.getByRole('link', { name: 'Tone.js Doc' })
    expect(linkElement).toBeInTheDocument()
    expect(linkElement).toHaveAttribute(
      'href',
      'https://tonejs.github.io/docs/'
    )
    expect(linkElement).toHaveAttribute('target', '_blank')
  })
})
