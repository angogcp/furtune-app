import React, { useState } from 'react';
import { 
  Sparkles, Settings, UserCircle
} from 'lucide-react';
import ImprovedHomepage from './ImprovedHomepage';
import UserProfile from './UserProfile';
import ModernFortuneInterface from './ModernFortuneTelling/ModernFortuneInterface';
import ErrorBoundary from './ErrorBoundary';
import { ProfileProvider, useProfile } from '../contexts/ProfileContext';

// 简化的接口定义
interface ImprovedFortuneAppContentProps {
  onNavigateToProfile?: () => void;
  onMethodSelect?: (methodId: string) => void;
}

const ImprovedFortuneAppContent: React.FC<ImprovedFortuneAppContentProps> = ({ onNavigateToProfile, onMethodSelect }) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const [showModernFortune, setShowModernFortune] = useState<boolean>(false);



  // 处理占卜方法选择
  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    setShowModernFortune(true);
    onMethodSelect?.(methodId);
  };

  // 返回选择页面
  const handleBackToSelection = () => {
    setShowModernFortune(false);
    setSelectedMethod('');
  };

  // 如果选择了占卜方法，显示现代占卜界面
  if (showModernFortune && selectedMethod) {
    return (
      <ModernFortuneInterface
        selectedMethodId={selectedMethod}
        onBack={handleBackToSelection}
        onNavigateToProfile={() => setShowProfile(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white relative">

      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-yellow-400 mr-3" />

            <Sparkles className="w-8 h-8 text-yellow-400 ml-3" />
          </div>

        </div>

        {/* Main Content - 只保留分类浏览 */}
        <div className="mb-8">
          <ImprovedHomepage
            onSelectMethod={handleMethodSelect}
            onNavigateToProfile={onNavigateToProfile}
          />
        </div>

        {/* Profile Modal */}
        {showProfile && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <UserProfile 
                onClose={() => setShowProfile(false)}
                className="w-full"
              />
            </div>
          </div>
        )}


      </div>
    </div>
  );
};

// 简化的主组件
const ImprovedFortuneApp: React.FC = () => {
  return (
    <ProfileProvider>
      <ImprovedFortuneAppContent />
    </ProfileProvider>
  );
};

export default ImprovedFortuneApp;
export { ImprovedFortuneAppContent };