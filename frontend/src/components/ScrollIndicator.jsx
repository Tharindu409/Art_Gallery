import React from "react";

function ScrollIndicator() {
  return (
    <div className="fixed bottom-8 w-full z-50 flex justify-center">
      <div className="max-w-[1200px] w-full px-8 flex justify-center">
        <div className="text-white text-sm bg-black/50 px-4 py-2 rounded-full animate-bounce tracking-wide">
          Scroll to navigate
        </div>
      </div>
    </div>
  );
}

export default ScrollIndicator;
