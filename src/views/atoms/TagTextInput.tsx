import { ChangeEvent, useCallback } from 'react'
import { useAtom, useAtomValue } from 'jotai'

import { ConnectionStates } from '@/states/types'
import { connectionStateAtom, tagOfCodeAtom } from '@/states/atoms'
import { LabeledTextInput } from '@/views/atoms/LabeledTextInput'

type Props = React.ComponentProps<'input'>

/**
 * Tag input text
 * @returns Rendering result
 */
export const TagTextInput: React.FC<Props> = (): JSX.Element => {
  const [tagOfCode, setTagOfCode] = useAtom(tagOfCodeAtom)
  const connectionState = useAtomValue(connectionStateAtom)

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setTagOfCode(e.target.value)
    },
    [setTagOfCode]
  )

  return (
    <LabeledTextInput
      id="tag-of-your-code"
      type="text"
      value={tagOfCode}
      readOnly={connectionState === ConnectionStates.Connected}
      onChange={handleChange}
    >
      Tag of your code
    </LabeledTextInput>
  )
}
