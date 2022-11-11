import React, { useEffect, useState } from 'react';

type DropDownProps = {
  numbers: number[];
  showDropDown: boolean;
  toggleDropDown: Function;
  filterSelection: Function;
};

const DropDown: React.FC<DropDownProps> = ({
  numbers,
  filterSelection,
}: DropDownProps): JSX.Element => {
  const [showDropDown, setShowDropDown] = useState<boolean>(false);

  /**
   * Handle passing the city name
   * back to the parent component
   *
   * @param city  The selected city
   */
  const onClickHandler = (city: number): void => {
    filterSelection(city);
  };

  useEffect(() => {
    setShowDropDown(showDropDown);
  }, [showDropDown]);

  return (
    <>
      <div className={showDropDown ? 'dropdown' : 'dropdown active'}>
        {numbers.map(
          (city: number, index: number): JSX.Element => {
            return (
              <p
                key={index}
                onClick={(): void => {
                  onClickHandler(city);
                }}
              >
                {city}
              </p>
            );
          }
        )}
      </div>
    </>
  );
};

export default DropDown;
