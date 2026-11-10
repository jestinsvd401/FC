revoke all on all tables in schema public from anon;
revoke truncate, references, trigger on all tables in schema public from authenticated;
revoke insert, update, delete on public.profiles, public.classes, public.enrollments, public.guardians from authenticated;
revoke update on public.posts from authenticated;
revoke all on all functions in schema app_private from anon;
revoke all on schema app_private from anon;
