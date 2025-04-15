// src/components/FadeInOnScroll.tsx
import React, { PropsWithChildren } from "react";
import { useInView } from "react-intersection-observer";
import "./FadeInOnScroll.css";

const FadeInOnScroll: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const { ref, inView } = useInView({
    threshold: 0.1,            // Trigger once 10% of the element is visible
    triggerOnce: true,         // Only animate once
    rootMargin: "-50px 0px",    // Start the animation 50px before the element enters
  });

  return (
    <div ref={ref} className={`fade-in-section ${inView ? "is-visible" : ""}`}>
      {children}
    </div>
  );
};

export default FadeInOnScroll;
