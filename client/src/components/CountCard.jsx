import React from "react";

const CountCard = ({ count, label }) => {
  return (
    <div className="mx-3 w-full">
      <div className=" bg-slate-200 py-5 rounded-md mx-auto ">
        <div className="flex justify-center">{count}</div>
        <div className="flex justify-center">{label}</div>
      </div>
    </div>
  );
};

export default CountCard;
