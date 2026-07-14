'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const credential = await signInWithEmailAndPassword(auth, email, password);
            const idToken = await credential.user.getIdToken();

            // Exchange the ID token for an httpOnly session cookie that the server trusts.
            const res = await fetch('/api/auth/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken }),
            });

            if (!res.ok) {
                await signOut(auth);
                toast.error(res.status === 403 ? 'This account is not authorized for the admin portal.' : 'Failed to login. Please try again.');
                return;
            }

            toast.success('Login successful');
            // Full navigation so the server layout picks up the new session cookie.
            window.location.assign('/admin');
        } catch (error: any) {
            console.error(error);
            const errorMessage = error.code === 'auth/invalid-credential'
                ? 'Invalid email or password'
                : 'Failed to login. Please try again.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden p-8 md:p-10">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-red-50 text-brand-red rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold text-brand-navy mb-2">Admin Portal</h1>
                    <p className="text-gray-500">Sign in to manage events and submissions</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="admin@whoisfatima.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="h-12 rounded-xl"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                            {/* <a href="#" className="text-xs text-brand-red hover:underline">Forgot password?</a> */}
                        </div>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="h-12 rounded-xl"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-12 text-lg bg-brand-red hover:bg-brand-red/90 text-white rounded-xl mt-4"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
                    </Button>
                </form>
            </div>
        </div>
    );
}
