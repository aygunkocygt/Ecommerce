"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { isValidPassword } from "@/lib/isValidPassword";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const isAuthenticated =
                username === process.env.NEXT_PUBLIC_ADMIN_USERNAME &&
                (await isValidPassword(password, process.env.NEXT_PUBLIC_HASHED_ADMIN_PASSWORD as string));

            if (isAuthenticated) {
                const authToken = process.env.NEXT_PUBLIC_STATIC_AUTH_TOKEN;
                document.cookie = `authToken=${authToken}; path=/`;

                router.push("/admin");
            } else {
                setError("Kullanıcı Adı veya Şifre yanlış!");
            }
        } catch (error) {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="flex justify-center items-center h-screen bg-cover"
            style={{ backgroundImage: `url(${"/bgPattern.svg"})`,   backgroundPosition: "center bottom", backgroundSize: 'cover',backgroundRepeat: "initial"}}
        >
            <Card className="w-full max-w-xs p-6 bg-white shadow-lg rounded-lg">
                <CardContent>
                    <h1 className="text-xl font-bold mb-5">Giris Yap</h1>
                  
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-xs font-bold mb-2" htmlFor="username">
                                Kullanıcı Adı
                            </label>
                            <Input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full h-8 p-2 border border-gray-300 rounded"
                                placeholder="Enter your username"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-xs font-bold mb-2" htmlFor="password">
                                Şifre
                            </label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-8 p-2 border border-gray-300 rounded"
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                        {error && <p className="text-xs text-red-500 mb-4">{error}</p>}
                        <Button
                            type="submit"
                            className="w-full h-9 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                            disabled={loading}
                        >
                            {loading ? "Loading..." : "Login"}
                        </Button>
                        
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
