"use client";
import { createContext, useContext, useState } from "react";

const SidebarContext = createContext<{ isOpen: boolean; toggle: () => void }>({
  isOpen: true,
  toggle: () => {},
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);

  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <SidebarContext.Provider value={{ isOpen, toggle }}>
      <div className="flex">{children}</div>
    </SidebarContext.Provider>
  );
}

export function SidebarInset({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) {
    const { isOpen } = useContext(SidebarContext);
    return (
      <div className={`transition-all duration-300 ${isOpen ? "ml-64" : "ml-16"} ${className}`}>
        {children}
      </div>
    );
  }

export function SidebarTrigger({ className }: { className?: string }) {
  const { toggle } = useContext(SidebarContext);
  return (
    <button
      onClick={toggle}
      className={`p-2 rounded-md hover:bg-neutral-800 ${className}`}
    >
      Toggle
    </button>
  );
}