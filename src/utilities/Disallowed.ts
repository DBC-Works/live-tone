import disallowed from '@/assets/disallowed.json'

/**
 * Disallowed information
 */
type DisallowedInfo = {
  properties: string[]
  functions: string[]
  objects: string[]
}

/**
 * Typed disallowed information instance
 */
export const Disallowed = disallowed as DisallowedInfo
