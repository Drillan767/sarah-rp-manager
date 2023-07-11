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
          roleplay_id: number
        }
        Insert: {
          id?: number
          name: string
          roleplay_id: number
        }
        Update: {
          id?: number
          name?: string
          roleplay_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "channels_roleplay_id_fkey"
            columns: ["roleplay_id"]
            referencedRelation: "roleplays"
            referencedColumns: ["id"]
          }
        ]
      }
      channels_users: {
        Row: {
          channel_id: number
          created_at: string | null
          id: number
          users_id: number
        }
        Insert: {
          channel_id: number
          created_at?: string | null
          id?: number
          users_id: number
        }
        Update: {
          channel_id?: number
          created_at?: string | null
          id?: number
          users_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "channels_users_channel_id_fkey"
            columns: ["channel_id"]
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "channels_users_users_id_fkey"
            columns: ["users_id"]
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
      roleplays: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          message_board: string | null
          roles: Json | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          message_board?: string | null
          roles?: Json | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          message_board?: string | null
          roles?: Json | null
          title?: string
        }
        Relationships: []
      }
      roleplays_users: {
        Row: {
          created_at: string | null
          id: number
          roleplay_id: number
          user_id: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          roleplay_id: number
          user_id: number
        }
        Update: {
          created_at?: string | null
          id?: number
          roleplay_id?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "roleplays_users_roleplay_id_fkey"
            columns: ["roleplay_id"]
            referencedRelation: "roleplays"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "roleplays_users_user_id_fkey"
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
          is_sarah: boolean | null
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
          is_sarah?: boolean | null
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
          is_sarah?: boolean | null
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
