import { useAtomValue } from 'jotai'

import { ConnectableStates, ConnectionStates } from '@/states/types'
import { connectableStateAtom, connectionStateAtom } from '@/states/atoms'
import { ConnectButton } from '@/views/atoms/ConnectButton'
import { ShareButton } from '@/views/atoms/ShareButton'

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
  const connectionState = useAtomValue(connectionStateAtom)
  if (connectableState === ConnectableStates.LackOfInput) {
    return null
  }

  let sectionClasses = [className]
  if (connectionState === ConnectionStates.Connected) {
    sectionClasses = sectionClasses.concat('grid', 'grid-cols-3', 'gap-4')
  }

  return (
    <section className={sectionClasses.join(' ')}>
      {connectionState === ConnectionStates.Connected && (
        <ShareButton className="col-span-2" />
      )}
      <ConnectButton />
    </section>
  )
}
