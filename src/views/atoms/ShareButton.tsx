import { useCallback } from 'react'
import { useSetAtom } from 'jotai'

import { shareCodeAtom } from '@/states/atoms'

// @ts-ignore
import ShareIcon from '@/assets/icons/Share.svg?react'

type Props = React.ComponentProps<'button'>

/**
 * Share button component
 * @returns Rendering result
 */
export const ShareButton: React.FC<Props> = ({ className }): JSX.Element => {
  const shareCode = useSetAtom(shareCodeAtom)

  const handleClick = useCallback(() => {
    shareCode()
  }, [shareCode])

  return (
    <button className={`btn w-full ${className}`} onClick={handleClick}>
      <ShareIcon />
      Share
    </button>
  )
}
