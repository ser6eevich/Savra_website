/*
  # Настройка Row Level Security для таблицы orders

  1. Безопасность
    - Включаем RLS для таблицы `orders`
    - Добавляем политики для работы с заказами

  2. Политики
    - Пользователи могут создавать заказы для себя
    - Пользователи могут читать только свои заказы
    - Пользователи могут обновлять только свои заказы
*/

-- Включаем RLS для таблицы orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Политика для вставки: пользователи могут создавать заказы для себя
CREATE POLICY "Users can create their own orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Политика для чтения: пользователи могут читать только свои заказы
CREATE POLICY "Users can read own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Политика для обновления: пользователи могут обновлять только свои заказы
CREATE POLICY "Users can update own orders"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Политика для удаления: пользователи могут удалять только свои заказы
CREATE POLICY "Users can delete own orders"
  ON orders
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);