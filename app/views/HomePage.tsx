import React from "react";
import PingButton from "../components/PingButton";

const HomePage = () => {
  return (
    <div className="flex flex-col  justify-center items-center mt-10 ">
      <PingButton />

      <h1 className="mt-5 text-slate-100">Lets Ping the contract</h1>
    </div>
  );
};

export default HomePage;
