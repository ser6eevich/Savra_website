/*
  # Создание системы пользователей и товаров

  1. Новые таблицы
    - `profiles` - профили пользователей
      - `id` (uuid, связан с auth.users)
      - `first_name` (text)
      - `last_name` (text) 
      - `phone` (text)
      - `date_of_birth` (date)
      - `avatar_url` (text)
      - `is_admin` (boolean, по умолчанию false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `products` - товары
      - `id` (uuid, первичный ключ)
      - `name` (text, название)
      - `description` (text, краткое описание)
      - `detailed_description` (text, подробное описание)
      - `price` (integer, цена в копейках)
      - `category` (text, категория)
      - `collection` (text, коллекция)
      - `article` (text, артикул)
      - `material` (text, материал)
      - `type` (text, тип)
      - `sizes` (text[], доступные размеры)
      - `images` (text[], массив URL изображений)
      - `video_url` (text, URL видео)
      - `is_active` (boolean, активность товара)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Безопасность
    - Включить RLS для обеих таблиц
    - Политики для profiles: пользователи могут читать и обновлять свои данные
    - Политики для products: все могут читать активные товары, админы могут управлять
    - Функция и триггер для автоматического создания профиля при регистрации

  3. Функции
    - `handle_new_user()` - создание профиля при регистрации
    - `update_updated_at_column()` - обновление поля updated_at
*/

-- Создание функции для обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Создание таблицы профилей
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

-- Включение RLS для profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Политики для profiles
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

-- Триггер для обновления updated_at в profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Функция для создания профиля при регистрации
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    first_name,
    last_name,
    phone,
    is_admin,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'phone',
    FALSE,
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Триггер для автоматического создания профиля
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

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

-- Включение RLS для products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Политики для products
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

-- Триггер для обновления updated_at в products
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Вставка демо-товаров
INSERT INTO products (name, description, detailed_description, price, category, collection, article, material, type, sizes, images) VALUES
('Классическое кольцо', 'Элегантное серебряное кольцо', 'Изысканное классическое кольцо из серебра 925 пробы. Идеально подходит для повседневной носки и особых случаев.', 2500, 'rings', 'Classic', 'R001', 'Серебро 925°', 'classic', ARRAY['15', '16', '17', '18', '19', '20', '21'], ARRAY['https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg']),
('Винтажное кольцо', 'Кольцо в винтажном стиле', 'Уникальное винтажное кольцо с изысканной гравировкой. Создано по мотивам украшений начала XX века.', 3200, 'rings', 'Vintage', 'R002', 'Серебро 925°', 'vintage', ARRAY['16', '17', '18', '19', '20'], ARRAY['https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg']),
('Современное кольцо', 'Кольцо в современном стиле', 'Стильное современное кольцо с минималистичным дизайном. Отлично сочетается с любым образом.', 2800, 'rings', 'Modern', 'R003', 'Серебро 925°', 'modern', ARRAY['15', '16', '17', '18', '19', '20', '21'], ARRAY['https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg']);