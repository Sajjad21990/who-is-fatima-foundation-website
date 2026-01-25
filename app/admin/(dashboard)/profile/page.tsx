'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Shield, Mail, User, Lock, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminProfilePage() {
    const { user, userProfile, loading: authLoading } = useAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-[#E63946]" />
            </div>
        );
    }

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            if (user && currentPassword) {
                // Re-authenticate first
                const credential = EmailAuthProvider.credential(user.email!, currentPassword);
                await reauthenticateWithCredential(user, credential);

                // Update password
                await updatePassword(user, newPassword);

                toast.success('Password updated successfully');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            }
        } catch (error: any) {
            console.error(error);
            const errorMessage = error.code === 'auth/wrong-password'
                ? 'Current password is incorrect'
                : 'Failed to update password. Please try again.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-[#1D3557]">Profile Settings</h1>
                <p className="text-gray-500">Manage your account information and security</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Personal Details Card */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <CardHeader className="bg-[#f8f9fa] border-b border-gray-100">
                            <CardTitle className="text-lg text-[#1D3557] flex items-center gap-2">
                                <User className="w-5 h-5 text-[#E63946]" />
                                Personal Info
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-1">
                                <Label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Full Name</Label>
                                <p className="text-[#1D3557] font-semibold text-lg">{userProfile?.displayName || 'Not Set'}</p>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Email Address</Label>
                                <p className="text-[#1D3557] font-medium truncate">{userProfile?.email}</p>
                            </div>
                            <div className="space-y-1 pt-2">
                                <Label className="text-xs uppercase tracking-widest text-gray-400 font-bold block mb-2">Access Level</Label>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#1D3557] text-white uppercase tracking-wider">
                                    <Shield className="w-3 h-3 mr-1" />
                                    {userProfile?.role}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Password Change Card */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <CardHeader className="bg-[#f8f9fa] border-b border-gray-100">
                            <CardTitle className="text-lg text-[#1D3557] flex items-center gap-2">
                                <Lock className="w-5 h-5 text-[#E63946]" />
                                Security Settings
                            </CardTitle>
                            <CardDescription className="text-gray-500 pt-1">Update your account password regularly to stay secure</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={handleChangePassword} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="currentPassword" className="text-sm font-semibold text-[#1D3557]">Current Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                        <Input
                                            id="currentPassword"
                                            type="password"
                                            placeholder="Enter current password"
                                            className="pl-10 h-11 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#E63946]/10"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword" title="At least 6 characters" className="text-sm font-semibold text-[#1D3557]">New Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                            <Input
                                                id="newPassword"
                                                type="password"
                                                placeholder="Enter new password"
                                                className="pl-10 h-11 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#E63946]/10"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword" className="text-sm font-semibold text-[#1D3557]">Confirm New Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                            <Input
                                                id="confirmPassword"
                                                type="password"
                                                placeholder="Confirm new password"
                                                className="pl-10 h-11 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#E63946]/10"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 flex gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                    <div className="text-sm text-amber-900">
                                        <p className="font-bold mb-1 underline decoration-amber-300">Important Security Recommendation</p>
                                        <p className="opacity-80">Make sure your new password is unique and contains at least 6 characters for optimal security.</p>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full md:w-auto px-10 h-12 bg-[#1D3557] hover:bg-[#1D3557]/90 text-white rounded-xl shadow-md transition-all font-semibold"
                                    disabled={loading}
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : 'Update Password'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
