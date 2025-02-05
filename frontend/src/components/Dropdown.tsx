import { useState } from 'react';
import CaretDownImage from 'assets/caret-down-fill.svg';

interface Props {
  list: string[];
  disabled?: boolean;
  tabIndex?: number;
  chevronImage?: string;
  selectedValue: string;
  onSelectItem?: () => void;
  extraDropdownListClassNames?: string;
  extraDropdownButtonClassNames?: string;
  setSelectedItem: React.Dispatch<React.SetStateAction<string>>;
}

const Dropdown: React.FC<Props> = ({
  list,
  tabIndex,
  disabled,
  chevronImage,
  onSelectItem,
  selectedValue,
  setSelectedItem,
  extraDropdownListClassNames,
  extraDropdownButtonClassNames
}) => {
  const [dropdownActive, setDropdownActive] = useState(false);

  return (
    <button
      type='button'
      disabled={disabled}
      id='dropdown-button'
      tabIndex={tabIndex}
      aria-haspopup={true}
      aria-controls='dropdown-list'
      aria-expanded={dropdownActive}
      onBlur={() => setDropdownActive(false)}
      onClick={() => setDropdownActive(true)}
      className={`dropdown relative cursor-pointer w-[135px] border p-2 rounded-md flex items-center justify-center gap-0.5 text-[14px] font-normal -tracking-[0.165px] focus:border-lightning-yellow-900 disabled:cursor-not-allowed ${extraDropdownButtonClassNames}`}>
      <p className='!text-woodsmoke cursor-[inherit]'>{selectedValue}</p>
      <img
        alt='chevron-image'
        className='w-5 cursor-[inherit]'
        src={chevronImage ?? CaretDownImage}
      />

      <ul
        role='menu'
        id='dropdown-list'
        aria-labelledby='dropdown-button'
        className={`absolute z-[1] top-[calc(100%+5px)] w-full max-h-[150px] h-fit rounded-b-lg bg-swan-white shadow-md border border-[rgba(0,0,0,0.1)] flex flex-col overflow-y-auto duration-300 ${extraDropdownListClassNames} ${
          dropdownActive || 'opacity-0 invisible'
        }`}>
        {list.map((item, index) => (
          <li
            key={index}
            role='menuitem'
            className={`menu-item cursor-pointer py-1.5 ${item === selectedValue && 'selected'}`}
            onClick={e => {
              setSelectedItem(item);
              setDropdownActive(false);
              onSelectItem?.();
              e.stopPropagation();
            }}>
            {item}
          </li>
        ))}
      </ul>
    </button>
  );
};

export default Dropdown;
