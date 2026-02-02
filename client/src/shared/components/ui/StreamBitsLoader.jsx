import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const StreamBitsLoader = () => {
    console.log("hey hey hey");
    
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <DotLottieReact
        src="/animations/Loading Files.lottie"
        loop
        autoplay
        style={{ width: 160, height: 160 }}
      />
    </div>
  );
};

export default StreamBitsLoader;
