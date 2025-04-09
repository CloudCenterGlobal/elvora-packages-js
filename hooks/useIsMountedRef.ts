"use client";

import { useEffect, useState } from "react";

const useIsMountedRef = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
};

export { useIsMountedRef };
