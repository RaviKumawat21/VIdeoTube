import React, {useState} from "react";
import {Link ,useNavigate} from "react-router-dom"
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import {login as authLogin} from "../../store/authSlice"

import { axiosInstance } from "../../utils/axios.instance";

import{Input, Button,Logo, Loader} from "../index"

export default function Login(){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {register, handleSubmit} = useForm();

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const loginUser = async (data) => {
        setLoading(true);
        setError("");
        try {
            const loginData = {
    password: data.password,
    // If it has an '@', send as email. Otherwise, send as username.
    ...(data.identifier.includes("@") ? { email: data.identifier } : { username: data.identifier })
};

            const response = await axiosInstance.post("/users/login", loginData);
            const userData = response.data.message.user;

            if(userData){
                dispatch(authLogin(userData));
                navigate("/");
            }
        }
        catch(err){
            setError(err.response?.data?.message || "Login failed. Please try again.");
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center w-full min-h-[calc(100vh-100px)]">
            <div className="w-full max-w-lg p-10 bg-gray-900 border border-gray-700 shadow-xl rounded-xl">
                <div className="flex justify-center mb-4"><Logo /></div>
                <h2 className="text-2xl font-bold leading-tight text-center text-white">Sign in to your account</h2>
                
                {error && <p className="mt-8 text-center text-red-500">{error}</p>}
                
                <form onSubmit={handleSubmit(loginUser)} className="mt-8">
                    <div className="space-y-5">
                        {/* TODO : IS THIS HANDEL THE USENAME ALSO? */}
                        <Input
    label="Email or Username:"
    placeholder="Enter your email or username"
    {...register("identifier", { required: true })} // Changed from "email" to "identifier"
/>
                        <Input
                            label="Password:"
                            type="password"
                            placeholder="Enter your password"
                            {...register("password", { required: true })} 
                        />
                        
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? <Loader /> : "Sign in"}
                        </Button>
                    </div>
                </form>
                <p className="mt-4 text-base text-center text-gray-400">
                    Don&apos;t have any account?&nbsp;
                    <Link to="/signup" className="text-amber-500 transition-all duration-200 hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );

}