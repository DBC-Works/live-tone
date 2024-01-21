import { RunSettings, Stoppable } from './types'

/**
 * Run settings
 */
export const runSettings: RunSettings = {
  cancelTransportOnStop: true,
}

/**
 * Playing management set
 */
export const playingSet = new Set<Stoppable>([])
