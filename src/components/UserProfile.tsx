import React, { useState, useEffect } from 'react';
import { 
  User, Calendar, Clock, MapPin, Save, Edit3, X, Check, 
  UserCheck, AlertCircle, Info, Trash2, Download, Upload
} from 'lucide-react';
import { useProfile } from '../contexts/ProfileContext';

interface UserProfileData {
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  gender: 'male' | 'female' | '';
}

interface UserProfileProps {
  onProfileUpdate?: (profile: UserProfileData) => void;
  onClose?: () => void;
  initialData?: Partial<UserProfileData>;
  className?: string;
}

const STORAGE_KEY = 'fortune_user_profile';

const UserProfile: React.FC<UserProfileProps> = ({
  onProfileUpdate,
  onClose,
  initialData,
  className = ''
}) => {
  // Use the global profile context
  const { profile: contextProfile, updateProfile: updateContextProfile, isProfileComplete: contextIsProfileComplete } = useProfile();
  
  const [profile, setProfile] = useState<UserProfileData>({
    name: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    gender: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Load profile from context on component mount
  useEffect(() => {
    // Initialize from context profile
    setProfile(contextProfile);
    
    // If initial data is provided, merge it
    if (initialData) {
      setProfile(prev => ({ ...prev, ...initialData }));
    }
  }, [contextProfile, initialData]);

  // Save profile to context and localStorage
  const saveProfile = async () => {
    setSaveStatus('saving');
    try {
      // Update the global context
      updateContextProfile(profile);
      
      setSaveStatus('saved');
      setHasChanges(false);
      setIsEditing(false);
      
      // Notify parent component
      if (onProfileUpdate) {
        onProfileUpdate(profile);
      }
      
      // Reset status after 2 seconds
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  // Update profile field
  const updateField = (field: keyof UserProfileData, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  // Clear profile
  const clearProfile = () => {
    const emptyProfile = {
      name: '',
      birthDate: '',
      birthTime: '',
      birthPlace: '',
      gender: ''
    };
    setProfile(emptyProfile);
    // Also clear the global context
    updateContextProfile(emptyProfile);
    setHasChanges(false);
    setIsEditing(false);
  };

  // Export profile
  const exportProfile = () => {
    const dataStr = JSON.stringify(profile, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'fortune_profile.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import profile
  const importProfile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedProfile = JSON.parse(e.target?.result as string);
          setProfile({ ...profile, ...importedProfile });
          setHasChanges(true);
        } catch (error) {
          console.error('Error importing profile:', error);
          setSaveStatus('error');
        }
      };
      reader.readAsText(file);
    }
  };

  // Check if profile is complete - use context value or fallback to local state
  const isProfileComplete = contextIsProfileComplete || (profile.name && profile.birthDate && profile.gender);

  return (
    <div className={`bg-gradient-to-br from-purple-900/60 to-indigo-900/60 backdrop-blur-sm rounded-2xl border border-purple-400/20 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-purple-400/20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">个人信息</h2>
            <p className="text-sm text-purple-200">
              {isProfileComplete ? '资料完整' : '请完善个人信息以获得更准确的占卜结果'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Save Status */}
          {saveStatus === 'saved' && (
            <div className="flex items-center space-x-1 text-green-400">
              <Check className="w-4 h-4" />
              <span className="text-sm">已保存</span>
            </div>
          )}
          {saveStatus === 'error' && (
            <div className="flex items-center space-x-1 text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">保存失败</span>
            </div>
          )}
          
          {/* Edit Toggle */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`p-2 rounded-lg transition-all duration-300 ${
              isEditing
                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/50'
                : 'bg-purple-700/50 text-purple-300 border border-purple-600 hover:bg-purple-600/50'
            }`}
          >
            {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          </button>
          
          {/* Close Button */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 bg-gray-600/50 hover:bg-gray-600/70 rounded-lg transition-all duration-300"
            >
              <X className="w-4 h-4 text-gray-300" />
            </button>
          )}
        </div>
      </div>

      {/* Profile Form */}
      <div className="p-6 space-y-6">
        {/* Completion Status */}
        <div className={`p-4 rounded-lg border ${
          isProfileComplete 
            ? 'bg-green-900/20 border-green-400/30 text-green-200'
            : 'bg-yellow-900/20 border-yellow-400/30 text-yellow-200'
        }`}>
          <div className="flex items-center space-x-2">
            {isProfileComplete ? (
              <UserCheck className="w-5 h-5 text-green-400" />
            ) : (
              <Info className="w-5 h-5 text-yellow-400" />
            )}
            <span className="font-medium">
              {isProfileComplete ? '个人资料已完善' : '建议完善个人资料'}
            </span>
          </div>
          {!isProfileComplete && (
            <p className="text-sm mt-1 opacity-80">
              完整的个人信息有助于提供更精准的占卜分析结果
            </p>
          )}
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              姓名 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => updateField('name', e.target.value)}
              disabled={!isEditing}
              placeholder="请输入您的姓名"
              className={`w-full p-3 rounded-lg border text-white placeholder-purple-400 transition-all duration-300 ${
                isEditing
                  ? 'bg-purple-800/50 border-purple-600 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20'
                  : 'bg-purple-900/30 border-purple-700 cursor-not-allowed'
              }`}
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-2">
              性别 <span className="text-red-400">*</span>
            </label>
            <select
              value={profile.gender}
              onChange={(e) => updateField('gender', e.target.value)}
              disabled={!isEditing}
              className={`w-full p-3 rounded-lg border text-white transition-all duration-300 ${
                isEditing
                  ? 'bg-purple-800/50 border-purple-600 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20'
                  : 'bg-purple-900/30 border-purple-700 cursor-not-allowed'
              }`}
            >
              <option value="">请选择性别</option>
              <option value="male">男</option>
              <option value="female">女</option>
            </select>
          </div>

          {/* Birth Date */}
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              出生日期 <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              value={profile.birthDate}
              onChange={(e) => updateField('birthDate', e.target.value)}
              disabled={!isEditing}
              className={`w-full p-3 rounded-lg border text-white transition-all duration-300 ${
                isEditing
                  ? 'bg-purple-800/50 border-purple-600 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20'
                  : 'bg-purple-900/30 border-purple-700 cursor-not-allowed'
              }`}
            />
          </div>

          {/* Birth Time */}
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              出生时间
            </label>
            <input
              type="time"
              value={profile.birthTime}
              onChange={(e) => updateField('birthTime', e.target.value)}
              disabled={!isEditing}
              className={`w-full p-3 rounded-lg border text-white transition-all duration-300 ${
                isEditing
                  ? 'bg-purple-800/50 border-purple-600 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20'
                  : 'bg-purple-900/30 border-purple-700 cursor-not-allowed'
              }`}
            />
          </div>

          {/* Birth Place */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-purple-200 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              出生地点
            </label>
            <input
              type="text"
              value={profile.birthPlace}
              onChange={(e) => updateField('birthPlace', e.target.value)}
              disabled={!isEditing}
              placeholder="请输入出生城市，如：北京"
              className={`w-full p-3 rounded-lg border text-white placeholder-purple-400 transition-all duration-300 ${
                isEditing
                  ? 'bg-purple-800/50 border-purple-600 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20'
                  : 'bg-purple-900/30 border-purple-700 cursor-not-allowed'
              }`}
            />
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex flex-wrap gap-3 pt-4 border-t border-purple-400/20">
            <button
              onClick={saveProfile}
              disabled={!hasChanges || saveStatus === 'saving'}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-600 rounded-lg font-semibold text-white transition-all duration-300 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span>{saveStatus === 'saving' ? '保存中...' : '保存信息'}</span>
            </button>

            <button
              onClick={clearProfile}
              className="flex items-center space-x-2 px-4 py-3 bg-red-600/20 hover:bg-red-600/30 border border-red-400/50 rounded-lg font-medium text-red-300 transition-all duration-300"
            >
              <Trash2 className="w-4 h-4" />
              <span>清空</span>
            </button>

            <button
              onClick={exportProfile}
              className="flex items-center space-x-2 px-4 py-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-400/50 rounded-lg font-medium text-blue-300 transition-all duration-300"
            >
              <Download className="w-4 h-4" />
              <span>导出</span>
            </button>

            <label className="flex items-center space-x-2 px-4 py-3 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-400/50 rounded-lg font-medium text-purple-300 transition-all duration-300 cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>导入</span>
              <input
                type="file"
                accept=".json"
                onChange={importProfile}
                className="hidden"
              />
            </label>
          </div>
        )}

        {/* Usage Info */}
        <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-400/20">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-blue-400 font-medium mb-1">使用说明</h4>
              <ul className="text-blue-200 text-sm space-y-1">
                <li>• 保存后的信息会在占卜时自动填入</li>
                <li>• 数据仅存储在您的浏览器本地，保护隐私安全</li>
                <li>• 出生时间越精确，命理分析越准确</li>
                <li>• 可以导出备份您的个人信息</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;