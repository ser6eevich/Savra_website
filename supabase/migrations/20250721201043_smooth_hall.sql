@@ .. @@
 -- Политика для вставки: пользователи могут создавать записи только для своего ID
 CREATE POLICY "Users can insert their own data"
   ON users
   FOR INSERT
-  TO authenticated
+  TO public
   WITH CHECK (auth.uid() = id);