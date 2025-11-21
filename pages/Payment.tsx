
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { BackButton } from '../components/BackButton';
import { Loader } from '../components/Loader';
import { QrCode, Copy, CheckCircle, AlertTriangle } from 'lucide-react';
import { checkPaymentStatus, simulateWebhookSuccess } from '../services/paymentService';
import { Payment } from '../types';
import { db } from '../services/mockDb';

export const PaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [status, setStatus] = useState<'waiting' | 'paid'>('waiting');
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    // Get payment data passed from Plans page
    if (location.state && location.state.payment) {
      setPayment(location.state.payment);
    } else {
      navigate('/plans');
    }
  }, [location, navigate]);

  // Poll for status
  useEffect(() => {
    if (!payment || status === 'paid') return;

    const interval = setInterval(async () => {
      const currentStatus = await checkPaymentStatus(payment.referenceId);
      if (currentStatus === 'paid') {
        setStatus('paid');
        clearInterval(interval);
        setTimeout(() => {
           // Refresh User Data in DB context before navigating
           db.getUser(); 
           navigate('/');
        }, 2000);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [payment, status, navigate]);

  const handleCopy = () => {
    if (payment?.qrCodeText) {
      navigator.clipboard.writeText(payment.qrCodeText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleSimulatePayment = async () => {
    if (!payment) return;
    await simulateWebhookSuccess(payment.referenceId);
  };

  if (!payment) return <Loader fullScreen text="Iniciando checkout..." />;

  return (
    <div className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center p-4">
      <div className="absolute top-6 left-6 z-30">
         <BackButton fallbackPath="/plans" label="Cancelar" />
      </div>
      
      <Card className="max-w-md w-full border-[#00A86B]/30 shadow-[0_0_50px_rgba(0,168,107,0.1)]">
        {status === 'paid' ? (
          <div className="text-center py-10 animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-[#00A86B] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_#00A86B]">
              <CheckCircle size={40} className="text-black" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Pagamento Confirmado!</h2>
            <p className="text-gray-400 mb-6">Bem-vindo ao AprovaIA Premium.</p>
            <p className="text-xs text-[#00A86B] animate-pulse">Redirecionando para o Dashboard...</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">Pagamento via Pix</h1>
              <p className="text-gray-400 text-sm">Escaneie o QR Code ou copie o código abaixo para liberar seu acesso imediato.</p>
            </div>

            <div className="bg-white p-4 rounded-xl mb-6 mx-auto w-64 h-64 flex items-center justify-center relative overflow-hidden">
               {/* Mock QR Code Visual */}
               <QrCode size={200} className="text-black" />
               <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo%E2%80%94PicPay.png" alt="PicPay" />
               </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <input 
                  readOnly 
                  value={payment.qrCodeText} 
                  className="flex-1 bg-[#18181B] border border-white/10 rounded-lg px-3 text-gray-500 text-xs truncate"
                />
                <Button onClick={handleCopy} size="sm" variant={copySuccess ? 'primary' : 'secondary'}>
                  {copySuccess ? <CheckCircle size={16} /> : <Copy size={16} />}
                </Button>
              </div>

              <div className="flex items-center justify-center gap-2 text-yellow-500 text-xs bg-yellow-500/10 p-3 rounded-lg">
                <AlertTriangle size={14} />
                <span>Aguardando confirmação do banco...</span>
              </div>

              {/* DEV ONLY: Simulation Button */}
              <div className="pt-4 border-t border-white/5 mt-4">
                <Button onClick={handleSimulatePayment} variant="ghost" className="w-full text-gray-600 hover:text-white text-xs">
                  (Dev) Simular Pagamento no App do Banco
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};
