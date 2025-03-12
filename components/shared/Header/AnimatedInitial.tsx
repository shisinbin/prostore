'use client';
import React from 'react';

function AnimatedInitial({ initial }: { initial: string }) {
  const [displayInitial, setDisplayInitial] = React.useState(initial);
  const [animating, setAnimating] = React.useState(false);

  React.useEffect(() => {
    if (initial !== displayInitial) {
      setAnimating(true);
      const timeoutId = setTimeout(() => {
        setDisplayInitial(initial);
        setAnimating(false);
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [initial, displayInitial]);

  return (
    <span
      className={`transition-opacity duration-300 ${
        animating ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {displayInitial}
    </span>
  );
}

export default AnimatedInitial;
