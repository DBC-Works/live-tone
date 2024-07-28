/**
 * Base class of Live tone error
 */
class LiveToneError extends Error {
  /**
   * static initializer
   */
  static {
    this.prototype.name = 'LiveToneError'
  }
}

/**
 * Disallowed function call error
 */
export class DisallowedFunctionCallError extends LiveToneError {
  /**
   * static initializer
   */
  static {
    this.prototype.name = 'DisallowedFunctionCallError'
  }
}

/**
 * Disallowed instance creation error
 */
export class DisallowedInstanceCreationError extends LiveToneError {
  /**
   * static initializer
   */
  static {
    this.prototype.name = 'DisallowedInstanceCreationError'
  }
}

/**
 * Disallowed property referencing error
 */
export class DisallowedPropertyReferencingError extends LiveToneError {
  /**
   * static initializer
   */
  static {
    this.prototype.name = 'DisallowedPropertyReferencingError'
  }
}

/**
 * Validation error
 */
export class ValidationError extends LiveToneError {
  /**
   * static initializer
   */
  static {
    this.prototype.name = 'ValidationError'
  }
}
