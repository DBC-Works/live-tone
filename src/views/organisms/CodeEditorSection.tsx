import { ChangeEvent, useCallback } from 'react'
import { useAtom, useAtomValue } from 'jotai'

import { evalErrorAtom, liveCodeAtom } from '@/states/atoms'
import { EvalError } from '@/views/atoms/EvalError'

type Props = React.ComponentProps<'section'>

/**
 * Code editor section
 * @param props props
 * @returns Rendering result
 */
export const CodeEditorSection: React.FC<Props> = ({
  className,
}): JSX.Element => {
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
    'resize-none',
    'w-full',
    'h-full',
    'grow',
    'mt-1',
  ]
  if (evalError !== null) {
    classNames.push('textarea-error')
  }

  return (
    <section className={`${className} flex flex-col`}>
      <h2 className="text-base">
        <label htmlFor="code">Code to run</label>
      </h2>
      <textarea
        id="code"
        className={classNames.join(' ')}
        spellCheck="false"
        onChange={handleOnChange}
        value={liveCode}
      ></textarea>
      {evalError !== null && (
        <div className="basis-1 mt-2">
          <EvalError />
        </div>
      )}
    </section>
  )
}
