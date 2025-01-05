"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { supabase } from "@/app/utils/supabase";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Circle, CheckCircle } from "lucide-react";

type OnboardingData = {
  displayName: string;
  primaryGoal: string;
  activityLevel: string;
  weeklyFrequency: string;
  trainingType: string;
  injuries: string;
};

export default function OnboardingPage() {
  const { userData, isLoading } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState<OnboardingData>({
    displayName: "",
    primaryGoal: "improve_fitness",
    activityLevel: "moderately_active",
    weeklyFrequency: "3-4",
    trainingType: "mixed_modal",
    injuries: "",
  });

  // 6-step flow
  const [step, setStep] = useState<number>(1);

  // If userData exists and onboarding_completed is false -> skip (since now false means “DONE”).
  // If onboarding_completed is true, they're forced to do onboarding.
  useEffect(() => {
    if (!isLoading && userData) {
      if (userData.onboarding_completed === false) {
        // They are effectively “done” with onboarding -> skip
        router.push("/dashboard");
      }
    }
  }, [isLoading, userData, router]);

  if (isLoading || !userData) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        <p>Loading onboarding...</p>
      </div>
    );
  }

  const updateField = (field: keyof OnboardingData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // On final step
  const handleSubmit = async () => {
    if (!userData.user_id) {
      console.error("No user_id found, cannot update profile.");
      return;
    }

    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({
          display_name: formData.displayName,
          goals: formData.primaryGoal,
          activity_level: formData.activityLevel,
          // Since we want to set "false" to indicate they've completed
          onboarding_completed: false,

          bio: `Weekly Frequency: ${formData.weeklyFrequency}\nPreferred Training: ${formData.trainingType}\nInjuries: ${formData.injuries}`,
        })
        .eq("user_id", userData.user_id);

      if (error) {
        console.error("[Onboarding] supabase update error:", error.message);
        return;
      }

      // Then go to dashboard
      router.push("/dashboard");
    } catch (err: any) {
      console.error("[Onboarding] handleSubmit exception:", err.message);
    }
  };

  // Step transitions
  const goNext = () => setStep((prev) => prev + 1);
  const goPrev = () => setStep((prev) => prev - 1);

  const variants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2 className="text-xl font-bold mb-3">What’s your preferred name?</h2>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) => updateField("displayName", e.target.value)}
              className="w-full p-2 bg-neutral-800 rounded"
              placeholder="e.g. John, Jane, or a nickname"
            />
          </>
        );
      case 2:
        return (
          <>
            <h2 className="text-xl font-bold mb-3">What’s your primary fitness goal?</h2>
            <select
              value={formData.primaryGoal}
              onChange={(e) => updateField("primaryGoal", e.target.value)}
              className="w-full p-2 bg-neutral-800 rounded"
            >
              <option value="improve_fitness">Improve Overall Fitness</option>
              <option value="lose_weight">Lose Weight</option>
              <option value="gain_muscle">Gain Muscle</option>
              <option value="improve_endurance">Improve Endurance</option>
              <option value="sport_competition">Train for Competition</option>
            </select>
          </>
        );
      case 3:
        return (
          <>
            <h2 className="text-xl font-bold mb-3">How would you describe your current activity level?</h2>
            <select
              value={formData.activityLevel}
              onChange={(e) => updateField("activityLevel", e.target.value)}
              className="w-full p-2 bg-neutral-800 rounded"
            >
              <option value="sedentary">Sedentary</option>
              <option value="lightly_active">Lightly Active</option>
              <option value="moderately_active">Moderately Active</option>
              <option value="very_active">Very Active</option>
              <option value="super_active">Super Active</option>
            </select>
          </>
        );
      case 4:
        return (
          <>
            <h2 className="text-xl font-bold mb-3">How many days a week do you plan to train?</h2>
            <select
              value={formData.weeklyFrequency}
              onChange={(e) => updateField("weeklyFrequency", e.target.value)}
              className="w-full p-2 bg-neutral-800 rounded"
            >
              <option value="1-2">1-2 days/week</option>
              <option value="3-4">3-4 days/week</option>
              <option value="5-6">5-6 days/week</option>
              <option value="7+">7+ days/week</option>
            </select>
          </>
        );
      case 5:
        return (
          <>
            <h2 className="text-xl font-bold mb-3">What type of training interests you most?</h2>
            <select
              value={formData.trainingType}
              onChange={(e) => updateField("trainingType", e.target.value)}
              className="w-full p-2 bg-neutral-800 rounded"
            >
              <option value="mixed_modal">Mixed Modal / CrossFit</option>
              <option value="hyrox">Hyrox Training</option>
              <option value="endurance_running">Endurance / Running</option>
              <option value="strength_focus">Strength-Focused</option>
              <option value="gpp">GPP (General Physical Preparedness)</option>
            </select>
          </>
        );
      case 6:
        return (
          <>
            <h2 className="text-xl font-bold mb-3">Any past injuries or current limitations?</h2>
            <input
              type="text"
              value={formData.injuries}
              onChange={(e) => updateField("injuries", e.target.value)}
              className="w-full p-2 bg-neutral-800 rounded"
              placeholder="e.g. knee issues, shoulder pain..."
            />
          </>
        );
      default:
        return <></>;
    }
  };

  const renderButtons = () => {
    const showPrev = step > 1;
    const showNext = step < 6;
    const showSubmit = step === 6;

    return (
      <div className="mt-6 flex items-center justify-between">
        {showPrev ? (
          <Button variant="outline" onClick={goPrev}>
            Back
          </Button>
        ) : (
          <div />
        )}
        {showNext && (
          <Button className="bg-pink-500 hover:bg-pink-600" onClick={goNext}>
            Next
          </Button>
        )}
        {showSubmit && (
          <Button className="bg-pink-500 hover:bg-pink-600" onClick={handleSubmit}>
            Finish
          </Button>
        )}
      </div>
    );
  };

  // Steps for icon display
  const steps = [1, 2, 3, 4, 5, 6];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      {/* Progress Indicator */}
      <div className="flex space-x-2 mb-6">
        {steps.map((s) => {
          const completed = s < step;
          const active = s === step;
          if (completed) {
            return <CheckCircle key={s} className="text-pink-500 h-6 w-6" />;
          } else if (active) {
            return <Circle key={s} className="text-white h-6 w-6 animate-pulse" />;
          } else {
            return <Circle key={s} className="text-gray-600 h-6 w-6" />;
          }
        })}
      </div>

      <div className="max-w-md w-full bg-neutral-900 p-6 rounded shadow">
        <motion.div
          key={step}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {renderStep()}
          {renderButtons()}
        </motion.div>
      </div>
    </div>
  );
}
