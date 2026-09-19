-- ==============================================================================
-- UPDATE HEIGHT DATA (MCU TERAKHIR DILARANG INFLATED)
-- ==============================================================================
-- Run this in Supabase SQL Editor if your members already exist in the database.
-- It matches members by name (case-insensitive) and updates height_cm.

UPDATE public.members SET height_cm = 167   WHERE name ILIKE 'Havergal';
UPDATE public.members SET height_cm = 180   WHERE name ILIKE 'Rangga';
UPDATE public.members SET height_cm = 168   WHERE name ILIKE 'Raven';
UPDATE public.members SET height_cm = 173   WHERE name ILIKE 'Rakha';
UPDATE public.members SET height_cm = 167   WHERE name ILIKE 'Hasan';
UPDATE public.members SET height_cm = 173   WHERE name ILIKE 'Owen';
UPDATE public.members SET height_cm = 170   WHERE name ILIKE 'Mario';
UPDATE public.members SET height_cm = 172   WHERE name ILIKE 'Hafis';
UPDATE public.members SET height_cm = 173   WHERE name ILIKE 'Andy';
UPDATE public.members SET height_cm = 170   WHERE name ILIKE 'Bowo';
UPDATE public.members SET height_cm = 170   WHERE name ILIKE '%Fahmi Jahat%';
UPDATE public.members SET height_cm = 173   WHERE name ILIKE 'Abim';
UPDATE public.members SET height_cm = 169   WHERE name ILIKE 'Rifki';
UPDATE public.members SET height_cm = 178   WHERE name ILIKE 'Rayga';
UPDATE public.members SET height_cm = 175   WHERE name ILIKE 'Mirza';
UPDATE public.members SET height_cm = 160   WHERE name ILIKE '%Rizal FK%';
UPDATE public.members SET height_cm = 161   WHERE name ILIKE 'Axel';
UPDATE public.members SET height_cm = 171.5 WHERE name ILIKE 'Aris';
UPDATE public.members SET height_cm = 171.2 WHERE name ILIKE 'Ikroom';
UPDATE public.members SET height_cm = 161   WHERE name ILIKE 'Daffa';
UPDATE public.members SET height_cm = 173   WHERE name ILIKE 'Rifat';
UPDATE public.members SET height_cm = 174   WHERE name ILIKE 'Danil';
UPDATE public.members SET height_cm = 167   WHERE name ILIKE 'Haydar';
UPDATE public.members SET height_cm = 165   WHERE name ILIKE 'Kristian';
UPDATE public.members SET height_cm = 167   WHERE name ILIKE '%Rizal Dwiki%';
UPDATE public.members SET height_cm = 169   WHERE name ILIKE '%Fahmi Ammar%';
UPDATE public.members SET height_cm = 172   WHERE name ILIKE '%Rafa Nazeera%';
UPDATE public.members SET height_cm = 170   WHERE name ILIKE '%Raya Aldrin%';
UPDATE public.members SET height_cm = 174   WHERE name ILIKE '%Christian Jonathan%';
UPDATE public.members SET height_cm = 174   WHERE name ILIKE '%Muhammad Alfimansyah%';

