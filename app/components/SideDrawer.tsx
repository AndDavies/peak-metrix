"use client";
import React, { useEffect } from "react";

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function SideDrawer({
  isOpen,
  onClose,
  title,
  children,
}: SideDrawerProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      {/* Drawer */}
      <div className="relative ml-auto w-full max-w-md h-full bg-white text-gray-900 shadow-xl animate-slideIn">
        <div className="p-4 border-b border-gray-300 flex items-center justify-between">
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
          <button
            className="text-gray-700 hover:text-gray-900 focus:outline-none"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="flex-grow overflow-auto">{children}</div>
      </div>
    </div>
  );
}
