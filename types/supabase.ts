export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      assignments: {
        Row: {
          course_id: string;
          created_at: string;
          description: string | null;
          due_date: string;
          id: string;
          title: string;
        };
        Insert: {
          course_id: string;
          created_at?: string;
          description?: string | null;
          due_date: string;
          id?: string;
          title: string;
        };
        Update: {
          course_id?: string;
          created_at?: string;
          description?: string | null;
          due_date?: string;
          id?: string;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'assignments_course_id_fkey';
            columns: ['course_id'];
            isOneToOne: false;
            referencedRelation: 'courses';
            referencedColumns: ['id'];
          },
        ];
      };
      courses: {
        Row: {
          created_at: string;
          description: string;
          id: string;
          level: number;
          title: string;
        };
        Insert: {
          created_at?: string;
          description: string;
          id?: string;
          level: number;
          title: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          id?: string;
          level?: number;
          title?: string;
        };
        Relationships: [];
      };
      lessons: {
        Row: {
          content: string;
          created_at: string;
          id: string;
          module_id: string;
          order: number;
          title: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          id?: string;
          module_id: string;
          order: number;
          title: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          id?: string;
          module_id?: string;
          order?: number;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'lessons_module_id_fkey';
            columns: ['module_id'];
            isOneToOne: false;
            referencedRelation: 'modules';
            referencedColumns: ['id'];
          },
        ];
      };
      modules: {
        Row: {
          course_id: string;
          created_at: string;
          description: string | null;
          id: string;
          order: number;
          title: string;
        };
        Insert: {
          course_id: string;
          created_at?: string;
          description?: string | null;
          id?: string;
          order: number;
          title: string;
        };
        Update: {
          course_id?: string;
          created_at?: string;
          description?: string | null;
          id?: string;
          order?: number;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'modules_course_id_fkey';
            columns: ['course_id'];
            isOneToOne: false;
            referencedRelation: 'courses';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          dob: string | null;
          first_name: string | null;
          grade: number | null;
          id: string;
          last_name: string | null;
          phone: string | null;
          school: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          dob?: string | null;
          first_name?: string | null;
          grade?: number | null;
          id?: string;
          last_name?: string | null;
          phone?: string | null;
          school?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          dob?: string | null;
          first_name?: string | null;
          grade?: number | null;
          id?: string;
          last_name?: string | null;
          phone?: string | null;
          school?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      questions: {
        Row: {
          content: string;
          correct_answer: string;
          created_at: string;
          explanation: string | null;
          id: string;
          level: number;
          options: string[];
          type: string;
        };
        Insert: {
          content: string;
          correct_answer: string;
          created_at?: string;
          explanation?: string | null;
          id?: string;
          level: number;
          options: string[];
          type: string;
        };
        Update: {
          content?: string;
          correct_answer?: string;
          created_at?: string;
          explanation?: string | null;
          id?: string;
          level?: number;
          options?: string[];
          type?: string;
        };
        Relationships: [];
      };
      test_questions: {
        Row: {
          created_at: string;
          id: string;
          order: number;
          question_id: string;
          test_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          order: number;
          question_id: string;
          test_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          order?: number;
          question_id?: string;
          test_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'test_questions_question_id_fkey';
            columns: ['question_id'];
            isOneToOne: false;
            referencedRelation: 'questions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'test_questions_test_id_fkey';
            columns: ['test_id'];
            isOneToOne: false;
            referencedRelation: 'tests';
            referencedColumns: ['id'];
          },
        ];
      };
      test_sessions: {
        Row: {
          completed_at: string | null;
          created_at: string;
          id: string;
          started_at: string;
          status: string;
          test_id: string;
          user_id: string;
        };
        Insert: {
          completed_at?: string | null;
          created_at?: string;
          id?: string;
          started_at?: string;
          status: string;
          test_id: string;
          user_id: string;
        };
        Update: {
          completed_at?: string | null;
          created_at?: string;
          id?: string;
          started_at?: string;
          status?: string;
          test_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'test_sessions_test_id_fkey';
            columns: ['test_id'];
            isOneToOne: false;
            referencedRelation: 'tests';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'test_sessions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      tests: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          time_limit: number | null;
          title: string;
          type: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          time_limit?: number | null;
          title: string;
          type: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          time_limit?: number | null;
          title?: string;
          type?: string;
        };
        Relationships: [];
      };
      user_answers: {
        Row: {
          answer: string;
          created_at: string;
          id: string;
          is_correct: boolean;
          question_id: string;
          session_id: string;
          user_id: string;
        };
        Insert: {
          answer: string;
          created_at?: string;
          id?: string;
          is_correct: boolean;
          question_id: string;
          session_id: string;
          user_id: string;
        };
        Update: {
          answer?: string;
          created_at?: string;
          id?: string;
          is_correct?: boolean;
          question_id?: string;
          session_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_answers_question_id_fkey';
            columns: ['question_id'];
            isOneToOne: false;
            referencedRelation: 'questions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_answers_session_id_fkey';
            columns: ['session_id'];
            isOneToOne: false;
            referencedRelation: 'test_sessions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_answers_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      user_progress: {
        Row: {
          course_id: string;
          created_at: string;
          id: string;
          last_accessed: string;
          lesson_id: string | null;
          module_id: string | null;
          progress_percentage: number;
          status: string;
          user_id: string;
        };
        Insert: {
          course_id: string;
          created_at?: string;
          id?: string;
          last_accessed?: string;
          lesson_id?: string | null;
          module_id?: string | null;
          progress_percentage?: number;
          status?: string;
          user_id: string;
        };
        Update: {
          course_id?: string;
          created_at?: string;
          id?: string;
          last_accessed?: string;
          lesson_id?: string | null;
          module_id?: string | null;
          progress_percentage?: number;
          status?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_progress_course_id_fkey';
            columns: ['course_id'];
            isOneToOne: false;
            referencedRelation: 'courses';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_progress_lesson_id_fkey';
            columns: ['lesson_id'];
            isOneToOne: false;
            referencedRelation: 'lessons';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_progress_module_id_fkey';
            columns: ['module_id'];
            isOneToOne: false;
            referencedRelation: 'modules';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_progress_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      users: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          locale: string;
          name: string | null;
          role: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id: string;
          locale?: string;
          name?: string | null;
          role?: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          locale?: string;
          name?: string | null;
          role?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'users_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database['public']['Tables'] & Database['public']['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database['public']['Tables'] &
        Database['public']['Views'])
    ? (Database['public']['Tables'] &
        Database['public']['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof Database['public']['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof Database['public']['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof Database['public']['Enums'] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof Database['public']['Enums']
    ? Database['public']['Enums'][PublicEnumNameOrOptions]
    : never;
