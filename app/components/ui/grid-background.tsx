import React from "react";

export function GridBackground({
  children,
  classNames,
}: {
  children: React.ReactNode;
  classNames?: string;
}) {
  return (
    <div
      className={`w-full h-full dark:bg-slate-950 bg-slate-100  dark:bg-grid-white/[0.07] bg-grid-black/[0.07] relative ${classNames}`}
    >
      <div className="z-20">{children}</div>
    </div>
  );
}
