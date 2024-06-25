/**
 * Stoppable - instance that has `stop` method
 * this is for runtime evaluation instance
 */
export type Stoppable = any

/**
 * Code state
 */
export const CodeState = {
  /**
   * Ready - not playing
   */
  Ready: 'Ready',

  /**
   * Playing - No code edits after playing
   */
  Playing: 'Playing',

  /**
   * Updated - Edit code after playing
   */
  Updated: 'Updated',

  /**
   * Error
   */
  Error: 'Error',
} as const
export type CodeState = (typeof CodeState)[keyof typeof CodeState]

/**
 * Running state
 */
export type RunningState = {
  /**
   * Playing
   */
  nowPlaying: boolean

  /**
   * Code updated
   */
  updated: boolean

  /**
   * Registered playings
   */
  registeredPlayings: Set<Stoppable>
}

/**
 * Run settings
 */
export type RunSettings = {
  /**
   * Cancel transport on stop
   */
  cancelTransportOnStop: boolean
}
