import { useCallback } from 'react'
import { useAtom } from 'jotai'

import { cancelTransportOnStopRunSettingsAtom } from '@/states/atoms'
import { LabeledToggle } from '@/views/atoms/LabeledToggle'

/**
 * CancelTransportToggle component
 * @returns rendering result
 */
export const CancelTransportToggle: React.FC = (): JSX.Element => {
  const [checked, toggleCancelTransportOnStop] = useAtom(
    cancelTransportOnStopRunSettingsAtom
  )
  const handleChange = useCallback(() => {
    toggleCancelTransportOnStop()
  }, [toggleCancelTransportOnStop])

  return (
    <LabeledToggle
      id="cancel-transport-checkbox"
      toggleColorClassName="toggle-primary"
      checked={checked}
      onChange={handleChange}
    >
      cancel `transport` on stop
    </LabeledToggle>
  )
}
