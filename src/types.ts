// 占卜方法类型
export type DivinationMethod = 'tarot' | 'bazi' | 'ziwei' | 'iching' | 'numerology' | 'astrology' | 'palmistry' | 'compatibility' | 'lottery' | 'jiaobei' | 'personality' | 'lifestory';

export type DivinationMethodId = DivinationMethod;

export type ReadingType = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactElement;
};

// 占卜类型
export type DivinationType = 
  | 'love' 
  | 'career' 
  | 'wealth' 
  | 'health' 
  | 'general';

// 占卜步骤
export type DivinationStep = 
  | 'method' 
  | 'type' 
  | 'input' 
  | 'result';

// 出生信息
export interface BirthInfo {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  time: string;
  place: string;
  gender: 'male' | 'female';
  location?: string;
}

export interface PartnerInfo {
  name: string;
  birthInfo: BirthInfo;
}

// 特殊数据
export interface SpecialData {
  [key: string]: any;
}

// 占卜方法配置
export interface DivinationMethodConfig {
  id: DivinationMethod;
  name: string;
  description: string;
  icon: React.ReactElement;
  gradient: string;
  color: string;
  category: string;
}

// 占卜类型配置
export interface DivinationTypeConfig {
  id: DivinationType;
  name: string;
  icon: React.ReactElement;
}

// 占卜状态
export interface DivinationState {
  currentStep: DivinationStep;
  selectedMethod: DivinationMethod | null;
  selectedType: DivinationType | null;
  userInput: string;
  birthInfo: BirthInfo;
  specialData: SpecialData;
  result: string;
  isLoading: boolean;
  isGeneratingInterpretation: boolean;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export interface ErrorInfo {
  componentStack: string;
}