import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Order, CartItem } from '../types'

export function useOrders(userId: string | null) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (userId) {
      fetchOrders()
    } else {
      setOrders([])
    }
  }, [userId])

  const fetchOrders = async () => {
    if (!userId) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      const formattedOrders: Order[] = data.map(order => ({
        id: order.id,
        userId: order.user_id,
        items: order.items as CartItem[],
        total: order.total,
        status: order.status as Order['status'],
        orderType: order.order_type as Order['orderType'],
        promoCode: order.promo_code,
        discount: order.discount,
        createdAt: new Date(order.created_at),
        updatedAt: new Date(order.updated_at)
      }))

      setOrders(formattedOrders)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const createOrder = async (orderData: {
    items: CartItem[]
    total: number
    orderType: 'catalog' | 'constructor'
    promoCode?: string
    discount?: number
  }) => {
    if (!userId) throw new Error('User not authenticated')

    try {
      const { data, error } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          items: orderData.items,
          total: orderData.total,
          order_type: orderData.orderType,
          promo_code: orderData.promoCode,
          discount: orderData.discount,
          status: 'pending'
        })
        .select()
        .single()

      if (error) throw error

      await fetchOrders() // Refresh orders list
      return data
    } catch (error) {
      console.error('Error creating order:', error)
      throw error
    }
  }

  return {
    orders,
    loading,
    createOrder,
    refetch: fetchOrders
  }
}