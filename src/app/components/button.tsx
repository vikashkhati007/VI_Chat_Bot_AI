"use client"
import Image from "next/image";
const Button = ({src,onCLick}:any) => {
  return (
    <>
      <button className="">
       <Image
          src={`${src}`}
          alt="send"
          width={45}
          height={45}
          onClick={onCLick}
        ></Image>
      </button>
    </>
  );
};

export default Button;
