"use client"
import Image from "next/image";
const Button = ({src,onCLick}:any) => {
  return (
    <>
      <button className="">
       <Image
          src={`${src}`}
          alt="send"
          width={40}
          height={40}
          onClick={onCLick}
        ></Image>
      </button>
    </>
  );
};

export default Button;
