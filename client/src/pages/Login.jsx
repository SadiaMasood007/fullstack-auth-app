import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { GoogleLogin } from "@react-oauth/google";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login() {
  const nav = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_URL_vercel}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (res.ok) {
        localStorage.setItem("token", json.token);
        nav("/dashboard");
      } else {
        alert(json.message || "Login failed");
      }
    } catch (err) {
      alert("Network or server error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      <Card className="w-full max-w-md shadow-lg border border-gray-200 bg-white p-6 rounded-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-gray-900">
            Welcome Back
          </CardTitle>
          <p className="text-center text-gray-500 text-sm mt-2">
            Login to access your dashboard
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label>Email</Label>
              <Input placeholder="Enter your email" {...register("email")} />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <Label>Password</Label>
              <Input type="password" placeholder="Enter your password" {...register("password")} />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              Log In
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-center">
            <span className="text-gray-400 text-sm">Or continue with</span>
          </div>

     
          <div className="mt-4 flex justify-center">
            <GoogleLogin
              onSuccess={(res) => {
                fetch(`${import.meta.env.VITE_URL_vercel}/api/oauth/google-login`, {                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ token: res.credential }),
                })
                  .then((r) => r.json().then(j => ({ ok: r.ok, body: j })))
                  .then(({ ok, body }) => {
                    if (!ok) {
                      alert(body.message || "Google login failed");
                      return;
                    }
                    localStorage.setItem("token", body.token);
                    nav("/dashboard");
                  })
                  .catch(() => alert("Google login error"));
              }}
              onError={() => console.error("Google login failed")}
            />
          </div>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
