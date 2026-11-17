create table public.shopit_users (
  id text primary key,
  name text not null,
  email text not null,
  password_hash text not null,
  salt text not null,
  role text not null check (role in ('buyer', 'seller', 'admin')),
  shop_name text,
  seller_status text check (seller_status in ('pending', 'approved', 'rejected')),
  suspended boolean not null default false,
  address jsonb,
  created_at timestamptz not null
);

create unique index shopit_users_email_idx on public.shopit_users (email);

create table public.shopit_products (
  id text primary key,
  seller_id text not null references public.shopit_users (id),
  name text not null,
  category text not null,
  description text not null,
  price numeric(12, 2) not null,
  quantity integer not null check (quantity >= 0),
  image text not null,
  listing_status text not null check (listing_status in ('active', 'hidden', 'removed')),
  created_at timestamptz not null,
  updated_at timestamptz not null
);

create index shopit_products_seller_idx on public.shopit_products (seller_id);
create index shopit_products_listing_idx on public.shopit_products (listing_status);

create table public.shopit_cart_items (
  user_id text not null references public.shopit_users (id) on delete cascade,
  product_id text not null references public.shopit_products (id) on delete cascade,
  quantity integer not null check (quantity > 0),
  primary key (user_id, product_id)
);

create index shopit_cart_items_product_idx on public.shopit_cart_items (product_id);

create table public.shopit_orders (
  id text primary key,
  buyer jsonb not null,
  seller jsonb not null,
  total numeric(12, 2) not null,
  status text not null,
  payment_status text not null,
  prepared boolean not null default false,
  shipment_note text not null default '',
  address jsonb not null,
  created_at timestamptz not null,
  updated_at timestamptz not null
);

create index shopit_orders_status_idx on public.shopit_orders (status);
create index shopit_orders_created_idx on public.shopit_orders (created_at);
create index shopit_orders_buyer_idx on public.shopit_orders ((buyer ->> 'id'));
create index shopit_orders_seller_idx on public.shopit_orders ((seller ->> 'id'));

create table public.shopit_order_items (
  order_id text not null references public.shopit_orders (id) on delete cascade,
  position integer not null,
  product_id text not null,
  name text not null,
  category text not null,
  image text not null,
  price numeric(12, 2) not null,
  quantity integer not null,
  primary key (order_id, position)
);

create table public.shopit_timeline (
  order_id text not null references public.shopit_orders (id) on delete cascade,
  position integer not null,
  status text not null,
  at timestamptz not null,
  actor_id text not null,
  actor_name text not null,
  note text not null,
  primary key (order_id, position)
);

create table public.shopit_activities (
  id text primary key,
  at timestamptz not null,
  type text not null,
  message text not null,
  actor_name text not null,
  order_id text
);

create index shopit_activities_at_idx on public.shopit_activities (at desc);

create table public.shopit_sessions (
  token text primary key,
  user_id text not null references public.shopit_users (id) on delete cascade,
  created_at timestamptz not null
);

create index shopit_sessions_user_idx on public.shopit_sessions (user_id);

-- The Express server is the only client. The Data API roles cannot read password hashes.
revoke all on table
  public.shopit_users,
  public.shopit_products,
  public.shopit_cart_items,
  public.shopit_orders,
  public.shopit_order_items,
  public.shopit_timeline,
  public.shopit_activities,
  public.shopit_sessions
from public, anon, authenticated;

alter table public.shopit_users enable row level security;
alter table public.shopit_products enable row level security;
alter table public.shopit_cart_items enable row level security;
alter table public.shopit_orders enable row level security;
alter table public.shopit_order_items enable row level security;
alter table public.shopit_timeline enable row level security;
alter table public.shopit_activities enable row level security;
alter table public.shopit_sessions enable row level security;

alter table public.shopit_users force row level security;
alter table public.shopit_products force row level security;
alter table public.shopit_cart_items force row level security;
alter table public.shopit_orders force row level security;
alter table public.shopit_order_items force row level security;
alter table public.shopit_timeline force row level security;
alter table public.shopit_activities force row level security;
alter table public.shopit_sessions force row level security;

-- shopit_app is a login role created on the database, with its password kept out of git.
grant usage on schema public to shopit_app;
grant select, insert, update, delete on
  public.shopit_users,
  public.shopit_products,
  public.shopit_cart_items,
  public.shopit_orders,
  public.shopit_order_items,
  public.shopit_timeline,
  public.shopit_activities,
  public.shopit_sessions
to shopit_app;

create policy shopit_app_all on public.shopit_users for all to shopit_app using (true) with check (true);
create policy shopit_app_all on public.shopit_products for all to shopit_app using (true) with check (true);
create policy shopit_app_all on public.shopit_cart_items for all to shopit_app using (true) with check (true);
create policy shopit_app_all on public.shopit_orders for all to shopit_app using (true) with check (true);
create policy shopit_app_all on public.shopit_order_items for all to shopit_app using (true) with check (true);
create policy shopit_app_all on public.shopit_timeline for all to shopit_app using (true) with check (true);
create policy shopit_app_all on public.shopit_activities for all to shopit_app using (true) with check (true);
create policy shopit_app_all on public.shopit_sessions for all to shopit_app using (true) with check (true);
