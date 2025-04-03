import { cache } from 'react';

interface Dictionary {
  [key: string]: string | Dictionary;
}

export const getDictionary = cache(async (locale: string): Promise<Dictionary> => {
  // In a real app, you would load these from files or an API
  // For this example, we'll return some hardcoded values
  const dictionaries: Record<string, Dictionary> = {
    en: {
      common: {
        title: 'Zeta Online',
        welcome: 'Welcome to Zeta Online',
        login: 'Login',
        register: 'Register',
        dashboard: 'Dashboard',
      },
      navigation: {
        home: 'Home',
        about: 'About',
        programs: 'Programs',
        blog: 'Blog',
        contact: 'Contact',
      },
      dashboard: {
        welcome: 'Welcome back',
        tests: 'Tests',
        courses: 'Courses',
        assignments: 'Assignments',
        reports: 'Reports',
      },
      auth: {
        signIn: 'Sign in',
        signUp: 'Sign up',
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm Password',
      },
    },
    ko: {
      common: {
        title: '제타 온라인',
        welcome: '제타 온라인에 오신 것을 환영합니다',
        login: '로그인',
        register: '등록',
        dashboard: '대시보드',
      },
      navigation: {
        home: '홈',
        about: '소개',
        programs: '프로그램',
        blog: '블로그',
        contact: '연락처',
      },
      dashboard: {
        welcome: '다시 오신 것을 환영합니다',
        tests: '테스트',
        courses: '과정',
        assignments: '과제',
        reports: '보고서',
      },
      auth: {
        signIn: '로그인',
        signUp: '회원가입',
        email: '이메일',
        password: '비밀번호',
        confirmPassword: '비밀번호 확인',
      },
    },
  };

  return dictionaries[locale] || dictionaries.en;
});
