import { ChangeEvent, useCallback } from 'react'
import { useAtom, useAtomValue } from 'jotai'

import { evalErrorAtom, liveCodeAtom } from '@/states/atoms'

/**
 * Live code text area component
 * @returns rendering result
 */
export const LiveCodeTextArea: React.FC = (): JSX.Element => {
  const [liveCode, setLiveCode] = useAtom(liveCodeAtom)
  const evalError = useAtomValue(evalErrorAtom)

  const handleOnChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setLiveCode(() => e.target.value)
    },
    [setLiveCode]
  )

  const classNames = [
    'textarea',
    'textarea-bordered',
    'w-full',
    'h-full',
    'resize-none',
  ]
  if (evalError !== null) {
    classNames.push('textarea-error')
  }

  return (
    <div className="flex flex-col h-full">
      <div>
        <label htmlFor="code">Code to run:</label>
      </div>
      <div className="grow mt-1">
        <textarea
          id="code"
          className={classNames.join(' ')}
          spellCheck="false"
          onChange={handleOnChange}
          value={liveCode}
        ></textarea>
      </div>
    </div>
  )
}
