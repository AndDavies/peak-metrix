export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_insights: {
        Row: {
          created_at: string | null
          id: string
          insight: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          insight?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          insight?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_insights_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      benchmarks: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          name: string
          units: string
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          units: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          units?: string
        }
        Relationships: []
      }
      class_registrations: {
        Row: {
          class_schedule_id: string
          id: string
          registration_date: string | null
          status: string | null
          user_profile_id: string
        }
        Insert: {
          class_schedule_id: string
          id?: string
          registration_date?: string | null
          status?: string | null
          user_profile_id: string
        }
        Update: {
          class_schedule_id?: string
          id?: string
          registration_date?: string | null
          status?: string | null
          user_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_class_schedule"
            columns: ["class_schedule_id"]
            isOneToOne: false
            referencedRelation: "class_schedules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_user_profile"
            columns: ["user_profile_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      class_schedules: {
        Row: {
          class_name: string
          class_type_id: string | null
          created_at: string | null
          current_gym_id: string | null
          end_time: string
          id: string
          instructor_id: string | null
          max_participants: number | null
          start_time: string
          track_id: string | null
        }
        Insert: {
          class_name: string
          class_type_id?: string | null
          created_at?: string | null
          current_gym_id?: string | null
          end_time: string
          id?: string
          instructor_id?: string | null
          max_participants?: number | null
          start_time: string
          track_id?: string | null
        }
        Update: {
          class_name?: string
          class_type_id?: string | null
          created_at?: string | null
          current_gym_id?: string | null
          end_time?: string
          id?: string
          instructor_id?: string | null
          max_participants?: number | null
          start_time?: string
          track_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "class_schedules_class_type_id_fkey"
            columns: ["class_type_id"]
            isOneToOne: false
            referencedRelation: "class_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_schedules_current_gym_id_fkey"
            columns: ["current_gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_schedules_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "class_schedules_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      class_types: {
        Row: {
          class_name: string
          color: string | null
          created_at: string | null
          description: string | null
          gym_id: string
          id: string
        }
        Insert: {
          class_name: string
          color?: string | null
          created_at?: string | null
          description?: string | null
          gym_id: string
          id?: string
        }
        Update: {
          class_name?: string
          color?: string | null
          created_at?: string | null
          description?: string | null
          gym_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_types_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
        ]
      }
      gym_plans: {
        Row: {
          cost: number
          created_at: string | null
          duration_months: number
          gym_id: string
          id: string
          plan_name: string
        }
        Insert: {
          cost: number
          created_at?: string | null
          duration_months: number
          gym_id: string
          id?: string
          plan_name: string
        }
        Update: {
          cost?: number
          created_at?: string | null
          duration_months?: number
          gym_id?: string
          id?: string
          plan_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "gym_plans_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
        ]
      }
      gyms: {
        Row: {
          contact_email: string | null
          created_at: string | null
          description: string | null
          id: string
          location: string | null
          member_code: string | null
          name: string
        }
        Insert: {
          contact_email?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          location?: string | null
          member_code?: string | null
          name: string
        }
        Update: {
          contact_email?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          location?: string | null
          member_code?: string | null
          name?: string
        }
        Relationships: []
      }
      invitations: {
        Row: {
          created_at: string | null
          expires_at: string | null
          gym_id: string
          id: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          gym_id: string
          id?: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          gym_id?: string
          id?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invitations_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
        ]
      }
      member_feedback: {
        Row: {
          comments: string | null
          created_at: string
          gym_id: string
          id: string
          score: number
          user_id: string
        }
        Insert: {
          comments?: string | null
          created_at?: string
          gym_id: string
          id?: string
          score: number
          user_id: string
        }
        Update: {
          comments?: string | null
          created_at?: string
          gym_id?: string
          id?: string
          score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_feedback_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      memberships: {
        Row: {
          cost: number | null
          created_at: string
          end_date: string | null
          gym_id: string
          id: string
          membership_type: string
          start_date: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cost?: number | null
          created_at?: string
          end_date?: string | null
          gym_id: string
          id?: string
          membership_type: string
          start_date?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cost?: number | null
          created_at?: string
          end_date?: string | null
          gym_id?: string
          id?: string
          membership_type?: string
          start_date?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memberships_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      movements: {
        Row: {
          base_movement_id: number | null
          common_aliases: string[] | null
          common_sets: number | null
          common_weight_range: string | null
          default_reps: number | null
          description: string | null
          equipment_required: boolean | null
          id: number
          name: string
          variations: Json | null
        }
        Insert: {
          base_movement_id?: number | null
          common_aliases?: string[] | null
          common_sets?: number | null
          common_weight_range?: string | null
          default_reps?: number | null
          description?: string | null
          equipment_required?: boolean | null
          id?: number
          name: string
          variations?: Json | null
        }
        Update: {
          base_movement_id?: number | null
          common_aliases?: string[] | null
          common_sets?: number | null
          common_weight_range?: string | null
          default_reps?: number | null
          description?: string | null
          equipment_required?: boolean | null
          id?: number
          name?: string
          variations?: Json | null
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          ip_address: string | null
          referrer: string | null
          unsubscribed: boolean | null
        }
        Insert: {
          created_at?: string
          email: string
          ip_address?: string | null
          referrer?: string | null
          unsubscribed?: boolean | null
        }
        Update: {
          created_at?: string
          email?: string
          ip_address?: string | null
          referrer?: string | null
          unsubscribed?: boolean | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      scheduled_workouts: {
        Row: {
          advanced_scoring: string | null
          cool_down: string | null
          created_at: string | null
          date: string
          gym_id: string | null
          id: string
          is_template: boolean | null
          name: string | null
          notes: string | null
          order_type: string | null
          origin: string | null
          scoring_set: string | null
          scoring_type: string | null
          status: string | null
          track_id: string | null
          user_id: string
          warm_up: string | null
          workout_details: Json
          workout_id: number | null
        }
        Insert: {
          advanced_scoring?: string | null
          cool_down?: string | null
          created_at?: string | null
          date: string
          gym_id?: string | null
          id?: string
          is_template?: boolean | null
          name?: string | null
          notes?: string | null
          order_type?: string | null
          origin?: string | null
          scoring_set?: string | null
          scoring_type?: string | null
          status?: string | null
          track_id?: string | null
          user_id: string
          warm_up?: string | null
          workout_details: Json
          workout_id?: number | null
        }
        Update: {
          advanced_scoring?: string | null
          cool_down?: string | null
          created_at?: string | null
          date?: string
          gym_id?: string | null
          id?: string
          is_template?: boolean | null
          name?: string | null
          notes?: string | null
          order_type?: string | null
          origin?: string | null
          scoring_set?: string | null
          scoring_type?: string | null
          status?: string | null
          track_id?: string | null
          user_id?: string
          warm_up?: string | null
          workout_details?: Json
          workout_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_workouts_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_workouts_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_workouts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "scheduled_workouts_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["workoutid"]
          },
        ]
      }
      tracks: {
        Row: {
          created_at: string | null
          description: string | null
          gym_id: string | null
          id: string
          is_public: boolean | null
          name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          gym_id?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          gym_id?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tracks_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tracks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_benchmark_results: {
        Row: {
          benchmark_id: string | null
          date_recorded: string | null
          id: string
          result_value: string
          user_id: string | null
        }
        Insert: {
          benchmark_id?: string | null
          date_recorded?: string | null
          id?: string
          result_value: string
          user_id?: string | null
        }
        Update: {
          benchmark_id?: string | null
          date_recorded?: string | null
          id?: string
          result_value?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_benchmark_results_benchmark_id_fkey"
            columns: ["benchmark_id"]
            isOneToOne: false
            referencedRelation: "benchmarks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_benchmark_results_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_benchmarks: {
        Row: {
          benchmark_name: string
          benchmark_value: string
          date_recorded: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          benchmark_name: string
          benchmark_value: string
          date_recorded?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          benchmark_name?: string
          benchmark_value?: string
          date_recorded?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_benchmarks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          activity_level: string | null
          age: number | null
          bio: string | null
          created_at: string | null
          current_gym_id: string | null
          display_name: string | null
          email: string | null
          emergency_contact: string | null
          emergency_contact_name: string | null
          gender: string | null
          goals: string | null
          height: number | null
          join_date: string | null
          last_login: string | null
          metrics: Json | null
          notifications_enabled: boolean | null
          occupation: string | null
          onboarding_completed: boolean | null
          onboarding_data: Json | null
          phone_number: string | null
          postal_code: string | null
          profile_picture: string | null
          role: string
          subscription_plan: string | null
          trainer_id: string | null
          user_id: string
          weight: number | null
        }
        Insert: {
          activity_level?: string | null
          age?: number | null
          bio?: string | null
          created_at?: string | null
          current_gym_id?: string | null
          display_name?: string | null
          email?: string | null
          emergency_contact?: string | null
          emergency_contact_name?: string | null
          gender?: string | null
          goals?: string | null
          height?: number | null
          join_date?: string | null
          last_login?: string | null
          metrics?: Json | null
          notifications_enabled?: boolean | null
          occupation?: string | null
          onboarding_completed?: boolean | null
          onboarding_data?: Json | null
          phone_number?: string | null
          postal_code?: string | null
          profile_picture?: string | null
          role?: string
          subscription_plan?: string | null
          trainer_id?: string | null
          user_id: string
          weight?: number | null
        }
        Update: {
          activity_level?: string | null
          age?: number | null
          bio?: string | null
          created_at?: string | null
          current_gym_id?: string | null
          display_name?: string | null
          email?: string | null
          emergency_contact?: string | null
          emergency_contact_name?: string | null
          gender?: string | null
          goals?: string | null
          height?: number | null
          join_date?: string | null
          last_login?: string | null
          metrics?: Json | null
          notifications_enabled?: boolean | null
          occupation?: string | null
          onboarding_completed?: boolean | null
          onboarding_data?: Json | null
          phone_number?: string | null
          postal_code?: string | null
          profile_picture?: string | null
          role?: string
          subscription_plan?: string | null
          trainer_id?: string | null
          user_id?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_gym_id_fkey"
            columns: ["current_gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_results: {
        Row: {
          advanced_scoring: string | null
          benchmark_id: string | null
          date_logged: string
          date_performed: string
          id: string
          notes: string | null
          order_type: string | null
          perceived_exertion: number | null
          result: Json
          scheduled_workout_id: string
          scoring_type: string | null
          user_profile_id: string
          workout_focus: string | null
        }
        Insert: {
          advanced_scoring?: string | null
          benchmark_id?: string | null
          date_logged?: string
          date_performed: string
          id?: string
          notes?: string | null
          order_type?: string | null
          perceived_exertion?: number | null
          result: Json
          scheduled_workout_id: string
          scoring_type?: string | null
          user_profile_id: string
          workout_focus?: string | null
        }
        Update: {
          advanced_scoring?: string | null
          benchmark_id?: string | null
          date_logged?: string
          date_performed?: string
          id?: string
          notes?: string | null
          order_type?: string | null
          perceived_exertion?: number | null
          result?: Json
          scheduled_workout_id?: string
          scoring_type?: string | null
          user_profile_id?: string
          workout_focus?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_results_benchmark_id_fkey"
            columns: ["benchmark_id"]
            isOneToOne: false
            referencedRelation: "benchmarks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_results_scheduled_workout_id_fkey"
            columns: ["scheduled_workout_id"]
            isOneToOne: false
            referencedRelation: "scheduled_workouts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_results_scheduled_workout_id_fkey1"
            columns: ["scheduled_workout_id"]
            isOneToOne: false
            referencedRelation: "scheduled_workouts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_results_user_profile_id_fkey"
            columns: ["user_profile_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      workouts: {
        Row: {
          advanced_scoring: string | null
          category: string | null
          description: Json | null
          is_template: boolean | null
          movements: string | null
          notes: string | null
          origin: string | null
          results_count: number | null
          score_type: string | null
          score_value: number | null
          scoring_set: string | null
          scoring_type: string | null
          title: string
          workoutid: number
        }
        Insert: {
          advanced_scoring?: string | null
          category?: string | null
          description?: Json | null
          is_template?: boolean | null
          movements?: string | null
          notes?: string | null
          origin?: string | null
          results_count?: number | null
          score_type?: string | null
          score_value?: number | null
          scoring_set?: string | null
          scoring_type?: string | null
          title: string
          workoutid?: number
        }
        Update: {
          advanced_scoring?: string | null
          category?: string | null
          description?: Json | null
          is_template?: boolean | null
          movements?: string | null
          notes?: string | null
          origin?: string | null
          results_count?: number | null
          score_type?: string | null
          score_value?: number | null
          scoring_set?: string | null
          scoring_type?: string | null
          title?: string
          workoutid?: number
        }
        Relationships: []
      }
    }
    Views: {
      recent_workouts_view: {
        Row: {
          current_gym_id: string | null
          date_performed: string | null
          display_name: string | null
          workout_title: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_gym_id_fkey"
            columns: ["current_gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      average_satisfaction: {
        Args: {
          gymid: string
        }
        Returns: number
      }
      avg_classes_per_member_month: {
        Args: {
          gymid: string
        }
        Returns: number
      }
      calculate_average_tenure: {
        Args: {
          gymid: string
        }
        Returns: number
      }
      monthly_churn: {
        Args: {
          gymid: string
        }
        Returns: number
      }
      new_memberships_month: {
        Args: {
          gymid: string
        }
        Returns: number
      }
      nps: {
        Args: {
          gymid: string
        }
        Returns: number
      }
      total_active_members: {
        Args: {
          gymid: string
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
