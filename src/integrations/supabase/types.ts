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
      metrics: {
        Row: {
          cap_rate: number
          created_at: string | null
          id: string
          noi: number
          property_id: string | null
          roi: number
          undervalued: boolean | null
          updated_at: string | null
        }
        Insert: {
          cap_rate: number
          created_at?: string | null
          id?: string
          noi: number
          property_id?: string | null
          roi: number
          undervalued?: boolean | null
          updated_at?: string | null
        }
        Update: {
          cap_rate?: number
          created_at?: string | null
          id?: string
          noi?: number
          property_id?: string | null
          roi?: number
          undervalued?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "metrics_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          bolt_tracking_id: string
          created_at: string | null
          id: string
          items: Json
          payment_method: string
          proof_path: string | null
          total_amount: number
          user_id: string
        }
        Insert: {
          bolt_tracking_id: string
          created_at?: string | null
          id?: string
          items: Json
          payment_method: string
          proof_path?: string | null
          total_amount: number
          user_id: string
        }
        Update: {
          bolt_tracking_id?: string
          created_at?: string | null
          id?: string
          items?: Json
          payment_method?: string
          proof_path?: string | null
          total_amount?: number
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string
          annual_rent: number
          created_at: string | null
          down_payment: number | null
          expenses: number
          id: string
          landlord_id: string | null
          loan_amount: number | null
          price: number
          square_feet: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address: string
          annual_rent: number
          created_at?: string | null
          down_payment?: number | null
          expenses: number
          id?: string
          landlord_id?: string | null
          loan_amount?: number | null
          price: number
          square_feet: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string
          annual_rent?: number
          created_at?: string | null
          down_payment?: number | null
          expenses?: number
          id?: string
          landlord_id?: string | null
          loan_amount?: number | null
          price?: number
          square_feet?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      risk_scores: {
        Row: {
          created_at: string | null
          financial_score: number
          id: string
          neighborhood_score: number
          property_id: string | null
          risk_factors: Json | null
          tenant_score: number
          total_score: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          financial_score: number
          id?: string
          neighborhood_score: number
          property_id?: string | null
          risk_factors?: Json | null
          tenant_score: number
          total_score: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          financial_score?: number
          id?: string
          neighborhood_score?: number
          property_id?: string | null
          risk_factors?: Json | null
          tenant_score?: number
          total_score?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "risk_scores_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string
          end_date: string
          id: string
          landlord_id: string | null
          price_per_tenant: number
          start_date: string
          status: string
          tenant_count: number
          total_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          landlord_id?: string | null
          price_per_tenant?: number
          start_date?: string
          status?: string
          tenant_count: number
          total_amount: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          landlord_id?: string | null
          price_per_tenant?: number
          start_date?: string
          status?: string
          tenant_count?: number
          total_amount?: number
          updated_at?: string
        }
        Relationships: []
      }
      tenants: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          landlord_id: string | null
          lease_end: string | null
          lease_start: string | null
          phone: string | null
          property_id: string | null
          rent_amount: number | null
          unit_number: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          landlord_id?: string | null
          lease_end?: string | null
          lease_start?: string | null
          phone?: string | null
          property_id?: string | null
          rent_amount?: number | null
          unit_number?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          landlord_id?: string | null
          lease_end?: string | null
          lease_start?: string | null
          phone?: string | null
          property_id?: string | null
          rent_amount?: number | null
          unit_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenants_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      uploads: {
        Row: {
          created_at: string | null
          error_message: string | null
          file_url: string | null
          filename: string
          id: string
          processed_count: number | null
          status: string
          total_count: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          file_url?: string | null
          filename: string
          id?: string
          processed_count?: number | null
          status: string
          total_count?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          file_url?: string | null
          filename?: string
          id?: string
          processed_count?: number | null
          status?: string
          total_count?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "super_admin" | "landlord" | "tenant"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["super_admin", "landlord", "tenant"],
    },
  },
} as const
