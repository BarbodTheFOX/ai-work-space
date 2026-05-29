export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string;
          role: "founder" | "assistant";
          operational_area: string;
          avatar: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name: string;
          role: "founder" | "assistant";
          operational_area?: string;
          avatar?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          name: string;
          description: string;
          status: "active" | "paused" | "completed" | "archived";
          owner_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          status?: "active" | "paused" | "completed" | "archived";
          owner_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>;
        Relationships: [];
      };
      tasks: {
        Row: {
          id: string;
          title: string;
          description: string;
          owner_id: string;
          created_by: string;
          project_id: string;
          priority: "low" | "normal" | "high" | "urgent";
          status: "todo" | "in_progress" | "waiting" | "review" | "done" | "blocked";
          deadline: string;
          timeframe: "daily" | "weekly" | "monthly" | "one_time";
          progress: number;
          source: "manual" | "meeting" | "ai";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string;
          owner_id: string;
          created_by: string;
          project_id: string;
          priority?: "low" | "normal" | "high" | "urgent";
          status?: "todo" | "in_progress" | "waiting" | "review" | "done" | "blocked";
          deadline?: string;
          timeframe?: "daily" | "weekly" | "monthly" | "one_time";
          progress?: number;
          source?: "manual" | "meeting" | "ai";
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["tasks"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      profile_role: "founder" | "assistant";
      project_status: "active" | "paused" | "completed" | "archived";
      task_status: "todo" | "in_progress" | "waiting" | "review" | "done" | "blocked";
      task_priority: "low" | "normal" | "high" | "urgent";
      task_timeframe: "daily" | "weekly" | "monthly" | "one_time";
      task_source: "manual" | "meeting" | "ai";
    };
    CompositeTypes: Record<string, never>;
  };
};
