-- Classroom records, row level security, and private authorization helpers.

create schema if not exists app_private;

revoke all on schema app_private from public;
grant usage on schema app_private to authenticated;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  role text not null check (role in ('teacher', 'student', 'parent'))
);

create table public.classes (
  id uuid primary key default gen_random_uuid(),
  name_en text not null,
  name_zh text not null,
  name_hi text not null,
  teacher_id uuid not null references public.profiles (id)
);

create table public.enrollments (
  class_id uuid not null references public.classes (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  primary key (class_id, student_id)
);

create table public.guardians (
  parent_id uuid not null references public.profiles (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  primary key (parent_id, student_id)
);

create table public.attendance (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  day date not null,
  status text not null check (status in ('present', 'absent', 'late', 'excused')),
  unique (class_id, student_id, day)
);

create table public.scores (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  subject_en text not null default '',
  subject_zh text not null default '',
  subject_hi text not null default '',
  title_en text not null default '',
  title_zh text not null default '',
  title_hi text not null default '',
  score numeric(6, 2) not null check (score >= 0),
  max_score numeric(6, 2) not null check (max_score > 0 and score <= max_score),
  taken_on date not null
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes (id) on delete cascade,
  title_en text not null default '',
  title_zh text not null default '',
  title_hi text not null default '',
  body_en text not null default '',
  body_zh text not null default '',
  body_hi text not null default '',
  event_date date not null,
  created_by uuid not null references public.profiles (id)
);

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  name_en text not null default '',
  name_zh text not null default '',
  name_hi text not null default '',
  category_en text not null default '',
  category_zh text not null default '',
  category_hi text not null default '',
  schedule_en text not null default '',
  schedule_zh text not null default '',
  schedule_hi text not null default '',
  description_en text not null default '',
  description_zh text not null default '',
  description_hi text not null default ''
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes (id) on delete cascade,
  author_id uuid not null references public.profiles (id),
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index classes_teacher_id_idx on public.classes (teacher_id);
create index enrollments_student_id_idx on public.enrollments (student_id);
create index guardians_student_id_idx on public.guardians (student_id);
create index attendance_class_day_idx on public.attendance (class_id, day);
create index attendance_student_id_idx on public.attendance (student_id);
create index scores_class_id_idx on public.scores (class_id);
create index scores_student_id_idx on public.scores (student_id);
create index events_class_date_idx on public.events (class_id, event_date);
create index events_created_by_idx on public.events (created_by);
create index activities_class_id_idx on public.activities (class_id);
create index activities_student_id_idx on public.activities (student_id);
create index posts_class_created_idx on public.posts (class_id, created_at);
create index posts_author_id_idx on public.posts (author_id);

create or replace function app_private.teaches(target_class uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.classes
    where id = target_class
      and teacher_id = (select auth.uid())
  );
$$;

create or replace function app_private.enrolled(target_class uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.enrollments
    where class_id = target_class
      and student_id = (select auth.uid())
  );
$$;

create or replace function app_private.guards(target_student uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.guardians
    where parent_id = (select auth.uid())
      and student_id = target_student
  );
$$;

create or replace function app_private.parent_of_class(target_class uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.guardians g
    join public.enrollments e on e.student_id = g.student_id
    where g.parent_id = (select auth.uid())
      and e.class_id = target_class
  );
$$;

create or replace function app_private.student_in_class(target_class uuid, target_student uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.enrollments
    where class_id = target_class
      and student_id = target_student
  );
$$;

create or replace function app_private.classmate(target_profile uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.enrollments mine
    join public.enrollments theirs on theirs.class_id = mine.class_id
    where mine.student_id = (select auth.uid())
      and theirs.student_id = target_profile
  );
$$;

create or replace function app_private.teaches_student(target_profile uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.classes c
    join public.enrollments e on e.class_id = c.id
    where c.teacher_id = (select auth.uid())
      and e.student_id = target_profile
  );
$$;

create or replace function app_private.taught_by(target_profile uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.classes c
    join public.enrollments e on e.class_id = c.id
    where c.teacher_id = target_profile
      and e.student_id = (select auth.uid())
  );
$$;

revoke all on all functions in schema app_private from public;
grant execute on all functions in schema app_private to authenticated;

alter table public.profiles enable row level security;
alter table public.classes enable row level security;
alter table public.enrollments enable row level security;
alter table public.guardians enable row level security;
alter table public.attendance enable row level security;
alter table public.scores enable row level security;
alter table public.events enable row level security;
alter table public.activities enable row level security;
alter table public.posts enable row level security;

alter table public.profiles force row level security;
alter table public.classes force row level security;
alter table public.enrollments force row level security;
alter table public.guardians force row level security;
alter table public.attendance force row level security;
alter table public.scores force row level security;
alter table public.events force row level security;
alter table public.activities force row level security;
alter table public.posts force row level security;

grant select on public.profiles, public.classes, public.enrollments, public.guardians to authenticated;
grant select, insert, update, delete on public.attendance, public.scores, public.events, public.activities to authenticated;
grant select, insert, delete on public.posts to authenticated;

create policy profiles_select on public.profiles
for select to authenticated
using (
  id = (select auth.uid())
  or app_private.teaches_student(id)
  or app_private.taught_by(id)
  or app_private.classmate(id)
  or app_private.guards(id)
);

create policy classes_select on public.classes
for select to authenticated
using (
  teacher_id = (select auth.uid())
  or app_private.enrolled(id)
  or app_private.parent_of_class(id)
);

create policy enrollments_select on public.enrollments
for select to authenticated
using (
  app_private.teaches(class_id)
  or student_id = (select auth.uid())
  or app_private.guards(student_id)
  or app_private.enrolled(class_id)
);

create policy guardians_select on public.guardians
for select to authenticated
using (
  parent_id = (select auth.uid())
  or student_id = (select auth.uid())
  or app_private.teaches_student(student_id)
);

create policy attendance_select on public.attendance
for select to authenticated
using (
  app_private.teaches(class_id)
  or student_id = (select auth.uid())
  or app_private.guards(student_id)
);

create policy attendance_write on public.attendance
for all to authenticated
using (app_private.teaches(class_id))
with check (
  app_private.teaches(class_id)
  and app_private.student_in_class(class_id, student_id)
);

create policy scores_select on public.scores
for select to authenticated
using (
  app_private.teaches(class_id)
  or student_id = (select auth.uid())
  or app_private.guards(student_id)
);

create policy scores_write on public.scores
for all to authenticated
using (app_private.teaches(class_id))
with check (
  app_private.teaches(class_id)
  and app_private.student_in_class(class_id, student_id)
);

create policy activities_select on public.activities
for select to authenticated
using (
  app_private.teaches(class_id)
  or student_id = (select auth.uid())
  or app_private.guards(student_id)
);

create policy activities_write on public.activities
for all to authenticated
using (app_private.teaches(class_id))
with check (
  app_private.teaches(class_id)
  and app_private.student_in_class(class_id, student_id)
);

create policy events_select on public.events
for select to authenticated
using (
  app_private.teaches(class_id)
  or app_private.enrolled(class_id)
  or app_private.parent_of_class(class_id)
);

create policy events_write on public.events
for all to authenticated
using (app_private.teaches(class_id))
with check (
  app_private.teaches(class_id)
  and created_by = (select auth.uid())
);

create policy posts_select on public.posts
for select to authenticated
using (
  app_private.teaches(class_id)
  or app_private.enrolled(class_id)
);

create policy posts_insert on public.posts
for insert to authenticated
with check (
  author_id = (select auth.uid())
  and (app_private.teaches(class_id) or app_private.enrolled(class_id))
);

create policy posts_delete on public.posts
for delete to authenticated
using (
  author_id = (select auth.uid())
  or app_private.teaches(class_id)
);
