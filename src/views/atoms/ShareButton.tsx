import { useCallback } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'

import { shareCodeAtom, tagOfCodeAtom } from '@/states/atoms'

// @ts-ignore
import ShareIcon from '@/assets/icons/Share.svg?react'

type Props = React.ComponentProps<'button'>

/**
 * Share button component
 * @returns Rendering result
 */
export const ShareButton: React.FC<Props> = ({ className }): JSX.Element => {
  const shareCode = useSetAtom(shareCodeAtom)
  const tagOfCode = useAtomValue(tagOfCodeAtom)

  const handleClick = useCallback(() => {
    shareCode()
  }, [shareCode])

  return (
    <button
      className={`btn w-full ${className}`}
      disabled={tagOfCode.length === 0}
      onClick={handleClick}
    >
      <ShareIcon />
      Share
    </button>
  )
}