-- Or if inserting all 30 members afresh:
INSERT INTO public.members (id, name, avatar, color, height_cm, starting_weight_kg, target_weight_kg, join_date, notes)
VALUES
  ('mem-01', 'Havergal', 'H', '#F59E0B', 167, 0, 0, '2026-09-19', 'MCU terakhir'),
  ('mem-02', 'Rangga', 'R', '#10B981', 180, 0, 0, '2026-09-19', 'MCU terakhir'),
  ('mem-03', 'Raven', 'R', '#06B6D4', 168, 0, 0, '2026-09-19', 'MCU terakhir'),
  ('mem-04', 'Rakha', 'R', '#8B5CF6', 173, 0, 0, '2026-09-19', 'MCU terakhir'),
  ('mem-05', 'Hasan', 'H', '#EC4899', 167, 0, 0, '2026-09-19', 'MCU terakhir'),
  ('mem-06', 'Owen', 'O', '#3B82F6', 173, 0, 0, '2026-09-19', 'MCU terakhir'),
  ('mem-07', 'Mario', 'M', '#F97316', 170, 0, 0, '2026-09-19', 'MCU terakhir'),
  ('mem-08', 'Hafis', 'H', '#14B8A6', 172, 0, 0, '2026-09-19', 'MCU terakhir'),
  ('mem-09', 'Andy', 'A', '#F59E0B', 173, 0, 0, '2026-09-19', 'MCU terakhir'),
  ('mem-10', 'Bowo', 'B', '#10B981', 170, 0, 0, '2026-09-19', 'MCU terakhir'),
  ('mem-11', 'Fahmi Jahat', 'FJ', '#06B6D4', 170, 0, 0, '2026-09-19', 'MCU terakhir'),
  ('mem-12', 'Abim', 'A', '#8B5CF6', 173, 0, 0, '2026-09-19', 'MCU terakhir'),
  ('mem-13', 'Rifki', 'R', '#EC4899', 169, 0, 0, '2026-09-19', 'MCU terakhir'),
  ('mem-14', 'Rayga', 'R', '#3B82F6', 178, 0, 0, '2026-09-19', 'MCU terakhir'),
  ('mem-15', 'Mirza', 'M', '#F97316', 175, 0, 0, '2026-09-19', 'MCU terakhir'),
  ('mem-16', 'Rizal FK', 'RF', '#14B8A6', 160, 0, 0, '2026-09-19', 'MCU terakhir'),
  ('mem-17', 'Axel', 'A', '#F59E0B', 161, 0, 0, '2026-09-19', 'MCU terakhir'),
  ('mem-18', 'Aris', 'A', '#10B981', 171.5, 0, 0, '2026-09-19', 'MCU terakhir'),
  ('mem-19', 'Ikroom', 'I', '#06B6D4', 171.2, 0, 0, '2026-09-19', 'MCU terakhir'),
  ('mem-20', 'Daffa', 'D', '#8B5CF6', 161, 0, 0, '2026-09-19', 'MCU terakhir'),
  ('mem-21', 'Rifat', 'R', '#EC4899', 173, 0, 0, '2026-09-19', 'MCU terakhir'),
  ('mem-22', 'Danil', 'D', '#3B82F6', 174, 0, 0, '2026-09-19', 'MCU terakhir'),
  ('mem-23', 'Haydar', 'H', '#F97316', 167, 0, 0, '2026-09-19', 'MCU terakhir'),
  ('mem-24', 'Kristian', 'K', '#14B8A6', 165, 0, 0, '2026-09-19', 'MCU terakhir'),
  ('mem-25', 'Rizal Dwiki', 'RD', '#F59E0B', 167, 0, 0, '2026-09-19', 'MCU terakhir'),
  ('mem-26', 'Fahmi Ammar', 'FA', '#10B981', 169, 0, 0, '2026-09-19', 'MCU terakhir'),
  ('mem-27', 'Rafa Nazeera Fide', 'RN', '#06B6D4', 172, 0, 0, '2026-09-19', 'MCU terakhir'),
  ('mem-28', 'Raya Aldrin', 'RA', '#8B5CF6', 170, 0, 0, '2026-09-19', 'MCU terakhir'),
  ('mem-29', 'Christian Jonathan', 'CJ', '#EC4899', 174, 0, 0, '2026-09-19', 'MCU terakhir'),
  ('mem-30', 'Muhammad Alfimansyah', 'MA', '#3B82F6', 174, 0, 0, '2026-09-19', 'MCU terakhir')
ON CONFLICT (id) DO UPDATE 
SET height_cm = EXCLUDED.height_cm;
