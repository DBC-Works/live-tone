import { parseScript } from 'esprima'
import { visit } from 'ast-types'

import { Disallowed } from '@/utilities/Disallowed'
import {
  DisallowedFunctionCallError,
  DisallowedInstanceCreationError,
  DisallowedPropertyReferencingError,
  ValidationError,
} from '@/utilities/errors'

/**
 * Invalid type
 */
export const InvalidTypes = {
  /**
   * Disallowed function call
   */
  DisallowedFunctionCall: 0,

  /**
   * Disallowed instance creation
   */
  DisallowedInstanceCreation: 1,

  /**
   * Disallowed property reference
   */
  DisallowedPropertyReferencing: 2,
} as const satisfies Record<string, number>
export type InvalidType = (typeof InvalidTypes)[keyof typeof InvalidTypes]

/**
 * Invalid information
 */
export type InvalidInfo = {
  /**
   * type
   */
  type: InvalidType

  /**
   * keyword
   */
  keyword: string

  /**
   * count
   */
  count: number
}

/**
 * Disallowed keyword sets
 */
const DISALLOWED_SETS = {
  functions: new Set(Disallowed.functions),
  objects: new Set(Disallowed.objects),
  keywords: new Set(
    Disallowed.properties
      .concat(Disallowed.objects)
      .concat(Disallowed.functions)
  ),
} as const satisfies Record<string, Set<string>>

/**
 * Validate code
 * @param code Code to validate
 * @returns Invalid information list
 */
export const validateCode = (code: string): InvalidInfo[] => {
  const propertyMap = new Map<string, number>()
  const functionMap = new Map<string, number>()
  const objectMap = new Map<string, number>()
  visit(parseScript(code), {
    visitCallExpression(path) {
      const {
        node: { callee },
      } = path

      const accessors = [
        {
          has: () => Object.hasOwn(callee, 'name'),
          value: () => (callee as any).name,
        },
        {
          has: () => Object.hasOwn(callee, 'property'),
          value: () => (callee as any).property.name,
        },
      ]
      const accessor = accessors.find(({ has }) => has())
      if (accessor !== undefined) {
        const name = accessor.value()
        if (DISALLOWED_SETS.functions.has(name)) {
          functionMap.set(name, (functionMap.get(name) ?? 0) + 1)
        }
      }

      this.traverse(path)
    },
    visitNewExpression(path) {
      const {
        node: { callee },
      } = path
      const name = (callee as any).name
      if (DISALLOWED_SETS.objects.has(name)) {
        objectMap.set(name, (objectMap.get(name) ?? 0) + 1)
      }

      this.traverse(path)
    },
    visitExpression(path) {
      const { value } = path
      if (Object.hasOwn(value, 'name')) {
        const { name } = value
        if (DISALLOWED_SETS.keywords.has(name)) {
          if (
            objectMap.has(name) === false &&
            functionMap.has(name) === false
          ) {
            propertyMap.set(name, (propertyMap.get(name) ?? 0) + 1)
          }
        }
      }

      this.traverse(path)
    },
  })

  const invalidInfoList: InvalidInfo[] = []

  const translationElements = [
    {
      type: InvalidTypes.DisallowedPropertyReferencing,
      map: propertyMap,
    },
    {
      type: InvalidTypes.DisallowedFunctionCall,
      map: functionMap,
    },
    {
      type: InvalidTypes.DisallowedInstanceCreation,
      map: objectMap,
    },
  ]
  for (const { type, map } of translationElements) {
    for (const [keyword, count] of map) {
      invalidInfoList.push({
        type,
        keyword,
        count,
      })
    }
  }

  return invalidInfoList
}

/**
 * Translate invalid information to Error instance
 * @param invalidInfo Invalid information
 * @returns Error instance
 */
const translateInvalidInfoToError = (invalidInfo: InvalidInfo): Error => {
  const translators = [
    {
      type: InvalidTypes.DisallowedPropertyReferencing,
      translate: () =>
        new DisallowedPropertyReferencingError(
          `Referencing the '${invalidInfo.keyword}' property is not allowed`
        ),
    },
    {
      type: InvalidTypes.DisallowedFunctionCall,
      translate: () =>
        new DisallowedFunctionCallError(
          `Calling the '${invalidInfo.keyword}' is not allowed`
        ),
    },
    {
      type: InvalidTypes.DisallowedInstanceCreation,
      translate: () =>
        new DisallowedInstanceCreationError(
          `Creation of an instance of '${invalidInfo.keyword}' is not allowed`
        ),
    },
  ]
  return translators
    .find((translator) => translator.type === invalidInfo.type)
    ?.translate() as Error
}

/**
 * Create Error instance from invalid information list
 * @param invalidInfoList Invalid information list
 * @returns Error instance
 */
export const createErrorFrom = (invalidInfoList: InvalidInfo[]): Error => {
  const error = translateInvalidInfoToError(
    invalidInfoList.sort((lhs, rhs) => {
      const count = lhs.count - rhs.count
      return count !== 0 ? rhs.type - lhs.type : count
    })[0]
  )

  return 1 < invalidInfoList.length
    ? new ValidationError(`Contains invalid codes(such as: ${error.message})`)
    : error
}
