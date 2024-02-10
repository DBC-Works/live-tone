[![Build and test](https://github.com/DBC-Works/live-tone/actions/workflows/azure-static-web-apps-red-stone-026824a00.yml/badge.svg)](https://github.com/DBC-Works/live-tone/actions/workflows/azure-static-web-apps-red-stone-026824a00.yml)

# live tone(PoC)

'live tone' is a web application that can run [Tone.js](https://tonejs.github.io/) calling code in browser.

This project is a proof of concept. Please use at your own risk.

## Setup

1. Clone this repository to local
2. Open terminal and change current directory to repository clone directory
3. Run `npm install`
4. Run on local, or deploy to web server and access

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
2. Select `Run` button to run the code
3. Select `Stop` button to stop the sound

### Rules

- **Do not type and run a malicious code**
- **Do not type and run a code that ends up in an infinite loop**
- Various `start` method (such as `Tone.Transport.start()`) do not call automatically. You must call yourself.
- If you start a sound that is not associated with `Tone.Transport` (such as `Oscillator`), register that instance using the `LiveTone.registerPlaying()` function. If you don't register, you won't be able to stop.
- If you run it without stopping, the new sound will overlap the previous sound.

## CHANGELOG

[CHANGELOG](CHANGELOG.md)

## LICENSE

MIT
