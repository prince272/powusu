"use client";

import { ElementRef, forwardRef, useState } from "react";
import { Icon } from "@/components/ui/icon";
import SolarEyeClosedBold from "@iconify/icons-solar/eye-closed-bold";
import SolarEyeBold from "@iconify/icons-solar/eye-bold";
import { Input, InputProps } from "@nextui-org/input";

const PasswordInput = forwardRef<ElementRef<typeof Input>, InputProps>((props, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Input
      endContent={
        <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
          {isVisible ? (
            <Icon className="pointer-events-none text-default-200" icon={SolarEyeClosedBold} width="24" height="24" />
          ) : (
            <Icon className="pointer-events-none text-default-200" icon={SolarEyeBold} width="24" height="24" />
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
