"use client";

import React from "react";

const NoSSR = ({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) {
    return <>{fallback}</> || <></>;
  }
  return <>{children}</>;
};
export default NoSSR;
