import { describe, expect, it } from "vitest";
import { mergeCaptures } from "./santander.js";
import { MOVEMENT_SOURCE, type BankMovement } from "../types.js";

const mv = (description: string, amount: number, date = "22-10-2026"): BankMovement => ({
  date, description, amount, balance: 0, source: MOVEMENT_SOURCE.credit_card_billed,
});
const normalize = (captures: unknown[]) => captures.flatMap((c) => c as BankMovement[]);

describe("mergeCaptures", () => {
  it("dos respuestas idénticas no duplican movimientos", () => {
    const r = [mv("UBER EATS", -11232), mv("INTERESES", -29354)];
    expect(mergeCaptures([r, r], normalize)).toHaveLength(2);
  });
  it("respuestas que se solapan aportan solo lo nuevo", () => {
    const a = [mv("A", -1), mv("B", -2)];
    const b = [mv("B", -2), mv("C", -3)];
    expect(mergeCaptures([a, b], normalize).map((m) => m.description).sort()).toEqual(["A", "B", "C"]);
  });
  it("dos compras idénticas dentro de una misma respuesta se conservan", () => {
    const a = [mv("CAFE", -2000), mv("CAFE", -2000)];
    expect(mergeCaptures([a, [mv("CAFE", -2000)]], normalize)).toHaveLength(2);
  });
});
