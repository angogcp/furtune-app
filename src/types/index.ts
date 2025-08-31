// Core divination types and interfaces

export type DivinationStep = 'method' | 'type' | 'input' | 'result';

export type DivinationCategory = 'western' | 'eastern' | 'psychology';

export type DivinationMethodId = 
  | 'tarot' 
  | 'astrology' 
  | 'numerology' 
  | 'lottery' 
  | 'jiaobei' 
  | 'bazi' 
  | 'ziwei' 
  | 'personality' 
  | 'compatibility' 
  | 'lifestory';

export type ReadingTypeId = 'love' | 'career' | 'wealth' | 'health' | 'general';

export interface DivinationMethod {
  id: DivinationMethodId;
  name: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  color: string;
  category: DivinationCategory;
}

export interface ReadingType {
  id: ReadingTypeId;
  name: string;
  icon: React.ReactNode;
}

// Birth and personal information types
export interface BirthInfo {
  date: string;
  time: string;
  place: string;
  gender: 'male' | 'female';
}

export interface PartnerInfo {
  name: string;
  birthDate: string;
  zodiac: string;
}

// Tarot-specific types
export interface TarotCard {
  id: string;
  name: string;
  meaning: string;
  reversedMeaning: string;
  keywords: string[];
  category: 'major' | 'minor';
  suit?: string;
  number?: number;
  element?: string;
  astrology?: string;
  description?: string;
}

export interface TarotPosition {
  name: string;
  meaning: string;
}

export interface TarotSpread {
  id: string;
  name: string;
  description: string;
  positions: TarotPosition[];
}

export interface ProcessedTarotCard extends TarotCard {
  isReversed: boolean;
  position: TarotPosition;
}

// Astrology-specific types
export interface ZodiacSign {
  id: string;
  name: string;
  symbol: string;
  dates: string;
  element: string;
  quality: string;
  traits: string[];
  strengths: string[];
  weaknesses: string[];
  keywords: string[];
  luckyNumbers: number[];
  luckyColors: string[];
  compatibility: string[];
}

export interface BirthChart {
  sunSign: ZodiacSign;
  moonSign: ZodiacSign;
  ascendant: ZodiacSign;
}

// Numerology-specific types
export interface LifeNumberInfo {
  number: number;
  name: string;
  meaning: string;
  personality: string[];
  strengths: string[];
  weaknesses: string[];
  keywords: string[];
  career: string[];
  love: string[];
  health: string[];
  compatibleNumbers: number[];
  luckyColors: string[];
}

export interface AdvancedNameAnalysis {
  totalStrokes: number;
  personalityNumber: number;
  destinyNumber: number;
  earthNumber: number;
  externalNumber: number;
  overallFortune: string;
  careerLuck: string;
  wealthLuck: string;
  loveLuck: string;
  healthLuck: string;
  luckyElements: {
    colors: string[];
    directions: string[];
  };
}

// Lottery-specific types
export interface LotteryData {
  category: string;
  meaning: string;
  poem: string;
  interpretation: string;
  advice: string;
  luckyElements: {
    direction: string;
    color: string;
    number: number[];
    time: string;
  };
}

// Jiaobei-specific types
export interface JiaobeiResult {
  name: string;
  meaning: string;
}

// Special data for different divination methods
export interface SpecialData {
  selectedCards?: number[];
  cardCount?: number;
  processedTarotCards?: ProcessedTarotCard[];
  drawingResult?: any;
  name?: string;
  [key: string]: any;
}

// Main application state
export interface DivinationState {
  currentStep: DivinationStep;
  selectedMethod: DivinationMethodId | '';
  selectedType: ReadingTypeId | '';
  userInput: string;
  isLoading: boolean;
  result: string;
  isGeneratingInterpretation: boolean;
  plainLanguageResult: string;
  specialData: SpecialData;
  isDrawing: boolean;
  drawingResult: any;
  jiaobeiBlessConfirmed: boolean;
  birthInfo: BirthInfo;
  partnerInfo: PartnerInfo;
}

// Toast notification types
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
}

// Component props types
export interface DivinationMethodSelectorProps {
  methods: DivinationMethod[];
  selectedMethod: DivinationMethodId | '';
  onMethodSelect: (methodId: DivinationMethodId) => void;
}

export interface DivinationTypeSelectorProps {
  types: ReadingType[];
  selectedType: ReadingTypeId | '';
  onTypeSelect: (typeId: ReadingTypeId) => void;
  selectedMethod: DivinationMethodId | '';
}

export interface DivinationInputProps {
  selectedMethod: DivinationMethodId;
  selectedType: ReadingTypeId;
  userInput: string;
  onInputChange: (input: string) => void;
  birthInfo: BirthInfo;
  onBirthInfoChange: (info: BirthInfo) => void;
  partnerInfo: PartnerInfo;
  onPartnerInfoChange: (info: PartnerInfo) => void;
  specialData: SpecialData;
  onSpecialDataChange: (data: SpecialData) => void;
  isDrawing: boolean;
  onStartDivination: () => void;
}

export interface DivinationResultProps {
  result: string;
  selectedMethod: DivinationMethodId;
  selectedType: ReadingTypeId;
  isLoading: boolean;
  plainLanguageResult: string;
  isGeneratingInterpretation: boolean;
  onGeneratePlainLanguage: () => void;
  onRestart: () => void;
  onCopyResult: () => void;
  onPrintResult: () => void;
  onDownloadResult: () => void;
}

// Error boundary types
export interface ErrorInfo {
  componentStack: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

// Loading state types
export interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;