import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRecruiter, setIsRecruiter] = useState(false);
  const [isRecruiterSignup, setIsRecruiterSignup] = useState(false);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
        
        if (session?.user) {
          fetchUserProfile(session.user.id);
        } else {
          // Reset isRecruiter when user is null
          setIsRecruiter(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      console.log("Fetching user profile for:", userId);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        return;
      }

      if (data) {
        console.log("Profile data retrieved:", data);
        setIsRecruiter(data.is_recruiter || false);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const signUp = async (email, password) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      // Save the account type in localStorage
      localStorage.setItem('accountType', isRecruiterSignup ? 'recruiter' : 'jobseeker');
      toast({
        title: "Sign up successful",
        description: "Please check your email for the confirmation link.",
      });

      const { data: sessionData } = await supabase.auth.getSession();
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .upsert([
          {
            id: sessionData.session.user.id,
            is_recruiter: !!isRecruiterSignup
          }
        ])
        .select();

      if (profileError) {
        console.error("Error updating profile:", profileError);
        throw profileError;
      }

      if (profileData) {
        console.log("Profile data retrieved:", profileData);
        setIsRecruiter(profileData.is_recruiter || false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: "Sign out failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      setUser(null);
      setSession(null);
      setIsRecruiter(false);
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (data) => {
    try {
      if (!user) return;
      
      console.log("Updating user profile with data:", data);
      
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          ...data
        });

      if (error) {
        toast({
          title: "Update failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      // Update local state if is_recruiter is set
      if (data.hasOwnProperty("is_recruiter")) {
        setIsRecruiter(data.is_recruiter);
        console.log("Updated isRecruiter state to:", data.is_recruiter);
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      
      // Re-fetch the user profile to ensure we have the latest data
      fetchUserProfile(user.id);
      
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthenticated: !!user,
        isRecruiter,
        signUp,
        signIn,
        signOut,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};