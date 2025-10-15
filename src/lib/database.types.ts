export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; user_id: string; name: string; mobile: string; email: string; address: string; is_admin: boolean; created_at: string }
        Insert: { id?: string; user_id: string; name: string; mobile: string; email: string; address: string; is_admin?: boolean; created_at?: string }
        Update: { id?: string; user_id?: string; name?: string; mobile?: string; email?: string; address?: string; is_admin?: boolean; created_at?: string }
      }
      properties: {
        Row: { id: string; unique_code: string; name: string; full_location: string; lat: number | null; lng: number | null; description: string; price: number; area_sqft: number; property_type: string; ad_type: string; direction_facing: string; length: number; breadth: number; thumbnail_url: string; images: Json; created_by: string; deleted_at: string | null; created_at: string; updated_at: string }
        Insert: { id?: string; unique_code: string; name: string; full_location: string; lat?: number | null; lng?: number | null; description: string; price: number; area_sqft: number; property_type: string; ad_type: string; direction_facing: string; length: number; breadth: number; thumbnail_url: string; images?: Json; created_by: string; deleted_at?: string | null; created_at?: string; updated_at?: string }
        Update: { id?: string; unique_code?: string; name?: string; full_location?: string; lat?: number | null; lng?: number | null; description?: string; price?: number; area_sqft?: number; property_type?: string; ad_type?: string; direction_facing?: string; length?: number; breadth?: number; thumbnail_url?: string; images?: Json; created_by?: string; deleted_at?: string | null; created_at?: string; updated_at?: string }
      }
      inquiries: {
        Row: { id: string; property_id: string; user_id: string; requested_visit_datetime: string; status: string; admin_assigned_datetime: string | null; admin_notes: string | null; created_at: string; updated_at: string }
        Insert: { id?: string; property_id: string; user_id: string; requested_visit_datetime: string; status?: string; admin_assigned_datetime?: string | null; admin_notes?: string | null; created_at?: string; updated_at?: string }
        Update: { id?: string; property_id?: string; user_id?: string; requested_visit_datetime?: string; status?: string; admin_assigned_datetime?: string | null; admin_notes?: string | null; created_at?: string; updated_at?: string }
      }
    }
  }
}
