import { db } from './mockDb';
import { Payment, User } from '../types';

export const PICPAY_MOCK_QR = "00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000520400005303986540529.905802BR5913APROVAIA SAAS6008BRASILIA62070503***6304E2CA";

export const createPayment = async (user: User): Promise<Payment> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const referenceId = `REF-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  const newPayment: Payment = {
    id: Date.now().toString(),
    userId: user.id,
    referenceId: referenceId,
    value: 29.90,
    status: 'created',
    qrCodeText: PICPAY_MOCK_QR,
    qrCodeBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', // Mock pixel
    createdAt: new Date().toISOString()
  };

  db.createPayment(newPayment);
  return newPayment;
};

export const checkPaymentStatus = async (referenceId: string): Promise<'paid' | 'pending' | 'failed'> => {
  const payments = db.getPayments();
  const payment = payments.find(p => p.referenceId === referenceId);
  
  if (!payment) return 'failed';
  return payment.status === 'paid' ? 'paid' : 'pending';
};

export const simulateWebhookSuccess = async (referenceId: string) => {
  console.log(`[WEBHOOK] Processing payment ${referenceId}...`);
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const success = db.updatePaymentStatus(referenceId, 'paid');
  if (success) {
    console.log(`[WEBHOOK] Payment ${referenceId} CONFIRMED. User activated.`);
    return true;
  }
  return false;
};
