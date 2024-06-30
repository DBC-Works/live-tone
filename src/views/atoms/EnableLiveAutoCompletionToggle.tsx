import { useCallback } from 'react'
import { useAtom } from 'jotai'

import { enableLiveAutoCompletionEditSettingsAtom } from '@/states/atoms'
import { LabeledToggle } from '@/views/atoms/LabeledToggle'

/**
 * EnableLiveAutoCompletionToggle component
 * @returns rendering result
 */
export const EnableLiveAutoCompletionToggle: React.FC = (): JSX.Element => {
  const [checked, enableLiveAutoCompletion] = useAtom(
    enableLiveAutoCompletionEditSettingsAtom
  )
  const handleChange = useCallback(() => {
    enableLiveAutoCompletion()
  }, [enableLiveAutoCompletion])

  return (
    <LabeledToggle
      id="enable-live-auto-completion-checkbox"
      toggleColorClassName="toggle-primary"
      checked={checked}
      onChange={handleChange}
    >
      enable live auto completion
    </LabeledToggle>
  )
}
