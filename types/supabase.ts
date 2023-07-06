export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      channels: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      channels_users: {
        Row: {
          channel_id: number | null
          created_at: string | null
          id: number
          user_id: number | null
        }
        Insert: {
          channel_id?: number | null
          created_at?: string | null
          id?: number
          user_id?: number | null
        }
        Update: {
          channel_id?: number | null
          created_at?: string | null
          id?: number
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "channels_users_channel_id_fkey"
            columns: ["channel_id"]
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "channels_users_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      messages: {
        Row: {
          created_at: string | null
          id: number
          image_url: string | null
          message: string
          user_id: number | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          image_url?: string | null
          message: string
          user_id?: number | null
        }
        Update: {
          created_at?: string | null
          id?: number
          image_url?: string | null
          message?: string
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          id: number
          max_nb_users: number
          name: string
          public: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          max_nb_users: number
          name: string
          public?: boolean | null
        }
        Update: {
          created_at?: string | null
          id?: number
          max_nb_users?: number
          name?: string
          public?: boolean | null
        }
        Relationships: []
      }
      roles_users: {
        Row: {
          id: number
          role_id: number | null
          user_id: number | null
        }
        Insert: {
          id?: number
          role_id?: number | null
          user_id?: number | null
        }
        Update: {
          id?: number
          role_id?: number | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "roles_users_role_id_fkey"
            columns: ["role_id"]
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "roles_users_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          availability: Json | null
          created_at: string | null
          description: string | null
          email: string
          id: number
          image_url: string | null
          is_admin: boolean | null
          session_id: string | null
          username: string
        }
        Insert: {
          availability?: Json | null
          created_at?: string | null
          description?: string | null
          email: string
          id?: number
          image_url?: string | null
          is_admin?: boolean | null
          session_id?: string | null
          username: string
        }
        Update: {
          availability?: Json | null
          created_at?: string | null
          description?: string | null
          email?: string
          id?: number
          image_url?: string | null
          is_admin?: boolean | null
          session_id?: string | null
          username?: string
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
