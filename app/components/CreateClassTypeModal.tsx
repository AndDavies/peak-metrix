"use client";

import React, { useState } from "react";
import BaseModal from "../components/BaseModal";
import { supabase } from "../utils/supabase";

interface CreateClassTypeModalProps {
  onClose: () => void;
  currentGymId: string;
  isVisible: boolean;
  refreshClassTypes: () => void;
}

const availableColors = [
  "#8e44ad","#a29bfe","#74b9ff","#55efc4",
  "#b2bec3","#ffeaa7","#fed330","#ff7675",
  "#fab1a0","#fdcb6e","#d63031","#e84393"
];

export default function CreateClassTypeModal({
  onClose,
  currentGymId,
  isVisible,
  refreshClassTypes,
}: CreateClassTypeModalProps) {
  const [className, setClassName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#6b5b95");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleCreate() {
    setIsSubmitting(true);
    setError(null);

    if (!className.trim()) {
      setError("Class name is required.");
      setIsSubmitting(false);
      return;
    }

    const { error: insertError } = await supabase
      .from("class_types")
      .insert([{ 
        class_name: className, 
        description, 
        color, 
        gym_id: currentGymId 
      }]);

    if (insertError) {
      setError(insertError.message);
    } else {
      refreshClassTypes();
      onClose();
    }
    setIsSubmitting(false);
  }

  return (
    <BaseModal isVisible={isVisible} onClose={onClose}>
      <div className="bg-gray-900 p-5 rounded-md text-gray-200">
        <h2 className="text-lg font-semibold mb-4">Create New Class Type</h2>
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-300">
            Class Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            className="w-full p-2 border border-gray-600 rounded text-sm bg-gray-800"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder="Enter class name"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-300">
            Description
          </label>
          <textarea
            className="w-full p-2 border border-gray-600 rounded text-sm bg-gray-800"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter class description (optional)"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-300">
            Color
          </label>
          <div className="flex flex-wrap gap-2">
            {availableColors.map((clr) => {
              const selected = clr === color;
              return (
                <button
                  key={clr}
                  type="button"
                  onClick={() => setColor(clr)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    selected
                      ? "border-pink-400 ring-2 ring-pink-400"
                      : "border-transparent hover:border-gray-500"
                  }`}
                  style={{ backgroundColor: clr }}
                />
              );
            })}
          </div>
        </div>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <div className="flex justify-end space-x-2 mt-4">
          <button
            type="button"
            className="px-3 py-1 text-sm rounded border border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreate}
            disabled={isSubmitting}
            className="px-3 py-1 text-sm rounded bg-pink-600 text-white hover:bg-pink-500"
          >
            {isSubmitting ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
