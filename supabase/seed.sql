-- Sample Harbor Room class. Safe to re-run: it removes the seeded accounts first.

do $$
#variable_conflict use_variable
declare
  teacher uuid := '11111111-1111-4111-8111-111111111111';
  class_id uuid := '22222222-2222-4222-8222-222222222222';
  aisha uuid := '33333333-3333-4333-8333-333333333301';
  leo uuid := '33333333-3333-4333-8333-333333333302';
  mei uuid := '33333333-3333-4333-8333-333333333303';
  omar uuid := '33333333-3333-4333-8333-333333333304';
  sofia uuid := '33333333-3333-4333-8333-333333333305';
  noah uuid := '33333333-3333-4333-8333-333333333306';
  priya uuid := '44444444-4444-4444-8444-444444444401';
  wei uuid := '44444444-4444-4444-8444-444444444402';
  hana uuid := '44444444-4444-4444-8444-444444444403';
  person record;
begin
  delete from public.classes where id = class_id;
  delete from auth.users
  where id in (teacher, aisha, leo, mei, omar, sofia, noah, priya, wei, hana);

  for person in
    select *
    from (values
      (teacher, 'teacher@classroom.school', 'Harbor-Teacher-1'),
      (aisha, 'aisha@classroom.school', 'Harbor-Student-1'),
      (leo, 'leo@classroom.school', 'Harbor-Student-1'),
      (mei, 'mei@classroom.school', 'Harbor-Student-1'),
      (omar, 'omar@classroom.school', 'Harbor-Student-1'),
      (sofia, 'sofia@classroom.school', 'Harbor-Student-1'),
      (noah, 'noah@classroom.school', 'Harbor-Student-1'),
      (priya, 'priya@classroom.school', 'Harbor-Parent-1'),
      (wei, 'wei@classroom.school', 'Harbor-Parent-1'),
      (hana, 'hana@classroom.school', 'Harbor-Parent-1')
    ) as people(id, email, password)
  loop
    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) values (
      '00000000-0000-0000-0000-000000000000',
      person.id,
      'authenticated',
      'authenticated',
      person.email,
      extensions.crypt(person.password, extensions.gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{}'::jsonb,
      now(),
      now(),
      '',
      '',
      '',
      ''
    );

    insert into auth.identities (
      user_id, provider_id, identity_data, provider, created_at, updated_at
    ) values (
      person.id,
      person.id::text,
      jsonb_build_object('sub', person.id::text, 'email', person.email, 'email_verified', true),
      'email',
      now(),
      now()
    );
  end loop;

  insert into public.profiles (id, name, role) values
    (teacher, 'Elena Vasquez', 'teacher'),
    (aisha, 'Aisha Rahman', 'student'),
    (leo, 'Leo Chen', 'student'),
    (mei, 'Mei Lin', 'student'),
    (omar, 'Omar Haddad', 'student'),
    (sofia, 'Sofia Alvarez', 'student'),
    (noah, 'Noah Park', 'student'),
    (priya, 'Priya Rahman', 'parent'),
    (wei, 'Wei Lin', 'parent'),
    (hana, 'Hana Haddad', 'parent');

  insert into public.classes (id, name_en, name_zh, name_hi, teacher_id) values
    (class_id, 'Harbor Room', '港灣班', 'हार्बर कक्षा', teacher);

  insert into public.enrollments (class_id, student_id) values
    (class_id, aisha),
    (class_id, leo),
    (class_id, mei),
    (class_id, omar),
    (class_id, sofia),
    (class_id, noah);

  insert into public.guardians (parent_id, student_id) values
    (priya, aisha),
    (priya, leo),
    (wei, mei),
    (hana, omar);

  insert into public.attendance (class_id, student_id, day, status)
  select
    class_id,
    e.student_id,
    d::date,
    (array['present','present','present','present','late','absent','excused'])[
      1 + ((extract(doy from d)::int + abs(hashtext(e.student_id::text))) % 7)
    ]
  from public.enrollments e
  cross join generate_series('2026-11-02'::date, '2026-11-10'::date, '1 day') as d
  where extract(isodow from d) < 6;

  insert into public.scores (
    class_id, student_id,
    subject_en, subject_zh, subject_hi,
    title_en, title_zh, title_hi,
    score, max_score, taken_on
  ) values
    (class_id, aisha, 'Mathematics', '數學', 'गणित', 'Fractions quiz', '分數小考', 'भिन्न प्रश्नोत्तरी', 18, 20, '2026-11-04'),
    (class_id, aisha, 'Reading', '閱讀', 'पठन', 'Harbor story', '港灣故事', 'हार्बर कहानी', 16, 20, '2026-11-06'),
    (class_id, leo, 'Mathematics', '數學', 'गणित', 'Fractions quiz', '分數小考', 'भिन्न प्रश्नोत्तरी', 14, 20, '2026-11-04'),
    (class_id, leo, 'Science', '自然', 'विज्ञान', 'Plant journal', '植物日記', 'पौधा पत्रिका', 17, 20, '2026-11-09'),
    (class_id, mei, 'Mathematics', '數學', 'गणित', 'Fractions quiz', '分數小考', 'भिन्न प्रश्नोत्तरी', 19, 20, '2026-11-04'),
    (class_id, mei, 'Reading', '閱讀', 'पठन', 'Harbor story', '港灣故事', 'हार्बर कहानी', 18, 20, '2026-11-06'),
    (class_id, omar, 'Science', '自然', 'विज्ञान', 'Plant journal', '植物日記', 'पौधा पत्रिका', 15, 20, '2026-11-09'),
    (class_id, omar, 'Mathematics', '數學', 'गणित', 'Fractions quiz', '分數小考', 'भिन्न प्रश्नोत्तरी', 12, 20, '2026-11-04'),
    (class_id, sofia, 'Reading', '閱讀', 'पठन', 'Harbor story', '港灣故事', 'हार्बर कहानी', 20, 20, '2026-11-06'),
    (class_id, sofia, 'Science', '自然', 'विज्ञान', 'Plant journal', '植物日記', 'पौधा पत्रिका', 16, 20, '2026-11-09'),
    (class_id, noah, 'Mathematics', '數學', 'गणित', 'Fractions quiz', '分數小考', 'भिन्न प्रश्नोत्तरी', 15, 20, '2026-11-04'),
    (class_id, noah, 'Reading', '閱讀', 'पठन', 'Harbor story', '港灣故事', 'हार्बर कहानी', 13, 20, '2026-11-06');

  insert into public.events (
    class_id, title_en, title_zh, title_hi, body_en, body_zh, body_hi, event_date, created_by
  ) values
    (
      class_id,
      'Reading morning',
      '晨讀會',
      'पठन प्रातः',
      'Students bring a favorite page and read one paragraph aloud.',
      '學生帶一頁喜歡的內容，朗讀一個段落。',
      'विद्यार्थी अपना पसंदीदा पृष्ठ लाएँ और एक अनुच्छेद पढ़ें।',
      '2026-11-06',
      teacher
    ),
    (
      class_id,
      'Science museum visit',
      '科學館參觀',
      'विज्ञान संग्रहालय यात्रा',
      'Leave at 9:00. Packed lunch and a name tag.',
      '早上九點出發。請自備午餐和名牌。',
      'सुबह 9 बजे प्रस्थान। अपना भोजन और नाम पत्रिका लाएँ।',
      '2026-11-18',
      teacher
    ),
    (
      class_id,
      'Parent evening',
      '家長晚會',
      'अभिभावक संध्या',
      'Meet the teacher and look through this month''s work.',
      '與老師見面，並一起看本月的作品。',
      'शिक्षक से मिलें और इस महीने का काम देखें।',
      '2026-11-25',
      teacher
    );

  insert into public.activities (
    class_id, student_id,
    name_en, name_zh, name_hi,
    category_en, category_zh, category_hi,
    schedule_en, schedule_zh, schedule_hi,
    description_en, description_zh, description_hi
  ) values
    (class_id, aisha, 'Harbor choir', '港灣合唱團', 'हार्बर गायन मंडली', 'Music', '音樂', 'संगीत', 'Wednesdays, 15:30', '每週三 15:30', 'बुधवार, 15:30', 'Two-part songs for the winter concert.', '為冬季音樂會準備二部合唱。', 'शीतकालीन संगीत समारोह के लिए दो स्वर।'),
    (class_id, leo, 'Football club', '足球社', 'फुटबॉल क्लब', 'Sport', '運動', 'खेल', 'Tuesdays, 16:00', '每週二 16:00', 'मंगलवार, 16:00', 'Passing drills and a short match.', '傳球練習和一場短賽。', 'पासिंग अभ्यास और एक छोटा मैच।'),
    (class_id, mei, 'Art club', '美術社', 'कला क्लब', 'Arts', '藝術', 'कला', 'Thursdays, 15:30', '每週四 15:30', 'गुरुवार, 15:30', 'Watercolor studies of the harbor.', '港灣水彩寫生。', 'बंदरगाह के जलरंग अध्ययन।'),
    (class_id, omar, 'Robotics', '機器人社', 'रोबोटिक्स', 'Science', '科學', 'विज्ञान', 'Fridays, 15:45', '每週五 15:45', 'शुक्रवार, 15:45', 'Building a line-following rover.', '組裝循跡小車。', 'लाइन फॉलो करने वाला रोवर बनाना।'),
    (class_id, sofia, 'Debate', '辯論社', 'वाद-विवाद', 'Language', '語文', 'भाषा', 'Mondays, 15:30', '每週一 15:30', 'सोमवार, 15:30', 'Preparing the library-hours motion.', '準備圖書館開放時間的辯題。', 'पुस्तकालय समय प्रस्ताव की तैयारी।'),
    (class_id, noah, 'Swim team', '游泳隊', 'तैराकी दल', 'Sport', '運動', 'खेल', 'Mondays, 16:15', '每週一 16:15', 'सोमवार, 16:15', 'Endurance laps and one stroke clinic.', '耐力圈數和一次泳姿指導。', 'सहनशक्ति लैप और एक स्ट्रोक अभ्यास।');

  insert into public.posts (class_id, author_id, body, created_at) values
    (class_id, teacher, 'Welcome to the November board. Please post questions about the museum visit here.', '2026-11-03 08:15:00+00'),
    (class_id, mei, 'Can we bring a sketchbook on the museum visit?', '2026-11-03 12:40:00+00'),
    (class_id, teacher, '可以，素描本請放在背包側袋。', '2026-11-03 13:05:00+00');
end $$;
