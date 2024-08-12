import { Provider } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import * as Tone from 'tone'

import { evalErrorAtom, liveCodeAtom } from '@/states/atoms'
import { App } from './App'

import '@testing-library/jest-dom/vitest'
import { UserEvent, userEvent } from '@testing-library/user-event'
import { getByRole, render, screen } from '@testing-library/react'

describe('App component', () => {
  type JotaiPropsType = {
    initialValues: any
    children: JSX.Element
  }

  let user: UserEvent

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
    user = userEvent.setup()
    return render(<AppProvider />)
  }

  const simulateTypingOfText = async (text: string) => {
    const textbox = screen.getByRole('textbox')
    textbox.focus()
    await user.type(textbox, text)
  }

  describe('Code section header', () => {
    describe('tab list', () => {
      it('should display tab list for selecting code', () => {
        // arrange & act
        setup()

        // assert
        const tablist = screen.getByRole('tablist')
        expect(tablist).toBeInTheDocument()
        expect(
          getByRole(tablist, 'tab', { name: 'Your code', selected: true })
        ).toBeInTheDocument()
      })
    })

    describe('status indicator', () => {
      it('should be "Ready" after start', () => {
        // arrange & act
        setup()

        // assert
        expect(screen.getByRole('status')).toHaveTextContent('Ready')
      })

      it('should be "Playing" after start playing', async () => {
        // arrange
        const { rerender } = setup()

        // act
        await simulateTypingOfText(';')
        await user.click(screen.getByRole('button', { name: 'Run' }))
        rerender(<AppProvider />)

        // assert
        expect(screen.getByRole('status')).toHaveTextContent('Playing')
      })

      it('should be "Ready" after stop playing', async () => {
        // arrange
        const { rerender } = setup()
        await simulateTypingOfText(';')
        await user.click(screen.getByRole('button', { name: 'Run' }))
        rerender(<AppProvider />)
        expect(screen.getByRole('status')).toHaveTextContent('Playing')

        // act
        await user.click(screen.getByRole('button', { name: 'Stop' }))
        rerender(<AppProvider />)

        // assert
        expect(screen.getByRole('status')).toHaveTextContent('Ready')
      })

      it('should be "Updated" when code is edited in playing', async () => {
        const { rerender } = setup()
        await simulateTypingOfText(';')
        await user.click(screen.getByRole('button', { name: 'Run' }))
        rerender(<AppProvider />)
        expect(screen.getByRole('status')).toHaveTextContent('Playing')

        // act
        await simulateTypingOfText(';')
        rerender(<AppProvider />)

        // assert
        expect(screen.getByRole('status')).toHaveTextContent('Updated')
      })

      it('should be "Error" after evaluate invalid type code', async () => {
        // arrange
        const { rerender } = setup()

        // act
        await simulateTypingOfText('invalid code')
        try {
          await user.click(screen.getByRole('button', { name: 'Run' }))
        } catch {
          //
        }
        rerender(<AppProvider />)

        // assert
        expect(screen.getByRole('status')).toHaveTextContent('Error')
      })
    })
  })

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
      await simulateTypingOfText('Tone.getTransport().start()')

      // assert
      expect(await screen.findByRole('button', { name: 'Run' })).toBeEnabled()
    })
  })

  describe('"Stop" button', () => {
    afterEach(() => {
      Tone.getTransport().stop()
      vi.restoreAllMocks()
    })

    it('should call `Tone.getTransport().stop()` method on click during playing', async () => {
      // arrange
      setup()

      // act
      await simulateTypingOfText(';')
      Tone.getTransport().start()
      await user.click(screen.getByRole('button', { name: 'Stop' }))

      // assert
      expect(Tone.getTransport().stop).toHaveBeenCalled()
    })

    it('should not call `Tone.getTransport().stop()` method on click during stopped', async () => {
      // arrange
      setup()

      // act
      await simulateTypingOfText(';')
      await user.click(screen.getByRole('button', { name: 'Stop' }))

      // assert
      expect(Tone.getTransport().stop).not.toHaveBeenCalled()
    })

    it('should call `Tone.getTransport().cancel()` method on click if specified', async () => {
      // arrange
      setup()

      // act
      await simulateTypingOfText(';')
      Tone.getTransport().start()
      await user.click(screen.getByRole('button', { name: 'Stop' }))

      // assert
      expect(Tone.getTransport().stop).toHaveBeenCalled()
      expect(Tone.getTransport().cancel).toHaveBeenCalled()
    })

    it('should not call `getTransport().cancel()` method on click if not specified', async () => {
      // arrange
      setup()

      // act
      await simulateTypingOfText(';')
      await user.click(
        screen.getByRole('checkbox', { name: 'cancel `transport` on stop' })
      )
      Tone.getTransport().start()
      await user.click(screen.getByRole('button', { name: 'Stop' }))

      // assert
      expect(Tone.getTransport().stop).toHaveBeenCalled()
      expect(Tone.getTransport().cancel).not.toHaveBeenCalled()
    })
  })

  describe('Error alert', () => {
    it('should not visible before evaluate type code', () => {
      // arrange & act
      setup()

      // assert
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('should not visible after evaluate valid type code', async () => {
      // arrange
      const { rerender } = setup()

      // act
      await simulateTypingOfText(';')
      await user.click(screen.getByRole('button', { name: 'Run' }))
      rerender(<AppProvider />)

      // assert
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('should visible after evaluate invalid type code', async () => {
      // arrange
      const { rerender } = setup()

      // act
      await simulateTypingOfText('invalid code')
      try {
        await user.click(screen.getByRole('button', { name: 'Run' }))
      } catch {
        //
      }
      rerender(<AppProvider />)

      // assert
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })
})
