create table
  public.roleplays (
    id uuid not null,
    created_at timestamp with time zone null default now(),
    title text not null,
    description text not null,
    message_board character varying null,
    start_date timestamp with time zone null,
    constraint roleplays_pkey primary key (id)
  ) tablespace pg_default;