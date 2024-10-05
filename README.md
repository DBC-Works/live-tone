[![Build and test](https://github.com/DBC-Works/live-tone/actions/workflows/azure-static-web-apps-red-stone-026824a00.yml/badge.svg)](https://github.com/DBC-Works/live-tone/actions/workflows/azure-static-web-apps-red-stone-026824a00.yml)

# live tone(PoC)

'live tone' is a web application that can run [Tone.js](https://tonejs.github.io/) calling code in browser.

This project is a proof of concept. Please use at your own risk.

## Setup

1. Clone this repository to local
2. Open terminal and change current directory to repository clone directory
3. Run `npm install`
4. Run on local, or deploy to a web server and access

### Run on local

Run `npm run dev`.

### Run on server

1. Run `npm run build`
2. Deploy build files (in `./dist` directory) to the web server
3. Access the web server

#### Notes on web server configuration

The web server controls whether or not the code you enter can be executed.

If you cannot execute the input code on the deployed web server, please check the configuration of [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP).

## Play

1. Type the code using Tone.js in the text area
2. Press `Run` button to run the code
3. Press `Stop` button to stop the sound

### Rules

- **Do not type and run a malicious code**
- **Do not type and run a code that ends up in an infinite loop**
- Various `start` function (such as [Tone.start()](https://tonejs.github.io/docs/latest/functions/start.html)) don't call automatically. You must call the `LiveTone.start()` function yourself instead of any other start function.
- To set the bpm, please call the `LiveTone.setBpm(bpm: number)` function instead of updating `bpm.value` property.
- If you start a sound that is not associated with `Tone.Transport` (such as `Oscillator`), register that instance using the `LiveTone.registerPlaying()` function. If you don't register, you won't be able to stop.
- If you run it without stopping, the new sound will overlap the previous sound.

## Code sharing

If you have a WebSocket server (such as [Azure Web PubSub](https://azure.microsoft.com/products/web-pubsub)) that you manage, you can share your code with other live tone users.

1. Prepare the WebSocket server connection URL.
2. Paste the URL to "WebSocket server URL" text input field.
3. Enter your tag in the "Tag of your code" text input field.
4. Press "Connect" button to connect WebSocket server.
5. To share your code, press "Share" button.
6. When you receive a code shared by another user, an additional tab will appear. You can browse receive codes to click tabs(read only).
7. To execute all codes, press "Run" button.

### Note

- The BPM specified in your code will be used, The BPM specified in received codes will be ignored(as long as the BPM is specified using the `LiveTone.setBpm` function).
- Ignore the `LiveTone.start()` function call in received codes.

## CHANGELOG

[CHANGELOG](CHANGELOG.md)

## LICENSE

MIT
