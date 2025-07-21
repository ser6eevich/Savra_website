/*
  # Настройка Row Level Security для таблицы users

  1. Безопасность
    - Включаем RLS для таблицы `users`
    - Добавляем политику для вставки новых пользователей
    - Добавляем политику для чтения собственных данных
    - Добавляем политику для обновления собственных данных

  2. Политики
    - Пользователи могут создавать записи только для своего auth.uid()
    - Пользователи могут читать только свои данные
    - Пользователи могут обновлять только свои данные
*/

-- Включаем RLS для таблицы users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Политика для вставки: пользователи могут создавать записи только для своего ID
CREATE POLICY "Users can insert their own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Политика для чтения: пользователи могут читать только свои данные
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Политика для обновления: пользователи могут обновлять только свои данные
CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Политика для удаления: пользователи могут удалять только свои данные
CREATE POLICY "Users can delete own data"
  ON users
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);