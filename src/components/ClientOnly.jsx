"use client";

import { useState, useEffect } from 'react';

// This component ensures that children are only rendered on the client side
// Use this to wrap components that use useLayoutEffect or other client-only features
const ClientOnly = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only render children on the client side
  if (!mounted) return null;
  
  return <>{children}</>;
};

export default ClientOnly;