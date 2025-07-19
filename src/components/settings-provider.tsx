
"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

// Define the shape of your settings
type Settings = {
  markdownEditor: boolean;
  autoSave: boolean;
  defaultVisibility: boolean;
  autoDeleteTrashed: string; // '7', '30', '60', 'never'
  autoSync: boolean;
  twoFactorAuth: boolean;
  emailNotifications: boolean;
  inAppNotifications: boolean;
  highContrast: boolean;
  screenReaderSupport: boolean;
  keyboardShortcuts: boolean;
  offlineMode: boolean;
  apiAccess: boolean;
  customStyling: boolean;
}

// Define the default values for your settings
const defaultSettings: Settings = {
  markdownEditor: true,
  autoSave: false,
  defaultVisibility: true,
  autoDeleteTrashed: '30',
  autoSync: false,
  twoFactorAuth: false,
  emailNotifications: false,
  inAppNotifications: true,
  highContrast: false,
  screenReaderSupport: false,
  keyboardShortcuts: true,
  offlineMode: false,
  apiAccess: false,
  customStyling: false,
}

type SettingsProviderProps = {
  children: React.ReactNode
  storageKey?: string
}

type SettingsProviderState = {
  settings: Settings
  setSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void
}

const initialState: SettingsProviderState = {
  settings: defaultSettings,
  setSetting: () => null,
}

const SettingsProviderContext = createContext<SettingsProviderState>(initialState)

export function SettingsProvider({
  children,
  storageKey = "feathernote-settings",
  ...props
}: SettingsProviderProps) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  // Load settings from localStorage on initial render
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(storageKey);
      if (item) {
        const storedSettings = JSON.parse(item);
        // Merge with defaults to ensure all keys are present
        setSettings({ ...defaultSettings, ...storedSettings });
      }
    } catch (error) {
      console.error("Failed to parse settings from localStorage", error);
      setSettings(defaultSettings);
    }
  }, [storageKey]);

  // Function to update a single setting and save to localStorage
  const setSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => {
      const newSettings = { ...prev, [key]: value };
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(newSettings));
      } catch (error) {
        console.error("Failed to save settings to localStorage", error);
      }
      return newSettings;
    });
  };

  const value = {
    settings,
    setSetting,
  }

  return (
    <SettingsProviderContext.Provider {...props} value={value}>
      {children}
    </SettingsProviderContext.Provider>
  )
}

// Custom hook to use the settings context
export const useSettings = () => {
  const context = useContext(SettingsProviderContext)
  if (context === undefined)
    throw new Error("useSettings must be used within a SettingsProvider")
  return context
}
