"use client";

import { useActionState } from "react";
import { saveSettings } from "./actions";

interface SettingsFormProps {
  model: string;
  capping: {
    headMessages: number;
    tailMessages: number;
    middleSample: number;
    maxTokens: number;
  };
}

export function SettingsForm({ model, capping }: SettingsFormProps) {
  const [state, formAction, isPending] = useActionState(saveSettings, null);

  const inputClass =
    "w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 text-sm font-[family-name:var(--font-lora)] text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-400";
  const labelClass =
    "block font-[family-name:var(--font-lora)] text-sm font-medium text-stone-700 mb-1";

  return (
    <form action={formAction} className="space-y-8 max-w-md">
      <fieldset>
        <legend className="font-[family-name:var(--font-playfair)] text-lg font-bold text-stone-800 mb-4">
          AI Model
        </legend>
        <div>
          <label htmlFor="model" className={labelClass}>Model ID</label>
          <select name="model" id="model" defaultValue={model} className={inputClass}>
            <optgroup label="Google">
              <option value="google/gemini-2.5-flash">Gemini 2.5 Flash</option>
              <option value="google/gemini-2.5-pro">Gemini 2.5 Pro</option>
            </optgroup>
            <optgroup label="Anthropic">
              <option value="anthropic/claude-sonnet-4">Claude Sonnet 4</option>
              <option value="anthropic/claude-haiku-4">Claude Haiku 4</option>
            </optgroup>
            <optgroup label="OpenAI">
              <option value="openai/gpt-4o">GPT-4o</option>
              <option value="openai/gpt-4o-mini">GPT-4o Mini</option>
            </optgroup>
          </select>
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-[family-name:var(--font-playfair)] text-lg font-bold text-stone-800 mb-4">
          Conversation Capping
        </legend>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="headMessages" className={labelClass}>Head messages</label>
            <input type="number" name="headMessages" id="headMessages" defaultValue={capping.headMessages} min={1} max={50} className={inputClass} />
          </div>
          <div>
            <label htmlFor="tailMessages" className={labelClass}>Tail messages</label>
            <input type="number" name="tailMessages" id="tailMessages" defaultValue={capping.tailMessages} min={1} max={50} className={inputClass} />
          </div>
          <div>
            <label htmlFor="middleSample" className={labelClass}>Middle sample</label>
            <input type="number" name="middleSample" id="middleSample" defaultValue={capping.middleSample} min={0} max={20} className={inputClass} />
          </div>
          <div>
            <label htmlFor="maxTokens" className={labelClass}>Max tokens</label>
            <input type="number" name="maxTokens" id="maxTokens" defaultValue={capping.maxTokens} min={500} max={10000} className={inputClass} />
          </div>
        </div>
      </fieldset>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="font-[family-name:var(--font-lora)] bg-stone-800 text-white px-6 py-3 rounded-lg hover:bg-stone-700 transition-colors text-sm disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Settings"}
        </button>
        {state?.saved && !isPending && (
          <span className="font-[family-name:var(--font-caveat)] text-sm text-emerald-700">Saved!</span>
        )}
      </div>
    </form>
  );
}
