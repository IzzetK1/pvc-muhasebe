import { createClient } from '@supabase/supabase-js';
import { getSession } from 'next-auth/react';

// Supabase istemcisini oluştur
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export type LogAction = 
  | 'create'
  | 'update'
  | 'delete'
  | 'view'
  | 'login'
  | 'logout'
  | 'export'
  | 'import'
  | 'payment'
  | 'other';

export type EntityType = 
  | 'customer'
  | 'project'
  | 'transaction'
  | 'partner'
  | 'partner_expense'
  | 'user'
  | 'report'
  | 'system';

export interface LogDetails {
  [key: string]: any;
}

export async function logActivity(
  action: LogAction,
  entityType: EntityType,
  entityId?: string,
  details?: LogDetails
) {
  try {
    // Kullanıcı oturumunu al
    const session = await getSession();
    const userId = session?.user?.id;

    if (!userId) {
      console.warn('Kullanıcı oturumu bulunamadı, log kaydedilemiyor');
      return;
    }

    // IP adresini al (client tarafında çalışmaz)
    let ipAddress = '';
    if (typeof window !== 'undefined') {
      // Client tarafında çalışıyoruz, IP adresini alamayız
      // Gerçek uygulamada API üzerinden IP adresini alabiliriz
      ipAddress = 'client';
    }

    // Log kaydını oluştur
    const { data, error } = await supabase
      .from('activity_logs')
      .insert({
        user_id: userId,
        action,
        entity_type: entityType,
        entity_id: entityId || null,
        details: details || null,
        ip_address: ipAddress,
      });

    if (error) {
      console.error('Log kaydedilirken hata oluştu:', error);
    }

    return data;
  } catch (error) {
    console.error('Log kaydedilirken beklenmeyen hata:', error);
  }
}

// Özel log fonksiyonları
export const logCustomerActivity = (action: LogAction, customerId: string, details?: LogDetails) => 
  logActivity(action, 'customer', customerId, details);

export const logProjectActivity = (action: LogAction, projectId: string, details?: LogDetails) => 
  logActivity(action, 'project', projectId, details);

export const logTransactionActivity = (action: LogAction, transactionId: string, details?: LogDetails) => 
  logActivity(action, 'transaction', transactionId, details);

export const logPartnerActivity = (action: LogAction, partnerId: string, details?: LogDetails) => 
  logActivity(action, 'partner', partnerId, details);

export const logUserActivity = (action: LogAction, userId: string, details?: LogDetails) => 
  logActivity(action, 'user', userId, details);

export const logSystemActivity = (action: LogAction, details?: LogDetails) => 
  logActivity(action, 'system', undefined, details);
