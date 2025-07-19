
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useTheme } from '@/components/theme-provider';
import { Moon, Sun, Laptop } from "lucide-react";
import { SettingsToggle } from '@/components/settings-toggle';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSettings } from '@/components/settings-provider';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { settings, setSetting } = useSettings();

  const handleSelectChange = (value: string) => {
    setSetting('autoDeleteTrashed', value);
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold font-headline">Settings</h1>
      <div className="space-y-8">
          <Card>
              <CardHeader>
                  <CardTitle className="font-headline">User Interface</CardTitle>
                  <CardDescription>Customize the look and feel of the application.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div className="space-y-2">
                      <Label className="text-base font-medium font-headline">Theme</Label>
                      <p className="text-sm text-muted-foreground">Select the color scheme for the application.</p>
                      <div className="grid grid-cols-3 gap-2 pt-2">
                          <Button variant={theme === 'light' ? 'default' : 'outline'} onClick={() => setTheme('light')}>
                              <Sun className="mr-2"/> Light
                          </Button>
                          <Button variant={theme === 'dark' ? 'default' : 'outline'} onClick={() => setTheme('dark')}>
                              <Moon className="mr-2"/> Dark
                          </Button>
                          <Button variant={theme === 'system' ? 'default' : 'outline'} onClick={() => setTheme('system')}>
                              <Laptop className="mr-2"/> System
                          </Button>
                      </div>
                  </div>
                  <SettingsToggle 
                      id="markdown-editor" 
                      title="Markdown/Plain Text Editor"
                      description="Use Markdown for rich text or plain text for simplicity."
                      checked={settings.markdownEditor}
                      onCheckedChange={(checked) => setSetting('markdownEditor', checked)}
                  />
                  <SettingsToggle 
                      id="auto-save"
                      title="Auto-Save Notes"
                      description="Automatically save your notes as you type."
                      checked={settings.autoSave}
                      onCheckedChange={(checked) => setSetting('autoSave', checked)}
                  />
              </CardContent>
          </Card>
          
          <Card>
              <CardHeader>
                  <CardTitle className="font-headline">Note Management</CardTitle>
                  <CardDescription>Manage how your notes are handled and organized.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                   <SettingsToggle 
                      id="default-visibility"
                      title="Default Note Visibility"
                      description="Set new notes to be private by default."
                      checked={settings.defaultVisibility}
                      onCheckedChange={(checked) => setSetting('defaultVisibility', checked)}
                  />
                  <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                          <Label className="text-base font-medium font-headline">Auto-Delete Trashed Notes</Label>
                          <p className="text-sm text-muted-foreground">Automatically delete notes from trash after a set period.</p>
                      </div>
                      <Select value={settings.autoDeleteTrashed} onValueChange={handleSelectChange}>
                          <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="7">After 7 days</SelectItem>
                              <SelectItem value="30">After 30 days</SelectItem>
                              <SelectItem value="60">After 60 days</SelectItem>
                              <SelectItem value="never">Never</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>
                  <SettingsToggle 
                      id="auto-sync"
                      title="Auto-Sync Notes"
                      description="Automatically sync notes across devices (requires offline mode)."
                      checked={settings.autoSync}
                      onCheckedChange={(checked) => setSetting('autoSync', checked)}
                  />
              </CardContent>
          </Card>

          <Card>
              <CardHeader>
                  <CardTitle className="font-headline">Account & Security</CardTitle>
                  <CardDescription>Manage your account security and notification preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                  <SettingsToggle 
                      id="2fa"
                      title="Two-Factor Authentication (2FA)"
                      description="Enhance your account security with 2FA."
                      checked={settings.twoFactorAuth}
                      onCheckedChange={(checked) => setSetting('twoFactorAuth', checked)}
                  />
                  <SettingsToggle 
                      id="email-notifications"
                      title="Email Notifications"
                      description="Receive email alerts for important account activity."
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => setSetting('emailNotifications', checked)}
                  />
                   <SettingsToggle 
                      id="in-app-notifications"
                      title="In-App Notifications"
                      description="Show notifications within the app for updates and alerts."
                      checked={settings.inAppNotifications}
                      onCheckedChange={(checked) => setSetting('inAppNotifications', checked)}
                  />
              </CardContent>
          </Card>

          <Card>
              <CardHeader>
                  <CardTitle className="font-headline">Accessibility</CardTitle>
                  <CardDescription>Customize the application for your accessibility needs.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                  <SettingsToggle 
                      id="high-contrast"
                      title="High-Contrast Mode"
                      description="Increase text and background contrast for better visibility."
                      checked={settings.highContrast}
                      onCheckedChange={(checked) => setSetting('highContrast', checked)}
                  />
                  <SettingsToggle 
                      id="screen-reader"
                      title="Screen Reader Support"
                      description="Improve compatibility with screen reader software."
                      checked={settings.screenReaderSupport}
                      onCheckedChange={(checked) => setSetting('screenReaderSupport', checked)}
                  />
                   <SettingsToggle 
                      id="keyboard-shortcuts"
                      title="Keyboard Shortcuts"
                      description="Enable shortcuts for common actions like new note, save, etc."
                      checked={settings.keyboardShortcuts}
                      onCheckedChange={(checked) => setSetting('keyboardShortcuts', checked)}
                  />
              </CardContent>
          </Card>
          
          <Card>
              <CardHeader>
                  <CardTitle className="font-headline">Advanced</CardTitle>
                  <CardDescription>Advanced features for power users.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                  <SettingsToggle 
                      id="offline-mode"
                      title="Offline Mode"
                      description="Access and edit your notes even without an internet connection."
                      checked={settings.offlineMode}
                      onCheckedChange={(checked) => setSetting('offlineMode', checked)}
                  />
                  <SettingsToggle 
                      id="api-access"
                      title="API Access"
                      description="Generate API keys for third-party integrations."
                      checked={settings.apiAccess}
                      onCheckedChange={(checked) => setSetting('apiAccess', checked)}
                  />
                   <SettingsToggle 
                      id="custom-styling"
                      title="Custom Styling"
                      description="Enable custom CSS for the editor and notes list."
                      checked={settings.customStyling}
                      onCheckedChange={(checked) => setSetting('customStyling', checked)}
                  />
              </CardContent>
          </Card>
      </div>
    </div>
  );
}
