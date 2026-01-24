"use client";

import { useEffect, useLayoutEffect } from 'react';

// This hook provides a safe way to use useLayoutEffect in a Next.js environment
// It uses useLayoutEffect on the client and useEffect on the server to avoid SSR warnings
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect;