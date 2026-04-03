"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { saveSettings } from "./actions";

interface SettingsFormProps {
  model: string;
  capping: {
    headMessages: number;
    tailMessages: number;
    middleSample: number;
    maxTokens: number;
  };
  scan: {
    limit: number;
    maxAgeDays: number;
  };
}

interface FormValues {
  model: string;
  headMessages: number;
  tailMessages: number;
  middleSample: number;
  maxTokens: number;
  scanLimit: number;
  scanMaxAgeDays: number;
}

export function SettingsForm({ model, capping, scan }: SettingsFormProps) {
  const [saved, setSaved] = useState(false);
  const { register, handleSubmit, setValue, formState: { isSubmitting } } = useForm<FormValues>({
    defaultValues: {
      model,
      headMessages: capping.headMessages,
      tailMessages: capping.tailMessages,
      middleSample: capping.middleSample,
      maxTokens: capping.maxTokens,
      scanLimit: scan.limit,
      scanMaxAgeDays: scan.maxAgeDays,
    },
  });

  async function onSubmit(data: FormValues) {
    setSaved(false);
    await saveSettings(data);
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-md">
      <fieldset disabled={isSubmitting}>
        <legend className="font-[family-name:var(--font-playfair)] text-lg font-bold text-stone-800 mb-4">
          AI Model
        </legend>
        <div className="space-y-2">
          <Label htmlFor="model">Model ID</Label>
          <Select defaultValue={model} onValueChange={(value) => setValue("model", value)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Google</SelectLabel>
                <SelectItem value="google/gemini-2.5-flash">Gemini 2.5 Flash</SelectItem>
                <SelectItem value="google/gemini-2.5-pro">Gemini 2.5 Pro</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Anthropic</SelectLabel>
                <SelectItem value="anthropic/claude-sonnet-4">Claude Sonnet 4</SelectItem>
                <SelectItem value="anthropic/claude-haiku-4">Claude Haiku 4</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>OpenAI</SelectLabel>
                <SelectItem value="openai/gpt-4o">GPT-4o</SelectItem>
                <SelectItem value="openai/gpt-4o-mini">GPT-4o Mini</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </fieldset>

      <fieldset disabled={isSubmitting}>
        <legend className="font-[family-name:var(--font-playfair)] text-lg font-bold text-stone-800 mb-4">
          Scan Options
        </legend>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="scanLimit">Max sessions</Label>
            <Input type="number" id="scanLimit" min={1} max={50} {...register("scanLimit", { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="scanMaxAgeDays">Max age (days)</Label>
            <Input type="number" id="scanMaxAgeDays" min={1} max={365} {...register("scanMaxAgeDays", { valueAsNumber: true })} />
          </div>
        </div>
      </fieldset>

      <fieldset disabled={isSubmitting}>
        <legend className="font-[family-name:var(--font-playfair)] text-lg font-bold text-stone-800 mb-4">
          Conversation Capping
        </legend>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="headMessages">Head messages</Label>
            <Input type="number" id="headMessages" min={1} max={50} {...register("headMessages", { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tailMessages">Tail messages</Label>
            <Input type="number" id="tailMessages" min={1} max={50} {...register("tailMessages", { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="middleSample">Middle sample</Label>
            <Input type="number" id="middleSample" min={0} max={20} {...register("middleSample", { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxTokens">Max tokens</Label>
            <Input type="number" id="maxTokens" min={500} max={10000} {...register("maxTokens", { valueAsNumber: true })} />
          </div>
        </div>
      </fieldset>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Settings"}
        </Button>
        {saved && !isSubmitting && (
          <span className="font-[family-name:var(--font-caveat)] text-sm text-emerald-700">Saved!</span>
        )}
      </div>
    </form>
  );
}
