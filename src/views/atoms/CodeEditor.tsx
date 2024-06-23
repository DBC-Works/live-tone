import AceEditor from 'react-ace'
import { useCallback } from 'react'
import { useAtom } from 'jotai'

import { liveCodeAtom } from '@/states/atoms'

import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/theme-xcode'
import 'ace-builds/src-noconflict/ext-language_tools'

type Props = React.ComponentProps<'div'>

/**
 * Code editor
 * @param props props
 * @returns Rendering result
 */
export const CodeEditor: React.FC<Props> = ({ id }: Props): JSX.Element => {
  const [liveCode, setLiveCode] = useAtom(liveCodeAtom)

  const handleOnChange = useCallback(
    (value: string) => {
      setLiveCode(() => value)
    },
    [setLiveCode]
  )

  return (
    <AceEditor
      name={id}
      mode="javascript"
      theme="xcode"
      fontSize={14}
      tabSize={2}
      width="100%"
      height="100%"
      showGutter={true}
      wrapEnabled={true}
      showPrintMargin={false}
      enableBasicAutocompletion={true}
      value={liveCode}
      onChange={handleOnChange}
    />
  )
}
