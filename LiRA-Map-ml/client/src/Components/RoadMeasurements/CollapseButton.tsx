import React, { FC } from "react";

interface Props {
    handleCollapse: (isCollapsed: boolean, e: React.MouseEvent<HTMLDivElement>) => void;
    isCollapsed: boolean;
}

const CollapseButton = (props: Props) => {
    return (
      <div 
        className="checkbox-wrapper" 
        onClick={(e) =>{
            // console.log(props.isCollapsed);
      }}>
        <label>
          <input type="checkbox" />
          <span>{"Collapse"}</span>
        </label>
      </div>
    );
  };
  export default CollapseButton;