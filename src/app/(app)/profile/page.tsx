
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Camera, Save } from "lucide-react";
import { Textarea } from '@/components/ui/textarea';

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  bio: string;
  location: string;
  phone: string;
}

export default function ProfilePage() {
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile>({
    name: "User",
    email: "user@example.com",
    avatar: "https://placehold.co/100x100.png",
    bio: "",
    location: "",
    phone: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        setProfile({
            name: parsedProfile.name || "User",
            email: parsedProfile.email || "user@example.com",
            avatar: parsedProfile.avatar || "https://placehold.co/100x100.png",
            bio: parsedProfile.bio || "",
            location: parsedProfile.location || "",
            phone: parsedProfile.phone || "",
        });
    }
  }, []);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSave = () => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
    window.dispatchEvent(new Event('profileUpdated'));
    toast({
      title: "Profile Saved",
      description: "Your profile information has been updated successfully.",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    if (id === 'phone') {
        const numericValue = value.replace(/[^0-9]/g, '');
        if (numericValue.length <= 10) {
            setProfile(prev => ({ ...prev, [id]: numericValue }));
        }
    } else {
        setProfile(prev => ({ ...prev, [id]: value }));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold font-headline">Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Personal Information</CardTitle>
          <CardDescription>Update your photo and personal details here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.avatar} alt="User" />
                <AvatarFallback>{profile.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="icon"
                className="absolute inset-0 h-full w-full bg-black/40 text-white opacity-0 group-hover:opacity-100 rounded-full"
                onClick={handleAvatarClick}
              >
                <Camera className="h-6 w-6" />
                <span className="sr-only">Change photo</span>
              </Button>
              <Input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            <div>
              <h2 className="text-xl font-bold font-headline">{profile.name}</h2>
              <p className="text-muted-foreground">{profile.email}</p>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name" className="font-semibold font-headline">Full Name</Label>
            <Input id="name" value={profile.name} onChange={handleInputChange} />
          </div>
           <div className="grid gap-2">
            <Label htmlFor="email" className="font-semibold font-headline">Email Address</Label>
            <Input id="email" type="email" value={profile.email} onChange={handleInputChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bio" className="font-semibold font-headline">Bio</Label>
            <Textarea id="bio" placeholder="Tell us a little about yourself" value={profile.bio} onChange={handleInputChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location" className="font-semibold font-headline">Location</Label>
            <Input id="location" placeholder="City, Country" value={profile.location} onChange={handleInputChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone" className="font-semibold font-headline">Phone Number</Label>
            <Input id="phone" type="tel" placeholder="+91 98765 43210" value={profile.phone} onChange={handleInputChange} />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
