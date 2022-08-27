import { Link } from "@remix-run/react";
import Button from "./button";

export default function Footer() {
  return (
    <div className="flex flex-col">
      <div className="bg-white w-full h-full py-10 px-10">
        <div className="bg-[url('/doodle/LovingDoodle.png')] bg-no-repeat bg-50% bg-right-bottom  flex flex-col gap-5 ">
          <h1 className="text-8xl font-black text-brand-green tracking-wide">
            ZERO FOOD WASTE POLICY
          </h1>
          <p className="text-4xl font-medium">
            We encourage people to not waste their food for no reason.
          </p>

          <div className="border-4 border-dashed border-brand-green p-10">
            <h2 className="text-2xl font-semibold">Fact</h2>
            <p className="w-full lg:w-1/3 text-justify">
              There are over 192 million people that do not have enough food to
              eat everyday according to what PBB reported. Especially with
              Covid-19 and war going on, it has been getting worse. It is
              reported that the number has increased by 40 million people in the
              last year. Hunger is a major issue in 53 countries currently. Due
              to the prolonged drought, consistent violence and rising food
              prices, it is leading more than 6 million people in Somalia in
              risk of hunger.
              <div className="mt-3">
                <Button>Learn more</Button>
              </div>
            </p>
          </div>
        </div>
      </div>
      <div className="px-10">
        <ul className="flex gap-5 py-4">
          <li>
            <Link to={""}>Privacy policy</Link>
          </li>
          <li>
            <Link to={""}>Terms</Link>
          </li>
          <li>
            <Link to={""}>Contact</Link>
          </li>
          <li>
            <Link to={""}>About us</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
