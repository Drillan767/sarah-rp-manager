create table
  public.users (
    id bigint generated by default as identity not null,
    created_at timestamp with time zone null default now(),
    username text not null,
    description text null,
    image_url text null,
    session_id uuid null,
    availability jsonb null,
    email text not null,
    is_sarah boolean null,
    constraint users_pkey primary key (id),
    constraint users_email_key unique (email),
    constraint users_username_key unique (username),
    constraint users_username_check check ((length(username) < 255))
  ) tablespace pg_default;