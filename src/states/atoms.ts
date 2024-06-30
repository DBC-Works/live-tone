import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

import { editSettings, runningState, runSettings } from './states'

/**
 * Running state atom
 */
export const runningStateAtom = atom(runningState)

/**
 * Update write-only atom
 */
export const updateAtom = atom(null, (_, set) => {
  set(runningStateAtom, (runningState) => {
    return {
      ...runningState,
      updated: true,
    }
  })
})

/**
 * Play write-only atom
 */
export const playAtom = atom(null, (_, set) => {
  set(runningStateAtom, (runningState) => {
    return {
      ...runningState,
      nowPlaying: true,
      updated: false,
    }
  })
})

/**
 * Reset running state write-only atom
 */
export const resetRunningStateAtom = atom(null, (_, set) => {
  set(runningStateAtom, (runningState) => {
    runningState.registeredPlayings.clear()
    return {
      ...runningState,
      nowPlaying: false,
      updated: false,
    }
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

/**
 * Edit settings atom
 */
export const editSettingsAtom = atomWithStorage('EditSettings', editSettings)

/**
 * Enable live auto completion read-write atom
 */
export const enableLiveAutoCompletionEditSettingsAtom = atom(
  (get) => get(editSettingsAtom).enableLiveAutoCompletion,
  (_, set) => {
    set(editSettingsAtom, (editSettings) => {
      return {
        ...editSettings,
        enableLiveAutoCompletion: !editSettings.enableLiveAutoCompletion,
      }
    })
  }
)
