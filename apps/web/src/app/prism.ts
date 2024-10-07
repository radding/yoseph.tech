"use client";

import { useEffect } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-okaidia.css";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-graphql";


export default function PrismLoader() {
  useEffect(() => {
    Prism.highlightAll();
  }, []);
  return null;
}