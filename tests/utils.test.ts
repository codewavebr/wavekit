import assert from "node:assert/strict";
import test from "node:test";
import { cn } from "../src/utils/cn.js";

test("merges class names and resolves tailwind conflicts", () => {
  assert.equal(cn("px-2", "px-4", false && "hidden", "text-sm"), "px-4 text-sm");
});
