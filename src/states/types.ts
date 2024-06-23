/**
 * Stoppable - instance that has `stop` method
 * this is for runtime evaluation instance
 */
export type Stoppable = any

/**
 * Running state
 */
export type RunningState = {
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
