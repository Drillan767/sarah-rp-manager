create table
  public.channels_users (
    id bigint generated by default as identity not null,
    created_at timestamp with time zone null default now(),
    channel_id bigint not null,
    users_id bigint not null,
    constraint channels_users_pkey primary key (id),
    constraint channels_users_channel_id_fkey foreign key (channel_id) references channels (id) on delete cascade,
    constraint channels_users_users_id_fkey foreign key (users_id) references users (id)
  ) tablespace pg_default;