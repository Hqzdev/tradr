import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFAULT_REGISTRATION_DRAFT,
  buildRegistrationPayload,
  normalizeBudgetInput,
  validateRegistrationStep,
  type RegistrationDraft,
} from "./AuthWizard.ts";

function validDraft(overrides: Partial<RegistrationDraft> = {}): RegistrationDraft {
  return {
    ...DEFAULT_REGISTRATION_DRAFT,
    displayName: "Ярослав",
    email: "yaroslav@example.com",
    password: "password123",
    confirmPassword: "password123",
    ...overrides,
  };
}

test("blocks invalid profile and security steps", () => {
  assert.deepEqual(validateRegistrationStep(1, validDraft({ displayName: "", email: "bad" })), {
    displayName: "Введите имя — минимум 2 символа",
    email: "Введите корректный e-mail",
  });
  assert.deepEqual(validateRegistrationStep(2, validDraft({ password: "short", confirmPassword: "other" })), {
    password: "Минимум 8 символов",
    confirmPassword: "Пароли не совпадают",
  });
});

test("validates inclusive budget boundaries", () => {
  assert.deepEqual(validateRegistrationStep(3, validDraft({ budget: "1000" })), {});
  assert.deepEqual(validateRegistrationStep(3, validDraft({ budget: "100000" })), {});
  assert.ok(validateRegistrationStep(3, validDraft({ budget: "999" })).budget);
  assert.ok(validateRegistrationStep(3, validDraft({ budget: "100001" })).budget);
});

test("builds the atomic registration payload", () => {
  assert.deepEqual(buildRegistrationPayload(validDraft()), {
    displayName: "Ярослав",
    email: "yaroslav@example.com",
    password: "password123",
    firstAgent: {
      name: "Мой первый агент",
      strategy: "careful",
      budgetLimit: 75000,
    },
  });
});

test("normalizes formatted budget input", () => {
  assert.equal(normalizeBudgetInput("$ 25 000"), "25000");
  assert.equal(normalizeBudgetInput("1234567"), "123456");
});
