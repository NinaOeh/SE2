import React, { useState } from "react";

interface Props {
	html: JSX.Element;
  	onClick: (isChecked: boolean, e: React.MouseEvent<HTMLDivElement>) => void;
	onMouseEnter?: (isChecked: boolean, e: React.MouseEvent<HTMLDivElement>) => void;
	onMouseLeave?: (isChecked: boolean, e: React.MouseEvent<HTMLDivElement>) => void;
	className?: string;
	forceState?: boolean;
	style?: React.CSSProperties;
}

const Checkbox = (props: Props) => {
	const { forceState, className, html, onClick, onMouseEnter, onMouseLeave, style } = props;
  	const [ isChecked, setChecked ] = useState<boolean>(forceState || false)	
	  	
  	return (
        <div 
            className={`${className || ''} btn ${(forceState === undefined ? isChecked : forceState) ? 'btn-checked' : ''}`}
			style={style}
            onClick={(e) => { 	
				const update = forceState === undefined ? !isChecked : !forceState								
				onClick( update, e ); 
				setChecked( update ); 
			}}
			onMouseEnter={(e) => {
				const update = forceState === undefined ? !isChecked : !forceState								
				var isValid = props.onMouseEnter || null;
				if(isValid){
					onMouseEnter!(isChecked, e);
					setChecked( update );
				}
			}}
			onMouseLeave={(e) => {
				const update = forceState === undefined ? !isChecked : !forceState								
				var isValid = props.onMouseLeave || null;
				if(isValid){
					onMouseLeave!(isChecked, e);
					setChecked( update );
				}
			}}
		>
			{html}
        </div>
  	);
};
export default Checkbox;