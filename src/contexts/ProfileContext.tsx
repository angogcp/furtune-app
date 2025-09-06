import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface UserProfileData {
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  gender: 'male' | 'female' | '';
  occupation: string;
  hobbies: string;
  selfDescription: string;
}

interface ProfileContextType {
  profile: UserProfileData;
  updateProfile: (newProfile: Partial<UserProfileData>) => void;
  loadProfile: () => void;
  clearProfile: () => void;
  isProfileComplete: boolean;
  autoFillBirthInfo: () => {
    date: string;
    time: string;
    location: string;
    name?: string;
    birthDate?: string;
    birthTime?: string;
    gender?: string;
    birthPlace?: string;
  };
  autoFillPersonalInfo: () => {
    name: string;
    birthDate: string;
    gender: string;
    selfDescription: string;
    dreamGoals: string;
    lifeExperience: string;
    age?: string;
    occupation?: string;
    hobbies?: string;
    birthPlace?: string;
    personality?: string;
    dreams?: string;
    luckyNumbers?: string[];
  };
  autoFillCompatibilityInfo: () => {
    yourName: string;
    yourBirthDate: string;
    yourGender: string;
    partnerName: string;
    partnerBirthDate: string;
    partnerGender: string;
    relationshipType: string;
    compatibilityScore: string;
    duration?: string;
    person1?: {
      name?: string;
      age?: string;
      birthDate?: string;
      gender?: string;
      personality?: string;
      hobbies?: string;
      birthTime?: string;
      birthPlace?: string;
    };
    person2?: {
      name?: string;
      age?: string;
      birthDate?: string;
      gender?: string;
      personality?: string;
      hobbies?: string;
      birthTime?: string;
      birthPlace?: string;
    };
  };
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const STORAGE_KEY = 'fortune_user_profile';

const defaultProfile: UserProfileData = {
  name: '',
  birthDate: '',
  birthTime: '',
  birthPlace: '',
  gender: '',
  occupation: '',
  hobbies: '',
  selfDescription: ''
};

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfileData>(defaultProfile);

  // Load profile from localStorage on mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = () => {
    try {
      const savedProfile = localStorage.getItem(STORAGE_KEY);
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        setProfile({ ...defaultProfile, ...parsedProfile });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const updateProfile = (newProfile: Partial<UserProfileData>) => {
    const updatedProfile = { ...profile, ...newProfile };
    setProfile(updatedProfile);
    
    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfile));
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const clearProfile = () => {
    setProfile(defaultProfile);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Check if profile has essential information
  const isProfileComplete = Boolean(
    profile.name && 
    profile.birthDate && 
    profile.gender
  );

  // Auto-fill functions for different fortune-telling methods
  const autoFillBirthInfo = () => {
    return {
      date: profile.birthDate,
      time: profile.birthTime,
      location: profile.birthPlace,
      name: profile.name,
      birthDate: profile.birthDate,
      birthTime: profile.birthTime,
      gender: profile.gender,
      birthPlace: profile.birthPlace
    };
  };

  const autoFillPersonalInfo = () => {
    // Calculate age from birth date
    const calculateAge = (birthDate: string): string => {
      if (!birthDate) return '';
      const today = new Date();
      const birth = new Date(birthDate);
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      return age.toString();
    };

    return {
      name: profile.name,
      birthDate: profile.birthDate,
      gender: profile.gender,
      age: calculateAge(profile.birthDate),
      birthPlace: profile.birthPlace,
      selfDescription: '',
      dreamGoals: '',
      lifeExperience: '',
      occupation: '',
      hobbies: '',
      personality: '',
      dreams: '',
      luckyNumbers: []
    };
  };

  const autoFillCompatibilityInfo = () => {
    return {
      yourName: profile.name,
      yourBirthDate: profile.birthDate,
      yourGender: profile.gender,
      partnerName: '',
      partnerBirthDate: '',
      partnerGender: '',
      relationshipType: '',
      compatibilityScore: '',
      duration: '',
      person1: {
        name: profile.name,
        age: profile.birthDate ? calculateAge(profile.birthDate) : '',
        birthDate: profile.birthDate,
        gender: profile.gender,
        personality: '',
        hobbies: '',
        birthTime: profile.birthTime,
        birthPlace: profile.birthPlace
      },
      person2: {
        name: '',
        age: '',
        birthDate: '',
        gender: '',
        personality: '',
        hobbies: '',
        birthTime: '',
        birthPlace: ''
      }
    };
  };

  // Helper function to calculate age
  const calculateAge = (birthDate: string): string => {
    if (!birthDate) return '';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age.toString();
  };

  const contextValue: ProfileContextType = {
    profile,
    updateProfile,
    loadProfile,
    clearProfile,
    isProfileComplete,
    autoFillBirthInfo,
    autoFillPersonalInfo,
    autoFillCompatibilityInfo
  };

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};