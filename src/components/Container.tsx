import React from 'react';

const Container = (
  props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
) => {
  return (
    <div
      {...props}
      className={`lg:w-[600px] md:w-[500px] sm:w-[450px] max-sm:w-[94%] mx-auto flex flex-col gap-5 ${props.className}`}
    >
      {props.children}
    </div>
  );
};

export default Container;
