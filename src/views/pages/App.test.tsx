import { Provider } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import * as Tone from 'tone'

import { evalErrorAtom, liveCodeAtom } from '@/states/atoms'
import { App } from './App'

import '@testing-library/jest-dom/vitest'
import { userEvent } from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'

describe('App component', () => {
  type JotaiPropsType = {
    initialValues: any
    children: JSX.Element
  }

  const HydrateAtoms = ({
    initialValues,
    children,
  }: JotaiPropsType): JSX.Element => {
    useHydrateAtoms(initialValues)
    return children
  }

  const TestProvider = ({
    initialValues,
    children,
  }: JotaiPropsType): JSX.Element => (
    <Provider>
      <HydrateAtoms initialValues={initialValues}>{children}</HydrateAtoms>
    </Provider>
  )

  const AppProvider = () => (
    <TestProvider
      initialValues={[
        [liveCodeAtom, ''],
        [evalErrorAtom, null],
      ]}
    >
      <App />
    </TestProvider>
  )

  const setup = () => {
    return render(<AppProvider />)
  }

  describe('"Run" button', () => {
    it('should disable if code is empty', () => {
      // arrange & act
      setup()

      // assert
      expect(screen.getByRole('button', { name: 'Run' })).toBeDisabled()
    })

    it('should enable if code is not empty', async () => {
      // arrange
      setup()

      // act
      await userEvent.type(
        screen.getByRole('textbox'),
        'Tone.Transport.start()'
      )

      // assert
      expect(await screen.findByRole('button', { name: 'Run' })).toBeEnabled()
    })
  })

  describe('"Stop" button', () => {
    afterEach(() => {
      Tone.Transport.stop()
      vi.restoreAllMocks()
    })

    it('should call `Tone.Transport.stop()` method on click during playing', async () => {
      // arrange
      setup()

      // act
      await userEvent.type(screen.getByRole('textbox'), ';')
      Tone.Transport.start()
      await userEvent.click(screen.getByRole('button', { name: 'Stop' }))

      // assert
      expect(Tone.Transport.stop).toHaveBeenCalled()
    })

    it('should not call `Tone.Transport.stop()` method on click during stopped', async () => {
      // arrange
      setup()

      // act
      await userEvent.type(screen.getByRole('textbox'), ';')
      await userEvent.click(screen.getByRole('button', { name: 'Stop' }))

      // assert
      expect(Tone.Transport.stop).not.toHaveBeenCalled()
    })

    it('should call `Tone.Transport.cancel()` method on click if specified', async () => {
      // arrange
      setup()

      // act
      await userEvent.type(screen.getByRole('textbox'), ';')
      Tone.Transport.start()
      await userEvent.click(screen.getByRole('button', { name: 'Stop' }))

      // assert
      expect(Tone.Transport.stop).toHaveBeenCalled()
      expect(Tone.Transport.cancel).toHaveBeenCalled()
    })

    it('should not call `Transport.cancel()` method on click if not specified', async () => {
      // arrange
      setup()

      // act
      await userEvent.type(screen.getByRole('textbox'), ';')
      await userEvent.click(
        screen.getByRole('checkbox', { name: 'cancel `transport` on stop' })
      )
      Tone.Transport.start()
      await userEvent.click(screen.getByRole('button', { name: 'Stop' }))

      // assert
      expect(Tone.Transport.stop).toHaveBeenCalled()
      expect(Tone.Transport.cancel).not.toHaveBeenCalled()
    })
  })

  describe('Error alert', () => {
    it('should visible before evaluate type code', () => {
      // arrange & act
      setup()

      // assert
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('should not visible after evaluate valid type code', async () => {
      // arrange
      const { rerender } = setup()

      // act
      await userEvent.type(screen.getByRole('textbox'), ';')
      await userEvent.click(screen.getByRole('button', { name: 'Run' }))
      rerender(<AppProvider />)

      // assert
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('should visible after evaluate invalid type code', async () => {
      // arrange
      const { rerender } = setup()

      // act
      await userEvent.type(screen.getByRole('textbox'), 'invalid code')
      try {
        await userEvent.click(screen.getByRole('button', { name: 'Run' }))
      } catch {
        //
      }
      rerender(<AppProvider />)

      // assert
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })
})
