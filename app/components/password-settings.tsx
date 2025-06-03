"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Lock, Unlock, Shield, Key } from "lucide-react"
import { useAuth } from "./auth-provider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function PasswordSettings() {
  const { isPasswordEnabled, enablePassword, disablePassword, changePassword, logout } = useAuth()
  const [isSetupDialogOpen, setIsSetupDialogOpen] = useState(false)
  const [isChangeDialogOpen, setIsChangeDialogOpen] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [oldPassword, setOldPassword] = useState("")
  const [showPasswords, setShowPasswords] = useState(false)
  const [error, setError] = useState("")

  const handleEnablePassword = () => {
    setError("")

    if (newPassword.length < 4) {
      setError("Password must be at least 4 characters long")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    enablePassword(newPassword)
    setIsSetupDialogOpen(false)
    setNewPassword("")
    setConfirmPassword("")
  }

  const handleChangePassword = () => {
    setError("")

    if (newPassword.length < 4) {
      setError("Password must be at least 4 characters long")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (changePassword(oldPassword, newPassword)) {
      setIsChangeDialogOpen(false)
      setOldPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } else {
      setError("Current password is incorrect")
    }
  }

  const handleDisablePassword = () => {
    if (
      confirm("Are you sure you want to disable password protection? Your data will be accessible without a password.")
    ) {
      disablePassword()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Password Protection
        </CardTitle>
        <CardDescription>Secure your student data with password protection</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            {isPasswordEnabled ? (
              <Lock className="h-5 w-5 text-green-600" />
            ) : (
              <Unlock className="h-5 w-5 text-gray-400" />
            )}
            <div>
              <p className="font-medium">Password Protection {isPasswordEnabled ? "Enabled" : "Disabled"}</p>
              <p className="text-sm text-muted-foreground">
                {isPasswordEnabled
                  ? "Your data is protected with a password"
                  : "Anyone can access your data without a password"}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {!isPasswordEnabled ? (
              <Dialog open={isSetupDialogOpen} onOpenChange={setIsSetupDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Lock className="mr-2 h-4 w-4" />
                    Enable Password
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Set Up Password Protection</DialogTitle>
                    <DialogDescription>
                      Create a password to protect your student data. You'll need to enter this password each time you
                      open the application.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <div className="relative">
                        <Input
                          id="new-password"
                          type={showPasswords ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPasswords(!showPasswords)}
                        >
                          {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type={showPasswords ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                      />
                    </div>
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsSetupDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleEnablePassword}>Enable Password Protection</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ) : (
              <div className="flex gap-2">
                <Dialog open={isChangeDialogOpen} onOpenChange={setIsChangeDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Key className="mr-2 h-4 w-4" />
                      Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                      <DialogDescription>Enter your current password and choose a new one.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="old-password">Current Password</Label>
                        <Input
                          id="old-password"
                          type="password"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          placeholder="Enter current password"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password-change">New Password</Label>
                        <div className="relative">
                          <Input
                            id="new-password-change"
                            type={showPasswords ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowPasswords(!showPasswords)}
                          >
                            {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password-change">Confirm New Password</Label>
                        <Input
                          id="confirm-password-change"
                          type={showPasswords ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                        />
                      </div>
                      {error && (
                        <Alert variant="destructive">
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsChangeDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleChangePassword}>Change Password</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button variant="destructive" onClick={handleDisablePassword}>
                  <Unlock className="mr-2 h-4 w-4" />
                  Disable Password
                </Button>
              </div>
            )}
          </div>
        </div>

        {isPasswordEnabled && (
          <div className="space-y-2">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Password protection is active. You'll be asked for your password when you restart the application.
                <Button variant="link" className="p-0 h-auto ml-2" onClick={logout}>
                  Test password protection now
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
