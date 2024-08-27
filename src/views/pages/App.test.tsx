import { Provider } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import * as Tone from 'tone'

import { ErrorTypes } from '@/states/types'
import { errorAtom, liveCodeAtom } from '@/states/atoms'
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
        [errorAtom, { error: null, type: ErrorTypes.Eval }],
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
    const codeSectionHeader = screen.getByRole('heading', {
      level: 2,
      name: 'Your code',
    })
    const textbox = getByRole(codeSectionHeader.closest('section')!, 'textbox')
    textbox.focus()
    await user.type(textbox, text)
  }

  describe('Code section', () => {
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

  describe('Play section', () => {
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
  })

  describe('Sharing section', () => {
    describe('"Connect" / "Disconnect" button', () => {
      it('should be visible if both the WebSocket server url and the tag are entered', async () => {
        // arrange
        setup()
        expect(
          screen.queryByRole('button', { name: 'Connect' })
        ).not.toBeInTheDocument()

        // act
        const urlTextbox = screen.getByLabelText(
          'Azure Web PubSub client access URL'
        )
        urlTextbox.focus()
        await user.type(urlTextbox, 'invalid url')
        const tagTextbox = screen.getByLabelText('Tag of your code')
        tagTextbox.focus()
        await user.type(tagTextbox, 'Tag')

        // assert
        const connectButton = screen.getByRole('button', { name: 'Connect' })
        expect(connectButton).toBeInTheDocument()
        expect(connectButton).toBeDisabled()
      })

      it('should enable if WebSocket server url is valid', async () => {
        // arrange
        setup()

        // act
        const urlTextbox = screen.getByLabelText(
          'Azure Web PubSub client access URL'
        )
        urlTextbox.focus()
        await user.type(urlTextbox, 'wss://example.com')
        const tagTextbox = screen.getByLabelText('Tag of your code')
        tagTextbox.focus()
        await user.type(tagTextbox, 'Tag')

        // assert
        const connectButton = screen.getByRole('button', { name: 'Connect' })
        expect(connectButton).toBeInTheDocument()
        expect(connectButton).toBeEnabled()
      })

      it('should try to connect to a WebSocket server when clicked while not connected and, if successful, update associated components', async () => {
        // arrange
        setup()
        const urlTextbox = screen.getByLabelText(
          'Azure Web PubSub client access URL'
        )
        urlTextbox.focus()
        await user.type(urlTextbox, 'wss://example.com')
        const tagTextbox = screen.getByLabelText('Tag of your code')
        tagTextbox.focus()
        await user.type(tagTextbox, 'Tag')

        // act
        await user.click(screen.getByRole('button', { name: 'Connect' }))

        // assert
        const disconnectButton = await screen.findByRole('button', {
          name: 'Disconnect',
        })
        expect(disconnectButton).toBeInTheDocument()
        expect(disconnectButton).toBeEnabled()

        expect(urlTextbox).toHaveAttribute('readonly')
        expect(tagTextbox).toHaveAttribute('readonly')
      })

      it('should try to disconnect from a WebSocket server when clicked while connecting and, if successful, update associated components', async () => {
        // arrange
        setup()
        const urlTextbox = screen.getByLabelText(
          'Azure Web PubSub client access URL'
        )
        urlTextbox.focus()
        await user.type(urlTextbox, 'wss://example.com')
        const tagTextbox = screen.getByLabelText('Tag of your code')
        tagTextbox.focus()
        await user.type(tagTextbox, 'Tag')
        await user.click(screen.getByRole('button', { name: 'Connect' }))

        // act
        await user.click(
          await screen.findByRole('button', { name: 'Disconnect' })
        )

        // assert
        const connectButton = await screen.findByRole('button', {
          name: 'Connect',
        })
        expect(connectButton).toBeInTheDocument()
        expect(connectButton).toBeEnabled()

        expect(urlTextbox).not.toHaveAttribute('readonly')
        expect(tagTextbox).not.toHaveAttribute('readonly')
      })
    })
  })

  describe('Settings section', () => {
    it('should the heading "Sharing settings"', () => {
      // arrange & act
      setup()

      // assert
      expect(
        screen.getByRole('heading', {
          level: 2,
          name: 'Sharing settings',
        })
      )
    })

    it('should exists "Azure Web PubSub client access URL" input text field', () => {
      // arrange & act
      setup()

      // assert
      expect(screen.getByLabelText('Azure Web PubSub client access URL'))
    })

    it('should exist "Tag of your code" input text field', () => {
      // arrange & act
      setup()

      // assert
      expect(screen.getByLabelText('Tag of your code'))
    })
  })

  describe('lifecycle', () => {
    describe('unload', () => {
      it('should try to disconnect from a WebSocket server if connected', async () => {
        // arrange
        setup()
        const urlTextbox = screen.getByLabelText(
          'Azure Web PubSub client access URL'
        )
        urlTextbox.focus()
        await user.type(urlTextbox, 'wss://example.com')
        const tagTextbox = screen.getByLabelText('Tag of your code')
        tagTextbox.focus()
        await user.type(tagTextbox, 'Tag')
        await user.click(screen.getByRole('button', { name: 'Connect' }))
        expect(
          await screen.findByRole('button', { name: 'Disconnect' })
        ).toBeInTheDocument()

        // act
        window.dispatchEvent(new Event('beforeunload'))

        // assert
        const connectButton = await screen.findByRole('button', {
          name: 'Connect',
        })
        expect(connectButton).toBeInTheDocument()
        expect(connectButton).toBeEnabled()

        expect(urlTextbox).not.toHaveAttribute('readonly')
        expect(tagTextbox).not.toHaveAttribute('readonly')
      })
    })
  })
})
