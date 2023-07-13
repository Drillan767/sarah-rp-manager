create table
  public.channels (
    id bigint generated by default as identity not null,
    name text not null,
    roleplay_id uuid not null,
    private boolean null default false,
    constraint channels_pkey primary key (id),
    constraint channels_name_key unique (name),
    constraint channels_roleplay_id_fkey foreign key (roleplay_id) references roleplays (id) on delete cascade
  ) tablespace pg_default;