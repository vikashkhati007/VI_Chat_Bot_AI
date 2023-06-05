"use client"
import Image from "next/image";
const Button = ({src,onClick}:any) => {
  return (
    <>
      <button >
       <Image
          src={`${src}`}
          alt="send"
          width={45}
          height={45}
          onClick={onClick}
        ></Image>
      </button>
    </>
  );
};

export default Button;
