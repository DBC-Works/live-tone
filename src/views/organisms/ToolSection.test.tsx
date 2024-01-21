import { ToolSection } from './ToolSection'

import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'

describe('ToolBar component', () => {
  const setup = () => {
    render(<ToolSection />)
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
