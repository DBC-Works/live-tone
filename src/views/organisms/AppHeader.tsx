// @ts-ignore
import AppIcon from '@/assets/icons/App.svg?react'
// @ts-ignore
import OpenInNewIcon from '@/assets/icons/OpenInNew.svg?react'

/**
 * App header component
 * @returns rendering result
 */
export const AppHeader: React.FC = (): JSX.Element => (
  <header>
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <AppIcon />
        <span className="btn btn-ghost text-xl">live tone</span>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a href="https://tonejs.github.io/docs/" target="_blank">
              Tone.js Doc
              <OpenInNewIcon />
            </a>
          </li>
        </ul>
      </div>
    </div>
  </header>
)
