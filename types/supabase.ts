export type Database = {
  public: {
    Tables: {
      assignments: {
        Row: any
        Insert: any
        Update: any
      }
      courses: {
        Row: any
        Insert: any
        Update: any
      }
      lessons: {
        Row: any
        Insert: any
        Update: any
      }
      modules: {
        Row: any
        Insert: any
        Update: any
      }
      questions: {
        Row: any
        Insert: any
        Update: any
      }
      test_questions: {
        Row: any
        Insert: any
        Update: any
      }
      tests: {
        Row: any
        Insert: any
        Update: any
      }
      test_sessions: {
        Row: any
        Insert: any
        Update: any
      }
      user_answers: {
        Row: any
        Insert: any
        Update: any
      }
      user_progress: {
        Row: any
        Insert: any
        Update: any
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

