/*
  # Настройка Row Level Security для таблицы media

  1. Безопасность
    - Включаем RLS для таблицы `media`
    - Добавляем политики для работы с медиафайлами

  2. Политики
    - Все пользователи могут читать медиафайлы
    - Только аутентифицированные пользователи могут управлять медиафайлами
*/

-- Включаем RLS для таблицы media
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Политика для чтения: все пользователи могут читать медиафайлы
CREATE POLICY "Anyone can read media"
  ON media
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Политика для вставки: только аутентифицированные пользователи могут добавлять медиафайлы
CREATE POLICY "Authenticated users can insert media"
  ON media
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Политика для обновления: только аутентифицированные пользователи могут обновлять медиафайлы
CREATE POLICY "Authenticated users can update media"
  ON media
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Политика для удаления: только аутентифицированные пользователи могут удалять медиафайлы
CREATE POLICY "Authenticated users can delete media"
  ON media
  FOR DELETE
  TO authenticated
  USING (true);