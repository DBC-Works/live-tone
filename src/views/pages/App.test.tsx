import { Provider } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import * as Tone from 'tone'

import { ErrorTypes, ReceiveCodeInfo } from '@/states/types'
import { webSocketConnectionInfo } from '@/states/states'
import { errorAtom, liveCodeAtom, receivedCodesAtom } from '@/states/atoms'
import { App } from './App'

import '@testing-library/jest-dom/vitest'
import { UserEvent, userEvent } from '@testing-library/user-event'
import {
  act,
  getByRole,
  getByText,
  queryByText,
  render,
  screen,
} from '@testing-library/react'
import { getTestDoubleAccessor } from '@/__mock__/WSServerAccessor'

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

  const AppProvider: React.FC<{ receivedCodes?: ReceiveCodeInfo[] }> = ({
    receivedCodes,
  }) => (
    <TestProvider
      initialValues={[
        [liveCodeAtom, ''],
        [receivedCodesAtom, receivedCodes],
        [errorAtom, { error: null, type: ErrorTypes.Eval }],
      ]}
    >
      <App />
    </TestProvider>
  )

  const setup = (receivedCodes: ReceiveCodeInfo[] = []) => {
    user = userEvent.setup()
    return render(<AppProvider receivedCodes={receivedCodes} />)
  }

  const getCodeEditorTextBox = () => {
    const codeSectionHeader = screen.getByRole('heading', {
      level: 2,
      name: 'Your code',
    })
    return getByRole(codeSectionHeader.closest('section')!, 'textbox')
  }

  const simulateTypingOfText = async (text: string) => {
    const textbox = getCodeEditorTextBox()
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

        it('should switch code in code editor by selecting tab', async () => {
          // arrange
          const receivedMessage = {
            id: crypto.randomUUID(),
            tag: 'Received code',
            code: '// Received code',
            latest: true,
          }
          const { rerender } = setup([receivedMessage])
          expect(getCodeEditorTextBox()).not.toHaveAttribute('readonly')

          // act
          await userEvent.click(
            screen.getByRole('tab', { name: /Received code/ })
          )
          rerender(<AppProvider />)

          // assert
          expect(getCodeEditorTextBox()).toHaveAttribute('readonly')
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

      it('should run code if click', async () => {
        // arrange
        const receivedMessage = {
          id: crypto.randomUUID(),
          tag: 'Received code',
          code: '// Received code',
          latest: true,
        }
        setup([receivedMessage])
        await simulateTypingOfText('Tone.getTransport().start()')

        // act
        await userEvent.click(
          await screen.findByRole('button', { name: 'Run' })
        )

        // assert
        expect(screen.getByRole('status')).toHaveTextContent(/Playing/)
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
      it('should be visible if both the WebSocket server URL and the tag are entered', async () => {
        // arrange
        setup()
        expect(
          screen.queryByRole('button', { name: 'Connect' })
        ).not.toBeInTheDocument()

        // act
        const urlTextbox = screen.getByLabelText('WebSocket server URL')
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

      it('should enable if WebSocket server URL is valid', async () => {
        // arrange
        setup()

        // act
        const urlTextbox = screen.getByLabelText('WebSocket server URL')
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
        const urlTextbox = screen.getByLabelText('WebSocket server URL')
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
        expect(tagTextbox).not.toHaveAttribute('readonly')
      })

      it('should try to disconnect from a WebSocket server when clicked while connecting and, if successful, update associated components', async () => {
        // arrange
        setup()
        const urlTextbox = screen.getByLabelText('WebSocket server URL')
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

    describe('"Share" button', () => {
      it('should be visible while connected', async () => {
        // arrange
        setup()
        expect(
          screen.queryByRole('button', {
            name: 'Share',
          })
        ).not.toBeInTheDocument()
        const urlTextbox = screen.getByLabelText('WebSocket server URL')
        urlTextbox.focus()
        await user.type(urlTextbox, 'wss://example.com')
        const tagTextbox = screen.getByLabelText('Tag of your code')
        tagTextbox.focus()
        await user.type(tagTextbox, 'Tag')
        expect(
          screen.queryByRole('button', {
            name: 'Share',
          })
        ).not.toBeInTheDocument()

        // act
        await user.click(screen.getByRole('button', { name: 'Connect' }))

        // assert
        const shareButton = await screen.findByRole('button', {
          name: 'Share',
        })
        expect(shareButton).toBeInTheDocument()
        expect(shareButton).toBeEnabled()
      })

      it('should enable even if an error is reported', async () => {
        // arrange
        const { rerender } = setup()
        const urlTextbox = screen.getByLabelText('WebSocket server URL')
        urlTextbox.focus()
        await user.type(urlTextbox, 'wss://example.com')
        const tagTextbox = screen.getByLabelText('Tag of your code')
        tagTextbox.focus()
        await user.type(tagTextbox, 'Tag')
        await user.click(screen.getByRole('button', { name: 'Connect' }))
        await simulateTypingOfText('Tone.getTransport()start(')

        // act
        try {
          await user.click(screen.getByRole('button', { name: 'Run' }))
        } catch (e) {
          rerender(<AppProvider />)
        }

        // assert
        const shareButton = await screen.findByRole('button', {
          name: 'Share',
        })
        expect(shareButton).toBeEnabled()
      })

      it('should disable if tag is empty', async () => {
        // arrange
        setup()
        const urlTextbox = screen.getByLabelText('WebSocket server URL')
        urlTextbox.focus()
        await user.type(urlTextbox, 'wss://example.com')

        // act
        await user.click(screen.getByRole('button', { name: 'Connect' }))

        // assert
        const shareButton = await screen.findByRole('button', {
          name: 'Share',
        })
        expect(shareButton).toBeInTheDocument()
        expect(shareButton).toBeDisabled()
      })

      it.todo('should disable if the same tag is found in received codes')

      it('should send code', async () => {
        // arrange
        setup()
        const urlTextbox = screen.getByLabelText('WebSocket server URL')
        urlTextbox.focus()
        await user.type(urlTextbox, 'wss://example.com')
        const tagTextbox = screen.getByLabelText('Tag of your code')
        tagTextbox.focus()
        await user.type(tagTextbox, 'Tag')
        await user.click(screen.getByRole('button', { name: 'Connect' }))
        await simulateTypingOfText('Tone.getTransport().start()')

        // act
        await user.click(screen.getByRole('button', { name: 'Share' }))

        // assert
        const message = getTestDoubleAccessor()?.latestMessage
        expect(message).not.toBeNull()
        const data = JSON.parse(message!)
        expect(data.id).toEqual(webSocketConnectionInfo.id)
        expect(data.tag).toEqual('Tag')
        expect(data.code).toEqual('Tone.getTransport().start()')
      })

      it('should not send code if code is invalid', async () => {
        // arrange
        const { rerender } = setup()
        const urlTextbox = screen.getByLabelText('WebSocket server URL')
        urlTextbox.focus()
        await user.type(urlTextbox, 'wss://example.com')
        const tagTextbox = screen.getByLabelText('Tag of your code')
        tagTextbox.focus()
        await user.type(tagTextbox, 'Tag')
        await user.click(screen.getByRole('button', { name: 'Connect' }))
        await simulateTypingOfText('Tone.getTransport()start(')

        // act
        try {
          await user.click(screen.getByRole('button', { name: 'Share' }))
        } catch (e) {
          rerender(<AppProvider />)
        }

        // assert
        const message = getTestDoubleAccessor()?.latestMessage
        expect(message).toBeNull()
        expect(screen.getByRole('alert')).toBeInTheDocument()
      })

      it('should not be visible while disconnected', async () => {
        // arrange
        setup()
        const urlTextbox = screen.getByLabelText('WebSocket server URL')
        urlTextbox.focus()
        await user.type(urlTextbox, 'wss://example.com')
        const tagTextbox = screen.getByLabelText('Tag of your code')
        tagTextbox.focus()
        await user.type(tagTextbox, 'Tag')
        await user.click(screen.getByRole('button', { name: 'Connect' }))
        expect(
          await screen.findByRole('button', {
            name: 'Share',
          })
        ).toBeInTheDocument()

        // act
        await user.click(screen.getByRole('button', { name: 'Disconnect' }))

        // assert
        expect(
          screen.queryByRole('button', {
            name: 'Share',
          })
        ).not.toBeInTheDocument()
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

    it('should exists "WebSocket server URL" input text field', () => {
      // arrange & act
      setup()

      // assert
      expect(screen.getByLabelText('WebSocket server URL'))
    })

    it('should exist "Tag of your code" input text field', () => {
      // arrange & act
      setup()

      // assert
      expect(screen.getByLabelText('Tag of your code'))
    })
  })

  describe('event', () => {
    describe('lifecycle', () => {
      describe('unload', () => {
        it('should try to disconnect from a WebSocket server if connected', async () => {
          // arrange
          setup()
          const urlTextbox = screen.getByLabelText('WebSocket server URL')
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
          act(() => {
            window.dispatchEvent(new Event('beforeunload'))
          })

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

    describe('WebSocket', () => {
      describe('message', () => {
        it('should add message to receive list if message ID is not in the list', async () => {
          // arrange
          const { rerender } = setup()
          const urlTextbox = screen.getByLabelText('WebSocket server URL')
          urlTextbox.focus()
          await user.type(urlTextbox, 'wss://example.com')
          const tagTextbox = screen.getByLabelText('Tag of your code')
          tagTextbox.focus()
          await user.type(tagTextbox, 'Tag')
          await user.click(screen.getByRole('button', { name: 'Connect' }))

          // act
          const message = {
            tag: 'received code',
            id: crypto.randomUUID(),
            code: '// code',
          }
          getTestDoubleAccessor()?.simulateReceiveMessage(
            JSON.stringify(message)
          )
          rerender(<AppProvider />)

          // assert
          expect(screen.getAllByRole('tab')).toHaveLength(2)
          expect(
            getByText(screen.getByRole('tablist'), message.tag)
          ).toBeInTheDocument()
        })

        it('should update received message in list code if message ID is in the list', async () => {
          // arrange
          const { rerender } = setup()
          const urlTextbox = screen.getByLabelText('WebSocket server URL')
          urlTextbox.focus()
          await user.type(urlTextbox, 'wss://example.com')
          const tagTextbox = screen.getByLabelText('Tag of your code')
          tagTextbox.focus()
          await user.type(tagTextbox, 'Tag')
          await user.click(screen.getByRole('button', { name: 'Connect' }))
          const id = crypto.randomUUID()
          const firstMessage = {
            tag: '1st received',
            id,
            code: '// code',
          }
          getTestDoubleAccessor()?.simulateReceiveMessage(
            JSON.stringify(firstMessage)
          )
          rerender(<AppProvider />)
          expect(screen.getAllByRole('tab')).toHaveLength(2)
          expect(getByText(screen.getByRole('tablist'), firstMessage.tag))

          // act
          const secondMessage = {
            tag: '2nd message',
            id,
            code: '// code',
          }
          getTestDoubleAccessor()?.simulateReceiveMessage(
            JSON.stringify(secondMessage)
          )
          rerender(<AppProvider />)

          // assert
          expect(screen.getAllByRole('tab')).toHaveLength(2)
          expect(
            getByText(screen.getByRole('tablist'), secondMessage.tag)
          ).toBeInTheDocument()
        })

        it('should discard received message if message was send by self', async () => {
          // arrange
          const { rerender } = setup()
          const urlTextbox = screen.getByLabelText('WebSocket server URL')
          urlTextbox.focus()
          await user.type(urlTextbox, 'wss://example.com')
          const tagTextbox = screen.getByLabelText('Tag of your code')
          tagTextbox.focus()
          await user.type(tagTextbox, 'Tag')
          await user.click(screen.getByRole('button', { name: 'Connect' }))

          // act
          const message = {
            tag: 'sended code',
            id: webSocketConnectionInfo.id,
            code: '// code',
          }
          getTestDoubleAccessor()?.simulateReceiveMessage(
            JSON.stringify(message)
          )
          rerender(<AppProvider />)

          // assert
          expect(screen.getAllByRole('tab')).toHaveLength(1)
          expect(
            queryByText(screen.getByRole('tablist'), message.tag)
          ).not.toBeInTheDocument()
        })
      })
    })
  })
})
