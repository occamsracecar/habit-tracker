export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      habits: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      completions: {
        Row: {
          id: string;
          habit_id: string;
          day_index: number;
          coins_earned: number;
          date: string;
        };
        Insert: {
          id?: string;
          habit_id: string;
          day_index: number;
          coins_earned: number;
          date: string;
        };
        Update: {
          id?: string;
          habit_id?: string;
          day_index?: number;
          coins_earned?: number;
          date?: string;
        };
        Relationships: [
          {
            foreignKeyName: "completions_habit_id_fkey";
            columns: ["habit_id"];
            isOneToOne: false;
            referencedRelation: "habits";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
