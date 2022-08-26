import { useForm } from "react-hook-form";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type AuthWithEmailAndPasswordInput = {
  email: string;
  password: string;
};

export default function AuthForm({
  title,
  error,
  onSubmit,
}: {
  title: string;
  error: any;
  onSubmit: (data: AuthWithEmailAndPasswordInput) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthWithEmailAndPasswordInput>();

  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex flex-col w-full">
      {error && (
        <span className="bg-red-200 py-2 px-4 flex justify-center ">
          <span>{error.message}</span>
        </span>
      )}

      <div className="flex w-full justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-10 p-10"
        >
          <h1 className="text-4xl font-bold">{title}</h1>
          <fieldset className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <input
                type="email"
                placeholder="Email address"
                id="email"
                {...register("email", { required: true })}
                className="w-full text-lg px-4 py-2"
              />
              {errors.email && (
                <span className="bg-red-200 py-1 px-4 w-full">
                  This field is required
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <input
                type="password"
                placeholder="Password"
                id="password"
                {...register("password", { required: true })}
                className="w-full text-lg px-4 py-2"
              />
              {errors.email && (
                <span className="bg-red-200 py-1 px-4 w-full">
                  This field is required
                </span>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={!isClient}
              whileTap={{ scale: 0.9 }}
              className="text-lg font-bold py-2 bg-orange-300 disabled:bg-neutral-300"
            >
              {title}
            </motion.button>
          </fieldset>
        </form>
      </div>
    </div>
  );
}
