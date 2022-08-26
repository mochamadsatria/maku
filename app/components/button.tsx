import { motion } from "framer-motion";
import type { ReactNode } from "react";

export default function Button({
  children,
  disabled,
  type,
  onClick,
}: {
  children: ReactNode;
  disabled?: boolean;
  type?: "button" | "submit" | "reset" | undefined;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <motion.button
      {...(type && { type: type })}
      {...(onClick && { onClick: onClick })}
      {...(disabled && { disabled: disabled })}
      whileTap={{ scale: 0.9 }}
      className="text-lg font-bold py-2 bg-orange-300 disabled:bg-neutral-300 w-full"
    >
      {children}
    </motion.button>
  );
}
