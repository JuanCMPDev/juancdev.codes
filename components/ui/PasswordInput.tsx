import { EyeOffIcon, EyeIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Box } from "@/components/ui/Box";
import { Input } from "@/components/ui/input";
import { createElement, useState } from "react";

type PasswordInputProps = {
  name: string;
  placeholder?: string;
  description?: string | JSX.Element;
};

export function PassworInput({
  name,
  placeholder = "",
  description,
}: PasswordInputProps) {
  const { setValue, getValues, getFieldState } = useFormContext();
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  return (
    <Box className="relative">
      <Input
        value={getValues(name)}
        onChange={(e) => setValue(name, e.target.value)}
        type={passwordVisibility ? "text" : "password"}
        placeholder={placeholder}
        autoComplete="on"
        className={`pr-12 ${getFieldState(name).error && "text-destructive"}`}
      />
      <Box
        className="absolute inset-y-0 right-0 flex cursor-pointer items-center p-3 text-muted-foreground"
        onClick={() => setPasswordVisibility(!passwordVisibility)}
      >
        {createElement(passwordVisibility ? EyeOffIcon : EyeIcon, {
          className: "h-6 w-6",
        })}
      </Box>
      {description && <p>{description}</p>}
    </Box>
  );
}
