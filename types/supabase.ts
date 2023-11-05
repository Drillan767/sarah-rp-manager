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
      blacklists: {
        Row: {
          created_at: string
          id: number
          reason: string
          roleplay_id: string
          user_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          reason: string
          roleplay_id: string
          user_id: number
        }
        Update: {
          created_at?: string
          id?: number
          reason?: string
          roleplay_id?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "blacklists_roleplay_id_fkey"
            columns: ["roleplay_id"]
            isOneToOne: false
            referencedRelation: "roleplays"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blacklists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      blocklists: {
        Row: {
          created_at: string
          id: number
          origin_id: number
          reason: string | null
          target_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          origin_id: number
          reason?: string | null
          target_id: number
        }
        Update: {
          created_at?: string
          id?: number
          origin_id?: number
          reason?: string | null
          target_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "blocklists_origin_id_fkey"
            columns: ["origin_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blocklists_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      channels: {
        Row: {
          allowed_roles: Json | null
          id: number
          name: string
          private: boolean
          roleplay_id: string
        }
        Insert: {
          allowed_roles?: Json | null
          id?: number
          name: string
          private?: boolean
          roleplay_id: string
        }
        Update: {
          allowed_roles?: Json | null
          id?: number
          name?: string
          private?: boolean
          roleplay_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "channels_roleplay_id_fkey"
            columns: ["roleplay_id"]
            isOneToOne: false
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
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "channels_users_users_id_fkey"
            columns: ["users_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      characters: {
        Row: {
          created_at: string
          description: string
          id: number
          illustration: string
          name: string
          role_id: number
          status: number
          user_id: number
        }
        Insert: {
          created_at?: string
          description: string
          id?: number
          illustration: string
          name: string
          role_id: number
          status?: number
          user_id: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          illustration?: string
          name?: string
          role_id?: number
          status?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "characters_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "characters_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      messages: {
        Row: {
          channel_id: number
          created_at: string | null
          emojis: Json | null
          id: number
          image_url: string | null
          message: string
          read_by: Json | null
          user_id: number
        }
        Insert: {
          channel_id: number
          created_at?: string | null
          emojis?: Json | null
          id?: number
          image_url?: string | null
          message: string
          read_by?: Json | null
          user_id: number
        }
        Update: {
          channel_id?: number
          created_at?: string | null
          emojis?: Json | null
          id?: number
          image_url?: string | null
          message?: string
          read_by?: Json | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "messages_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      roleplays: {
        Row: {
          cofounders: number[] | null
          created_at: string
          description: string
          id: string
          illustration: string
          message_board: string
          public: boolean
          start_date: string | null
          title: string
          user_id: number
        }
        Insert: {
          cofounders?: number[] | null
          created_at?: string
          description: string
          id?: string
          illustration: string
          message_board?: string
          public?: boolean
          start_date?: string | null
          title: string
          user_id: number
        }
        Update: {
          cofounders?: number[] | null
          created_at?: string
          description?: string
          id?: string
          illustration?: string
          message_board?: string
          public?: boolean
          start_date?: string | null
          title?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "roleplays_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          description: string
          id: number
          max_users: number
          name: string
          roleplay_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string
          id?: number
          max_users?: number
          name: string
          roleplay_id: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: number
          max_users?: number
          name?: string
          roleplay_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "roles_roleplay_id_fkey"
            columns: ["roleplay_id"]
            isOneToOne: false
            referencedRelation: "roleplays"
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
          session_id: string | null
          superadmin: boolean
          username: string
        }
        Insert: {
          availability?: Json | null
          created_at?: string | null
          description?: string | null
          email: string
          id?: number
          session_id?: string | null
          superadmin?: boolean
          username: string
        }
        Update: {
          availability?: Json | null
          created_at?: string | null
          description?: string | null
          email?: string
          id?: number
          session_id?: string | null
          superadmin?: boolean
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_relationship: {
        Args: Record<PropertyKey, never>
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
