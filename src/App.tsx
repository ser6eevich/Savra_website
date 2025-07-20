@@ .. @@
-import React, { useState } from 'react';
-import { Header } from './components/Header';
-import { HomePage } from './components/HomePage';
-import { CatalogPage } from './components/CatalogPage';
-import { ProductDetailPage } from './components/ProductDetailPage';
-import { AboutPage } from './components/AboutPage';
-import { CartPage } from './components/CartPage';
-import { FavoritesPage } from './components/FavoritesPage';
-import { RegisterPage } from './components/RegisterPage';
-import { NotFoundPage } from './components/NotFoundPage';
+import React, { useState } from 'react';
+import { Header } from '@/components/Header';
+import { HomePage } from '@/components/HomePage';
+import { CatalogPage } from '@/components/CatalogPage';
+import { ProductDetailPage } from '@/components/ProductDetailPage';
+import { AboutPage } from '@/components/AboutPage';
+import { CartPage } from '@/components/CartPage';
+import { FavoritesPage } from '@/components/FavoritesPage';
+import { RegisterPage } from '@/components/RegisterPage';
+import { NotFoundPage } from '@/components/NotFoundPage';
+import { CartItem, Product } from '@/types';
 
-interface CartItem {
-  id: string;
-  name: string;
-  price: number;
-  image: string;
-  quantity: number;
-  size?: string;
-}
-
-interface Product {
-  id: string;
-  name: string;
-  description: string;
-  price: number;
-  image: string;
-  category: string;
-}
-
 export default function App() {