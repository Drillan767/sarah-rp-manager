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
                        foreignKeyName: 'blacklists_roleplay_id_fkey'
                        columns: ['roleplay_id']
                        isOneToOne: false
                        referencedRelation: 'roleplays'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'blacklists_user_id_fkey'
                        columns: ['user_id']
                        isOneToOne: false
                        referencedRelation: 'users'
                        referencedColumns: ['id']
                    },
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
                        foreignKeyName: 'blocklists_origin_id_fkey'
                        columns: ['origin_id']
                        isOneToOne: false
                        referencedRelation: 'users'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'blocklists_target_id_fkey'
                        columns: ['target_id']
                        isOneToOne: false
                        referencedRelation: 'users'
                        referencedColumns: ['id']
                    },
                ]
            }
            channels: {
                Row: {
                    allowed_roles: Json | null
                    id: number
                    internal: boolean
                    name: string
                    private: boolean
                    roleplay_id: string
                }
                Insert: {
                    allowed_roles?: Json | null
                    id?: number
                    internal?: boolean
                    name: string
                    private?: boolean
                    roleplay_id: string
                }
                Update: {
                    allowed_roles?: Json | null
                    id?: number
                    internal?: boolean
                    name?: string
                    private?: boolean
                    roleplay_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: 'channels_roleplay_id_fkey'
                        columns: ['roleplay_id']
                        isOneToOne: false
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
                }
                Insert: {
                    channel_id: number
                    created_at?: string | null
                    id?: number
                }
                Update: {
                    channel_id?: number
                    created_at?: string | null
                    id?: number
                }
                Relationships: [
                    {
                        foreignKeyName: 'channels_users_channel_id_fkey'
                        columns: ['channel_id']
                        isOneToOne: false
                        referencedRelation: 'channels'
                        referencedColumns: ['id']
                    },
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
                    user_id: string
                }
                Insert: {
                    created_at?: string
                    description: string
                    id?: number
                    illustration: string
                    name: string
                    role_id: number
                    status?: number
                    user_id: string
                }
                Update: {
                    created_at?: string
                    description?: string
                    id?: number
                    illustration?: string
                    name?: string
                    role_id?: number
                    status?: number
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: 'characters_role_id_fkey'
                        columns: ['role_id']
                        isOneToOne: false
                        referencedRelation: 'roles'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'characters_user_id_fkey'
                        columns: ['user_id']
                        isOneToOne: true
                        referencedRelation: 'users'
                        referencedColumns: ['session_id']
                    },
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
                }
                Insert: {
                    channel_id: number
                    created_at?: string | null
                    emojis?: Json | null
                    id?: number
                    image_url?: string | null
                    message: string
                    read_by?: Json | null
                }
                Update: {
                    channel_id?: number
                    created_at?: string | null
                    emojis?: Json | null
                    id?: number
                    image_url?: string | null
                    message?: string
                    read_by?: Json | null
                }
                Relationships: [
                    {
                        foreignKeyName: 'messages_channel_id_fkey'
                        columns: ['channel_id']
                        isOneToOne: false
                        referencedRelation: 'channels'
                        referencedColumns: ['id']
                    },
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
                    user_id: string
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
                    user_id: string
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
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: 'roleplays_user_id_fkey'
                        columns: ['user_id']
                        isOneToOne: true
                        referencedRelation: 'users'
                        referencedColumns: ['session_id']
                    },
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
                        foreignKeyName: 'roles_roleplay_id_fkey'
                        columns: ['roleplay_id']
                        isOneToOne: false
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
                    session_id: string
                    superadmin: boolean
                    username: string
                }
                Insert: {
                    availability?: Json | null
                    created_at?: string | null
                    description?: string | null
                    email: string
                    id?: number
                    session_id: string
                    superadmin?: boolean
                    username: string
                }
                Update: {
                    availability?: Json | null
                    created_at?: string | null
                    description?: string | null
                    email?: string
                    id?: number
                    session_id?: string
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

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
    PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
        ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
    Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
            Row: infer R
        }
            ? R
            : never
    : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
    PublicSchema['Views'])
        ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
                Row: infer R
            }
                ? R
                : never
        : never

export type TablesInsert<
    PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
        ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
        Insert: infer I
    }
        ? I
        : never
    : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
        ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
            Insert: infer I
        }
            ? I
            : never
        : never

export type TablesUpdate<
    PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
        ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
        Update: infer U
    }
        ? U
        : never
    : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
        ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
            Update: infer U
        }
            ? U
            : never
        : never

export type Enums<
    PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
        ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
        : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
    : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
        ? PublicSchema['Enums'][PublicEnumNameOrOptions]
        : never
