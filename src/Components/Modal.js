import { useEffect } from "react";
import { createPortal } from "react-dom";

function Modal({ children }) {
  const modalContainer = document.querySelector("#modal");
  const body = document.querySelector("body");
  const modal = document.createElement("div");
  modal.setAttribute(
    "class",
    "w-screen h-screen fixed z-10 top-0 bg-accent-gray flex justify-center items-center"
  );
  useEffect(() => {
    body.style.overflow = "hidden";
    modalContainer.appendChild(modal);
    return () => {
      body.style.overflow = "scroll";
      modalContainer.removeChild(modal);
    };
  }, []);
  return createPortal(children, modal);
}

export default Modal;
