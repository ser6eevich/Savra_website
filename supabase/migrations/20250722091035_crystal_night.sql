/*
  # Обновление ролей пользователей и настройка хранилища

  1. Роли пользователей
    - Добавляем enum для ролей
    - Обновляем таблицу profiles
    - Настраиваем политики безопасности

  2. Хранилище файлов
    - Создаем buckets для изображений товаров, видео и аватаров
    - Настраиваем политики доступа к файлам
    - Разрешаем публичный доступ к файлам товаров

  3. Безопасность
    - RLS политики для разных ролей
    - Ограничения на загрузку файлов
*/

-- Создаем enum для ролей пользователей
CREATE TYPE user_role AS ENUM ('client', 'admin');

-- Обновляем таблицу profiles, добавляем роль
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'client',
DROP COLUMN IF EXISTS is_admin;

-- Обновляем существующих пользователей
UPDATE profiles SET role = 'client' WHERE role IS NULL;

-- Создаем storage buckets если их нет
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('product-images', 'product-images', true),
  ('product-videos', 'product-videos', true),
  ('avatars', 'avatars', false)
ON CONFLICT (id) DO NOTHING;

-- Политики для product-images bucket
CREATE POLICY "Public can view product images" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Admins can upload product images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'product-images' AND
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can update product images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'product-images' AND
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can delete product images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'product-images' AND
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Политики для product-videos bucket
CREATE POLICY "Public can view product videos" ON storage.objects
FOR SELECT USING (bucket_id = 'product-videos');

CREATE POLICY "Admins can upload product videos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'product-videos' AND
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can update product videos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'product-videos' AND
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can delete product videos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'product-videos' AND
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Политики для avatars bucket
CREATE POLICY "Users can view own avatar" ON storage.objects
FOR SELECT USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can upload own avatar" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update own avatar" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete own avatar" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Обновляем политики для таблицы products
DROP POLICY IF EXISTS "Admins can manage products" ON products;
CREATE POLICY "Admins can manage products" ON products
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Обновляем политики для таблицы promo_codes
DROP POLICY IF EXISTS "Admins can manage promo codes" ON promo_codes;
CREATE POLICY "Admins can manage promo codes" ON promo_codes
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Обновляем политики для таблицы orders
DROP POLICY IF EXISTS "Admins can read all orders" ON orders;
CREATE POLICY "Admins can read all orders" ON orders
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Обновляем функцию создания профиля
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (
    id,
    first_name,
    last_name,
    email,
    phone,
    role,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    'client',
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;