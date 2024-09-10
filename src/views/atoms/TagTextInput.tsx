import { ChangeEvent, useCallback } from 'react'
import { useAtom } from 'jotai'

import { tagOfCodeAtom } from '@/states/atoms'
import { LabeledTextInput } from '@/views/atoms/LabeledTextInput'

type Props = React.ComponentProps<'input'>

/**
 * Tag input text
 * @returns Rendering result
 */
export const TagTextInput: React.FC<Props> = (): JSX.Element => {
  const [tagOfCode, setTagOfCode] = useAtom(tagOfCodeAtom)

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
      onChange={handleChange}
    >
      Tag of your code
    </LabeledTextInput>
  )
}
