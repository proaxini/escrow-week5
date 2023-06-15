import React from "react";

const Button = ({ className, children }) => {
  return (
    <button className={`${className ? className : ""} text-[20px] shadow-lg bg-teal-950 text-[#fff] font-[700] px-[15px] py-[10px] py rounded-[5px]`}>
      {children}
    </button>
  );
};

export default Button;
