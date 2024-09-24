type Props = React.ComponentProps<'input'> & {
  toggleColorClassName?:
    | 'toggle-primary'
    | 'toggle-secondary'
    | 'toggle-accent'
    | 'toggle-success'
    | 'toggle-warning'
    | 'toggle-info'
    | 'toggle-error'
}

/**
 * Labeled toggle component
 * @param props props
 * @returns Rendering result
 */
export const LabeledToggle: React.FC<Props> = ({
  id,
  checked,
  children,
  toggleColorClassName,
  disabled,
  onChange,
}): JSX.Element => (
  <div className="inline-block">
    <div className="flex items-center">
      <label className="cursor-pointer label label-text" htmlFor={id}>
        {children}
      </label>
      <input
        id={id}
        type="checkbox"
        className={`ml-1 toggle ${toggleColorClassName}`}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
    </div>
  </div>
)
