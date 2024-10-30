"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import useStore from "@/store/store";
import { toast } from "@/hooks/use-toast";
import { Lock, Mail, Building, User, Star } from "lucide-react";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { loginData } = useStore();
  const [profileData, setProfileData] = useState(loginData);

  useEffect(() => {
    setProfileData(loginData);
  }, [loginData]);
  console.log(profileData);
  const handleProfileUpdate = () => {
    // updateLoginData(profileData);
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully",
      variant: "default",
      className: "bg-green-500 text-white",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-[95vw] h-[90vh] flex flex-col p-0">
        <div className="px-6 py-4 border-b">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl font-bold text-purple-900 flex items-center gap-2">
              <User className="w-6 h-6" />
              Profile Settings
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Manage your account information and preferences.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="grid gap-6">
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-purple-900">
                    Account Status
                  </h3>
                  <p className="text-sm text-purple-700">
                    Current subscription and limits
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={`
                    self-start sm:self-center
                    px-3 py-1
                    border-2
                    font-medium
                    ${
                      profileData.accountLevel === "Free"
                        ? "border-purple-400 text-purple-700 bg-purple-50"
                        : profileData.accountLevel === "Professional"
                        ? "border-indigo-400 text-indigo-700 bg-indigo-50"
                        : "border-green-400 text-green-700 bg-green-50"
                    }
                  `}
                >
                  {profileData.accountLevel} Plan
                </Badge>
              </div>
              <div className="mt-3 text-sm text-gray-600">
                Invoice Limit: {profileData.invoicesLimit} per month
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <User className="w-5 h-5 text-purple-600" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serviceName">Service Name</Label>
                  <Input
                    id="serviceName"
                    value={profileData.serviceName}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        serviceName: e.target.value,
                      })
                    }
                    className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Mail className="w-5 h-5 text-purple-600" />
                Contact Information
              </h3>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                  className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Account Settings */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Star className="w-5 h-5 text-purple-600" />
                Account Settings
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Account Role</Label>
                  <Select
                    disabled
                    value={profileData.role}
                    onValueChange={(value) =>
                      setProfileData({ ...profileData, role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Account Verification</Label>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium">
                        {profileData.isVerified ? "Verified" : "Unverified"}
                      </div>
                      <div className="text-xs text-gray-500">
                        Account verification status
                      </div>
                    </div>
                    <Switch
                      disabled
                      checked={profileData.isVerified}
                      onCheckedChange={(checked) =>
                        setProfileData({ ...profileData, isVerified: checked })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="border-t px-6 py-4">
          <DialogFooter className="gap-2 sm:gap-0">
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={onClose}
                className="w-full sm:w-auto text-gray-700 hover:text-gray-900"
              >
                Cancel
              </Button>
              <Button
                onClick={handleProfileUpdate}
                className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white"
              >
                Save Changes
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
