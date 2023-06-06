"use client"
import Image from "next/image";
const Button = ({src,onClick,id, className, btnid}:any) => {
  return (
    <>
      <button className={className} id={btnid}>
       <Image
          id={id}
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
