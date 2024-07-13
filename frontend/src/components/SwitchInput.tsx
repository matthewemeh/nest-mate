import Switch from 'react-switch';

interface Props {
  label?: string;
  width?: number;
  height?: number;
  checked: boolean;
  onColor?: string;
  switchID?: string;
  disabled?: boolean;
  boxShadow?: string;
  onChecked?: () => void;
  onHandleColor?: string;
  handleDiameter?: number;
  activeBoxShadow?: string;
  extraClassNames?: string;
  checkedIcon?: boolean | JSX.Element;
  uncheckedIcon?: boolean | JSX.Element;
  setChecked: React.Dispatch<React.SetStateAction<boolean>>;
}

const SwitchInput: React.FC<Props> = ({
  label,
  width,
  height,
  checked,
  onColor,
  switchID,
  disabled,
  onChecked,
  boxShadow,
  setChecked,
  checkedIcon,
  uncheckedIcon,
  onHandleColor,
  handleDiameter,
  activeBoxShadow,
  extraClassNames
}) => {
  return (
    <label
      htmlFor={switchID}
      className={`cursor-pointer flex items-center justify-between ${extraClassNames}`}>
      {label && <span className='!text-woodsmoke'>{label}</span>}
      <Switch
        checked={checked}
        onChange={() => {
          setChecked(!checked);
          onChecked && onChecked();
        }}
        id={switchID}
        width={width}
        height={height}
        onColor={onColor}
        disabled={disabled}
        boxShadow={boxShadow}
        checkedIcon={checkedIcon}
        uncheckedIcon={uncheckedIcon}
        onHandleColor={onHandleColor}
        handleDiameter={handleDiameter}
        activeBoxShadow={activeBoxShadow}
        className='disabled:cursor-not-allowed'
      />
    </label>
  );
};

export default SwitchInput;
