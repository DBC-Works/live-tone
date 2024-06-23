import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

import { runningState, runSettings } from './states'

/**
 * Playing management atom
 */
export const playingAtom = atom(runningState)

/**
 * Reset playing write-only atom
 */
export const resetPlayingAtom = atom(null, (_, set) => {
  set(playingAtom, (runningState) => {
    runningState.registeredPlayings.clear()
    return runningState
  })
})

/**
 * Live code atom
 */
export const liveCodeAtom = atomWithStorage('liveCode', '')

/**
 * Eval error atom
 */
export const evalErrorAtom = atom<Error | null>(null)

/**
 * Run settings atom
 */
export const runSettingsAtom = atomWithStorage('RunSettings', runSettings)

/**
 * Cancel transport on stop setting read-write atom
 */
export const cancelTransportOnStopRunSettingsAtom = atom(
  (get) => get(runSettingsAtom).cancelTransportOnStop,
  (_, set) => {
    set(runSettingsAtom, (runSettings) => {
      return {
        ...runSettings,
        cancelTransportOnStop: !runSettings.cancelTransportOnStop,
      }
    })
  }
)
