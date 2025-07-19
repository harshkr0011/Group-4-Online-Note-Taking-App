
"use client"

import * as React from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "./ui/label";

interface SettingsToggleProps {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function SettingsToggle({ id, title, description, checked, onCheckedChange }: SettingsToggleProps) {
  return (
    <div className="flex flex-row items-center justify-between rounded-lg border p-4">
      <div className="space-y-0.5">
        <Label htmlFor={id} className="text-base font-medium cursor-pointer font-headline">
          {title}
        </Label>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        aria-label={title}
      />
    </div>
  )
}
