// app/signup/page.tsx
import React from "react";
import SignupClient from "./SignupClient";

// By default, files in app/* are server components unless you add "use client"
export default function SignupPage() {
  // Simply render the client component. No references to searchParams here!
  return <SignupClient />;
}
