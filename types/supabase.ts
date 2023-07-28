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
                    private: boolean
                    roleplay_id: string
                }
                Insert: {
                    id?: number
                    name: string
                    private?: boolean
                    roleplay_id: string
                }
                Update: {
                    id?: number
                    name?: string
                    private?: boolean
                    roleplay_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: 'channels_roleplay_id_fkey'
                        columns: ['roleplay_id']
                        referencedRelation: 'roleplays'
                        referencedColumns: ['id']
                    },
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
                        foreignKeyName: 'channels_users_channel_id_fkey'
                        columns: ['channel_id']
                        referencedRelation: 'channels'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'channels_users_users_id_fkey'
                        columns: ['users_id']
                        referencedRelation: 'users'
                        referencedColumns: ['id']
                    },
                ]
            }
            characters: {
                Row: {
                    avatar: string | null
                    created_at: string | null
                    description: string | null
                    id: number
                    name: string | null
                    role_id: number | null
                    user_id: number
                }
                Insert: {
                    avatar?: string | null
                    created_at?: string | null
                    description?: string | null
                    id?: number
                    name?: string | null
                    role_id?: number | null
                    user_id: number
                }
                Update: {
                    avatar?: string | null
                    created_at?: string | null
                    description?: string | null
                    id?: number
                    name?: string | null
                    role_id?: number | null
                    user_id?: number
                }
                Relationships: [
                    {
                        foreignKeyName: 'characters_role_id_fkey'
                        columns: ['role_id']
                        referencedRelation: 'roles'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'characters_user_id_fkey'
                        columns: ['user_id']
                        referencedRelation: 'users'
                        referencedColumns: ['id']
                    },
                ]
            }
            invitations: {
                Row: {
                    created_at: string | null
                    expires_at: string
                    id: string
                    role_id: number | null
                    roleplay_id: string | null
                }
                Insert: {
                    created_at?: string | null
                    expires_at?: string
                    id?: string
                    role_id?: number | null
                    roleplay_id?: string | null
                }
                Update: {
                    created_at?: string | null
                    expires_at?: string
                    id?: string
                    role_id?: number | null
                    roleplay_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: 'invitations_role_id_fkey'
                        columns: ['role_id']
                        referencedRelation: 'roles'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'invitations_roleplay_id_fkey'
                        columns: ['roleplay_id']
                        referencedRelation: 'roleplays'
                        referencedColumns: ['id']
                    },
                ]
            }
            messages: {
                Row: {
                    channel_id: number | null
                    created_at: string | null
                    emojis: Json | null
                    id: number
                    image_url: string | null
                    message: string
                    read_by: Json | null
                    user_id: number | null
                }
                Insert: {
                    channel_id?: number | null
                    created_at?: string | null
                    emojis?: Json | null
                    id?: number
                    image_url?: string | null
                    message: string
                    read_by?: Json | null
                    user_id?: number | null
                }
                Update: {
                    channel_id?: number | null
                    created_at?: string | null
                    emojis?: Json | null
                    id?: number
                    image_url?: string | null
                    message?: string
                    read_by?: Json | null
                    user_id?: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: 'messages_channel_id_fkey'
                        columns: ['channel_id']
                        referencedRelation: 'channels'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'messages_user_id_fkey'
                        columns: ['user_id']
                        referencedRelation: 'users'
                        referencedColumns: ['id']
                    },
                ]
            }
            roleplays: {
                Row: {
                    created_at: string | null
                    description: string
                    id: string
                    illustration: string
                    message_board: string | null
                    public: boolean | null
                    start_date: string | null
                    title: string
                }
                Insert: {
                    created_at?: string | null
                    description: string
                    id?: string
                    illustration: string
                    message_board?: string | null
                    public?: boolean | null
                    start_date?: string | null
                    title: string
                }
                Update: {
                    created_at?: string | null
                    description?: string
                    id?: string
                    illustration?: string
                    message_board?: string | null
                    public?: boolean | null
                    start_date?: string | null
                    title?: string
                }
                Relationships: []
            }
            roles: {
                Row: {
                    created_at: string | null
                    id: number
                    max_users: number
                    name: string
                    roleplay_id: string
                }
                Insert: {
                    created_at?: string | null
                    id?: number
                    max_users?: number
                    name: string
                    roleplay_id: string
                }
                Update: {
                    created_at?: string | null
                    id?: number
                    max_users?: number
                    name?: string
                    roleplay_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: 'roles_roleplay_id_fkey'
                        columns: ['roleplay_id']
                        referencedRelation: 'roleplays'
                        referencedColumns: ['id']
                    },
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
                    is_sarah: boolean
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
                    is_sarah?: boolean
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
                    is_sarah?: boolean
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
