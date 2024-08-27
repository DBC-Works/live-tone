import { PlaySection } from './PlaySection'

import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'

describe('PlaySection component', () => {
  const setup = () => {
    render(<PlaySection />)
  }

  it('should contain "Run" button', () => {
    // arrange & act
    setup()

    // assert
    expect(screen.getByRole('button', { name: 'Run' })).toBeInTheDocument()
  })

  it('should contain "Stop" button', () => {
    // arrange & act
    setup()

    // assert
    expect(screen.getByRole('button', { name: 'Stop' })).toBeInTheDocument()
  })
})
