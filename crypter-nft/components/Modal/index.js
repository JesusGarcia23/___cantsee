import React, { useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock";


const isBrowser = typeof window !== "undefined";

const Modal = ({
  outerClassName,
  containerClassName,
  visible,
  onClose,
  children,
}) => {
  const escFunction = useCallback(
    (e) => {
      if (e.keyCode === 27) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);
    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [escFunction]);

  useEffect(() => {
    if (visible) {
      const target = document.querySelector("#modal");
      disableBodyScroll(target);
    } else {
      clearAllBodyScrollLocks();
    }
  }, [visible]);

  const DynamicComponentWithNoSSR = dynamic(
    () => import('../Portal'),
    { ssr: false }
  )

return (
  <>
    <DynamicComponentWithNoSSR 
      visible={visible} 
      onClose={onClose} 
      children={children}
      outerClassName={outerClassName}
      containerClassName={containerClassName}
    />  
  </>
  )
};

export default Modal;
