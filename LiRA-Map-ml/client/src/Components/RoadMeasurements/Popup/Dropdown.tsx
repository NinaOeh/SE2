// created by Nina Oehlckers (s213535)
import React, { useEffect, useState } from 'react';

type DropDownProps = {
  measurements: string[];
  showDropDown: boolean;
  toggleDropDown: Function;
  measurementSelection: Function;
};

const DropDown: React.FC<DropDownProps> = (props: DropDownProps) => {
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const { measurements, measurementSelection } = props;

  const onClickHandler = (measurement: string): void => {
    measurementSelection(measurement);
  };

  useEffect(() => {
    setShowDropDown(showDropDown);
  }, [showDropDown]);

  return (
    <>
      <div className={showDropDown ? 'dropdown' : 'dropdown active'}>
        {measurements.map(
          (measurement: string, index: number): JSX.Element => {
            return (
              <p
                key={index}
                onClick={(): void => {
                  onClickHandler(measurement);
                }}

              >
                {measurement}
              </p>
            );
          }
        )}
      </div>
    </>
  );
};

export default DropDown;