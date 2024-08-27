import { useAtomValue } from 'jotai'

import { ConnectableStates } from '@/states/types'
import { connectableStateAtom } from '@/states/atoms'
import { ConnectButton } from '@/views/atoms/ConnectButton'

type Props = React.ComponentProps<'section'>

/**
 * SharingSection component
 * @param props Props
 * @returns Rendering result
 */
export const SharingSection: React.FC<Props> = ({
  className,
}): JSX.Element | null => {
  const connectableState = useAtomValue(connectableStateAtom)
  if (connectableState === ConnectableStates.LackOfInput) {
    return null
  }

  return (
    <section className={className}>
      <ConnectButton />
    </section>
  )
}
