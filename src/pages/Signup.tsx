
import React from 'react';
import { SignupForm } from '@/components/auth/SignupForm';

const Signup = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md mx-auto text-center mb-8">
        <h1 className="text-3xl font-bold text-realty-blue mb-2">
          <span className="bg-realty-blue text-white p-1 rounded mr-2">RI</span>
          RealtyInsight
        </h1>
        <p className="text-muted-foreground">
          Real estate investment analysis platform
        </p>
      </div>
      
      <SignupForm />
      
      <p className="mt-8 text-center text-sm text-muted-foreground">
        By creating an account, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
};

export default Signup;
