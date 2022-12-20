// created by Caroline (s194570), Andreas (s194614)
import React, { FC } from "react";

//Author: Caroline (s194570), Andreas (s194614)
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