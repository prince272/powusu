"use client";

import { ElementRef, forwardRef, useState } from "react";
import { EyeOffRegular, EyeRegular } from "@fluentui/react-icons";
import { Input, InputProps } from "@nextui-org/input";

const PasswordInput = forwardRef<ElementRef<typeof Input>, InputProps>((props, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Input
      endContent={
        <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
          {isVisible ? (
            <EyeOffRegular fontSize={24} className="pointer-events-none text-default-400" />
          ) : (
            <EyeRegular fontSize={24} className="pointer-events-none text-default-400" />
          )}
        </button>
      }
      type={isVisible ? props.type : "password"}
      {...props}
      ref={ref}
    />
  );
});
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
