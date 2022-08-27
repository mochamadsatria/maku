import { useState } from "react";
import Navbar from "~/components/navbar";

export default function Page() {
  const [donationsSnapshot, setDonationsSnapshot] = useState<any>();
  const [donations, setDonations] = useState<any>([]);

  return (
    <div className="overflow-hidden max-h-screen relative">
      <div className="relative z-40">
        <Navbar backTo="/restaurants" />
      </div>
    </div>
  );
}
