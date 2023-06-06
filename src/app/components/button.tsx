"use client";
import Image from "next/image";
const Button = ({ src, onClick, id, className, btnid, ref }: any) => {
  return (
    <>
      <button className={className} id={btnid}>
        <Image
          ref={ref}
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
