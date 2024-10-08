import { useCallback } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/theme-xcode'
import 'ace-builds/src-noconflict/ext-language_tools'

import {
  editSettingsAtom,
  liveCodeAtom,
  runningStateAtom,
  selectedCodeAtom,
  updateAtom,
} from '@/states/atoms'

type Props = React.ComponentProps<'div'>

/**
 * Code editor
 * @param props props
 * @returns Rendering result
 */
export const CodeEditor: React.FC<Props> = ({ id }: Props): JSX.Element => {
  const { editable, code } = useAtomValue(selectedCodeAtom)
  const setLiveCode = useSetAtom(liveCodeAtom)
  const { enableLiveAutoCompletion } = useAtomValue(editSettingsAtom)
  const { updated } = useAtomValue(runningStateAtom)
  const update = useSetAtom(updateAtom)

  const handleChange = useCallback(
    (value: string) => {
      if (editable !== false) {
        setLiveCode(() => value)
        if (updated === false) {
          update()
        }
      }
    },
    [editable, setLiveCode, update, updated]
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
      enableLiveAutocompletion={enableLiveAutoCompletion}
      value={code}
      readOnly={editable === false}
      onChange={handleChange}
    />
  )
}
