import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

function Modal({ children }) {
  const modalContainer = document.querySelector("#modal");
  const body = document.querySelector("body");
  const ref = useRef(null);
  if (!ref.current) {
    const node = document.createElement("div");
    node.setAttribute(
      "class",
      "w-screen h-screen fixed z-10 top-0 bg-accent-gray flex justify-center items-center"
    );
    ref.current = node;
  }
  useEffect(() => {
    body.style.overflow = "hidden";
    modalContainer.appendChild(ref.current);
    return () => {
      body.style.overflow = "scroll";
      modalContainer.removeChild(ref.current);
    };
  }, []);
  return createPortal(children, ref.current);
}

export default Modal;
