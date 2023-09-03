"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("b4b4f4d5-8406-48ff-b631-aec249ca8d55");
  }, []);

  return null;
}
