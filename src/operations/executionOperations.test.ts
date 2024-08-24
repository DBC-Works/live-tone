import { Mock } from 'vitest'
import { Api, executeCode } from './executionOperations'

describe('executionOperation', () => {
  describe('executeCode', () => {
    const createApiMock = () => {
      const apiMock: { error: Error | null } & Api = {
        error: null,
        setPlay: vi.fn(),
        setError: vi.fn(),
      }
      const setErrorMock = apiMock.setError as Mock
      setErrorMock.mockImplementation((e: Error | null) => {
        apiMock.error = e
      })
      return apiMock
    }

    beforeAll(() => {
      vi.stubGlobal('alert', vi.fn())
    })

    it('should call `setPlay` api if code is valid', () => {
      // arrange
      const apiMock = createApiMock()

      // act
      executeCode('Tone.getTransport().start()', apiMock)

      // assert
      expect(apiMock.setPlay).toHaveBeenCalledTimes(1)
      expect(apiMock.setError).toHaveBeenCalledTimes(1)
      expect(apiMock.setError).toHaveBeenLastCalledWith(null)
    })

    it('should throw an error if code is invalid', () => {
      // arrange
      const apiMock = createApiMock()

      // act
      expect(() => {
        executeCode('invalid code', apiMock)
      }).toThrow()

      // assert
      expect(apiMock.setPlay).not.toHaveBeenCalled()
      expect(apiMock.setError).toHaveBeenCalledTimes(2)
      expect(apiMock.setError).toHaveBeenNthCalledWith(1, null)
      expect(apiMock.setError).toHaveBeenLastCalledWith(expect.anything())
    })

    it.each([
      ['eval', 'eval("Disallowed");'],
      ['assign', 'Object.assign(null, null);'],
      ['defineProperty', 'Object.defineProperty(null, null, null);'],
      ['call', 'call(null, null);'],
      ['Function', 'Function("disallowed");'],
      ['addEventListener', 'addEventListener("load", () => {});'],
      ['dispatchEvent', 'dispatchEvent(null);'],
      ['removeEventListener', 'removeEventListener("load", () => {});'],
      ['getElementById', "getElementById('disallowed')"],
      ['getElementsByTagName', "getElementsByTagName('disallowed')"],
      ['querySelector', "querySelector('disallowed')"],
      ['alert', 'alert("Disallowed call");'],
      ['confirm', 'confirm("Disallowed call");'],
      ['prompt', 'prompt("Disallowed call");'],
      ['scroll', 'scroll(0, 16);'],
      ['scrollBy', 'scrollBy(0, 16);'],
      ['scrollIntoView', 'scrollIntoView();'],
      ['scrollIntoViewIfNeeded', 'scrollIntoViewIfNeeded();'],
      ['scrollTo', 'scrollTo(0, 16);'],
      ['moveBy', 'moveBy(16, 16);'],
      ['moveTo', 'moveTo(16, 16);'],
      ['resizeBy', 'resizeBy(16, 16);'],
      ['resizeTo', 'resizeTo(16, 16);'],
      ['close', 'close();'],
      ['print', 'print();'],
      ['postMessage', 'postMessage("disallowed", "http://example.com");'],
      ['fetch', 'fetch("disallowed");'],
    ])(
      'should throw an error if code contains `%s` call',
      (keyword: string, code: string) => {
        // arrange
        const apiMock = createApiMock()

        // act
        expect(() => {
          executeCode(code, apiMock)
        }).toThrow()

        // assert
        expect(apiMock.setPlay).not.toHaveBeenCalled()
        expect(apiMock.setError).toHaveBeenCalledTimes(2)
        expect(apiMock.setError).toHaveBeenNthCalledWith(1, null)
        expect(apiMock.setError).toHaveBeenLastCalledWith(expect.anything())
        expect(apiMock.error!.message).toEqual(
          `Calling the '${keyword}' is not allowed`
        )
      }
    )

    it.each([
      ['Function', 'new Function("Disallowed");'],
      ['XMLHttpRequest', 'new XMLHttpRequest();'],
      ['WebSocket', 'new WebSocket("wss://example.com");'],
      ['RTCPeerConnection', 'new RTCPeerConnection();'],
    ])(
      'should throw an error if code creates an instance of `%s`',
      (keyword: string, code: string) => {
        // arrange
        const apiMock = createApiMock()

        // act
        expect(() => {
          executeCode(code, apiMock)
        }).toThrow()

        // assert
        expect(apiMock.setPlay).not.toHaveBeenCalled()
        expect(apiMock.setError).toHaveBeenCalledTimes(2)
        expect(apiMock.setError).toHaveBeenNthCalledWith(1, null)
        expect(apiMock.setError).toHaveBeenLastCalledWith(expect.anything())
        expect(apiMock.error!.message).toEqual(
          `Creation of an instance of '${keyword}' is not allowed`
        )
      }
    )

    it.each([
      ['prototype', 'new Object().prototype;'],
      ['__proto__', 'new Object().__proto__;'],
      ['__defineGetter__', 'new Object().__defineGetter__;'],
      ['__defineSetter__', 'new Object().__defineSetter__;'],
      ['__lookupGetter__', 'new Object().__lookupGetter__;'],
      ['__lookupSetter__', 'new Object().__lookupSetter__;'],
      ['constructor', 'new Object().toString.constructor;'],
      ['globalThis', 'globalThis;'],
      ['global', 'global;'],
      ['window', 'window;'],
      ['locationbar', 'locationbar;'],
      ['menubar', 'menubar;'],
      ['personalbar', 'personalbar;'],
      ['statusbar', 'statusbar;'],
      ['toolbar', 'toolbar;'],
      ['location', 'location;'],
      ['href', 'href;'],
      ['history', 'history;'],
      ['navigator', 'navigator;'],
      ['name', 'name;'],
      ['self', 'self;'],
      ['opener', 'opener;'],
      ['parent', 'parent;'],
      ['frames', 'frames;'],
      ['frameElement', 'frameElement;'],
      ['customElements', 'customElements;'],
      ['console', 'console.log("Disallowed");'],
      ['cookie', 'cookie;'],
      ['cookieStore', 'cookieStore;'],
      ['caches', 'caches.open("Disallowed");'],
      ['sessionStorage', 'sessionStorage.setItem("Disallowed", "Disallowed");'],
      ['localStorage', 'localStorage.setItem("Disallowed", "Disallowed");'],
      ['indexedDB', 'indexedDB.open("Disallowed")'],
      ['document', 'document;'],
    ])(
      'should throw an error if code refers `%s` property',
      (keyword: string, code: string) => {
        // arrange
        const apiMock = createApiMock()

        // act
        expect(() => {
          executeCode(code, apiMock)
        }).toThrow()

        // assert
        expect(apiMock.setPlay).not.toHaveBeenCalled()
        expect(apiMock.setError).toHaveBeenCalledTimes(2)
        expect(apiMock.setError).toHaveBeenNthCalledWith(1, null)
        expect(apiMock.setError).toHaveBeenLastCalledWith(expect.anything())
        expect(apiMock.error!.message).toEqual(
          `Referencing the '${keyword}' property is not allowed`
        )
      }
    )

    it('should throw a ValidationError if code contains many errors', () => {
      // arrange
      const apiMock = createApiMock()

      // act
      expect(() => {
        executeCode('alert();window;', apiMock)
      }).toThrow()

      // assert
      expect(apiMock.setPlay).not.toHaveBeenCalled()
      expect(apiMock.setError).toHaveBeenCalledTimes(2)
      expect(apiMock.setError).toHaveBeenNthCalledWith(1, null)
      expect(apiMock.setError).toHaveBeenLastCalledWith(expect.anything())
      expect(apiMock.error!.message).toMatch(
        /^Contains invalid codes\(such as:/
      )
    })
  })
})
