begin;
select plan(3);
select has_table('public', 'link_events');
select has_function('public', 'track_open');
select has_function('public', 'get_usage_summary');
select * from finish();
rollback;
