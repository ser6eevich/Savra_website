/*
  # Создание таблиц пользователей и товаров

  1. Новые таблицы
    - `profiles` - профили пользователей (дополнительная информация к auth.users)
      - `id` (uuid, связь с auth.users)
      - `first_name` (text)
      - `last_name` (text)
      - `phone` (text)
      - `date_of_birth` (date)
      - `avatar_url` (text)
      - `is_admin` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `products` - товары
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `detailed_description` (text)
      - `price` (integer)
      - `category` (text)
      - `collection` (text)
      - `article` (text)
      - `material` (text)
      - `type` (text)
      - `sizes` (text array)
      - `images` (text array)
      - `video_url` (text)
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Безопасность
    - Включить RLS для всех таблиц
    - Политики для чтения/записи данных
*/

-- Создание таблицы профилей пользователей
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text,
  last_name text,
  phone text,
  date_of_birth date,
  avatar_url text,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Создание таблицы товаров
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  detailed_description text DEFAULT '',
  price integer NOT NULL,
  category text NOT NULL DEFAULT 'rings',
  collection text DEFAULT '',
  article text DEFAULT '',
  material text DEFAULT 'Серебро 925°',
  type text DEFAULT 'classic',
  sizes text[] DEFAULT ARRAY['15', '16', '17', '18', '19', '20', '21'],
  images text[] DEFAULT ARRAY[]::text[],
  video_url text DEFAULT '',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Включение RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Политики для профилей
CREATE POLICY "Пользователи могут читать свой профиль"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Пользователи могут обновлять свой профиль"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Создание профиля при регистрации"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Политики для товаров
CREATE POLICY "Все могут читать активные товары"
  ON products
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Админы могут управлять товарами"
  ON products
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Функция для автоматического создания профиля при регистрации
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, first_name, last_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Триггер для создания профиля
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Функция для обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггеры для обновления updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Вставка демо-товаров
INSERT INTO products (name, description, detailed_description, price, type, images) VALUES
(
  'Кольцо Классик',
  'Элегантное серебро с полированной поверхностью',
  'Классическое серебряное кольцо с идеально отполированной поверхностью. Создано вручную из серебра 925 пробы с особым вниманием к деталям и комфорту носки.',
  8500,
  'classic',
  ARRAY['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80']
),
(
  'Кольцо Минимал',
  'Тонкое серебряное кольцо простой формы',
  'Минималистичное кольцо в стиле ваби-саби. Простые линии и естественная текстура создают уникальный образ для повседневной носки.',
  6800,
  'classic',
  ARRAY['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80']
),
(
  'Кольцо Эрозии',
  'Серебро с выветренной текстурой камня',
  'Уникальное кольцо с текстурой, имитирующей естественное выветривание камня. Каждая неровность и трещина создана вручную для передачи красоты времени.',
  10250,
  'textured',
  ARRAY['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80']
),
(
  'Кольцо Трещин',
  'Серебро с узором древних разломов',
  'Кольцо вдохновлено древними геологическими процессами. Узор трещин и разломов создает неповторимую игру света и тени на поверхности серебра.',
  11400,
  'textured',
  ARRAY['https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=400&fit=crop&crop=center&auto=format&q=80']
);