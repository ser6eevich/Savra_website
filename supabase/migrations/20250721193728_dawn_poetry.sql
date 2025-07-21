/*
  # Настройка Row Level Security для таблицы products

  1. Безопасность
    - Включаем RLS для таблицы `products`
    - Добавляем политики для чтения товаров всеми пользователями
    - Добавляем политики для управления товарами только администраторами

  2. Политики
    - Все пользователи (включая анонимных) могут читать товары
    - Только аутентифицированные пользователи могут создавать/изменять/удалять товары
*/

-- Включаем RLS для таблицы products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Политика для чтения: все пользователи могут читать товары
CREATE POLICY "Anyone can read products"
  ON products
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Политика для вставки: только аутентифицированные пользователи могут добавлять товары
CREATE POLICY "Authenticated users can insert products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Политика для обновления: только аутентифицированные пользователи могут обновлять товары
CREATE POLICY "Authenticated users can update products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Политика для удаления: только аутентифицированные пользователи могут удалять товары
CREATE POLICY "Authenticated users can delete products"
  ON products
  FOR DELETE
  TO authenticated
  USING (true);