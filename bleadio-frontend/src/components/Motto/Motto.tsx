export const Motto = () => {
  return (
    <div className="flex content-center justify-center w-full mb-8">
      <div className="w-full bg-accent/50 border-l-4 border-b-6 border-primary p-2 text-center rounded-md rounded-tl-none">
        <span className="font-mono text-wrap text-xl">
          {"Receive custom "}
          <span className="text-2xl text-primary">{"notifications"}</span>
          <span>{" from your e-businesses"}</span>
          <br />
          {"straight to your "}
          <span className="text-2xl text-primary">{"personal Telegram."}</span>
          <br />
          <span className="text-2xl text-primary">{"Easy"}</span>
          {" integration. "}
          <span className="text-2xl text-primary">{"Free plan"}</span>
          {" available."}
        </span>
      </div>
    </div>
  );
};
