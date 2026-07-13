import { useState } from 'react';
import { Smartphone, CheckCircle2, XCircle, ChevronDown, ChevronUp, ShieldCheck, RefreshCw, HelpCircle, Send } from 'lucide-react';
import { cn } from '../lib/utils';

export function OTPDevice() {
  const [activeTab, setActiveTab] = useState('MobileDevice');
  const [phoneNumber, setPhoneNumber] = useState('+65 8921 4452');
  const [newNumber, setNewNumber] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // FAQ Accordion state
  const [openFaq, setOpenFaq] = useState(0);

  const handleRegister = () => {
    if (newNumber.length < 8) return;
    setIsVerifying(true);
    setOtpValue('');
    setOtpError(false);
  };

  const verifyOtp = () => {
    if (otpValue === '123456') {
      setIsVerifying(false);
      setIsSuccess(true);
      setPhoneNumber(newNumber);
      setNewNumber('');
      setTimeout(() => setIsSuccess(false), 3000);
    } else {
      setOtpError(true);
    }
  };

  const faqs = [
    {
      q: "How do I update my registered mobile number for OTP delivery?",
      a: "Navigate to the 'Mobile Device' tab, enter your new international mobile number (including country code), and click 'Register New Protocol'. You will receive a 6-digit verification code via your current gateway. Once verified, the system will update your delivery node immediately."
    },
    {
      q: "Why am I not receiving my OTP verification code?",
      a: "Verification delays can occur due to regional carrier congestion or signal interference. If the code does not arrive within 60 seconds, check the 'Servers' status in your dashboard to ensure the gateway nodes are online. You can also request a resend after the timeout."
    },
    {
      q: "Is there a limit to how many times I can change my number?",
      a: "For security governance, number migrations are limited to 3 times per 24-hour cycle to prevent social engineering and unauthorized account takeovers."
    },
    {
      q: "What is an OTP Device node?",
      a: "An OTP Device node is the primary identified endpoint used by OBH Dashboard to route secure transaction identifiers to your identity. This can be a physical mobile device (via SMS/Push) or an integrated virtual environment."
    }
  ];

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-300 pb-2">
        <div className="flex gap-6">
          <button 
            onClick={() => setActiveTab('MobileDevice')}
            className={cn(
              "pb-2 text-sm font-bold border-b-2 transition-all",
              activeTab === 'MobileDevice' ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-400 hover:text-slate-600"
            )}
          >
            Mobile Device
          </button>
          <button 
            onClick={() => setActiveTab('FAQ')}
            className={cn(
              "pb-2 text-sm font-bold border-b-2 transition-all",
              activeTab === 'FAQ' ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-400 hover:text-slate-600"
            )}
          >
            FAQ & Support
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {activeTab === 'MobileDevice' && (
          <div className="space-y-4">
            {/* Current Status Card */}
            <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
               <div className="p-3 border-b border-slate-200 bg-slate-50/50 flex items-center gap-2">
                  <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Active Identity Endpoint</span>
               </div>
               <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center border border-indigo-100">
                      <Smartphone className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xl font-black text-slate-800 font-mono italic tracking-tighter">
                        {phoneNumber}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em]">Validated Protocol</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium italic max-w-xs md:text-right border-l-0 md:border-l border-slate-200 md:pl-6">
                    This number is currently registered as the primary delivery node for all secure OTP transmissions to your account.
                  </div>
               </div>
            </div>

            {/* Registration Form */}
            <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
               <div className="p-3 border-b border-slate-200 bg-slate-50/50 flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Migrate Delivery Node</span>
               </div>
               <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">New Mobile Number</label>
                      <div className="flex gap-2">
                        <select className="bg-slate-50 border border-slate-200 rounded px-2 py-2 text-xs font-bold text-slate-600 outline-none focus:ring-1 focus:ring-indigo-500">
                          <option>+65 (SG)</option>
                          <option>+1 (US)</option>
                          <option>+63 (PH)</option>
                          <option>+91 (IN)</option>
                        </select>
                        <input 
                          type="text" 
                          value={newNumber}
                          onChange={(e) => setNewNumber(e.target.value)}
                          placeholder="e.g. 8921 4452"
                          className="flex-1 bg-white border border-slate-200 rounded px-3 py-2 text-xs font-mono font-bold outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                      <p className="text-[9px] text-slate-400 italic">Enter the full identity identifier for the new physical device.</p>
                    </div>
                    <div className="flex items-end">
                      <button 
                        onClick={handleRegister}
                        disabled={newNumber.length < 8}
                        className="w-full py-2.5 bg-indigo-600 text-white text-[11px] font-black uppercase rounded shadow-sm hover:bg-indigo-700 disabled:opacity-30 disabled:hover:bg-indigo-600 transition-all tracking-widest flex items-center justify-center gap-2"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Register New Protocol
                      </button>
                    </div>
                  </div>
               </div>
               {isSuccess && (
                 <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-300">
                   <div className="p-3 bg-emerald-50 border border-emerald-100 rounded flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span className="text-[11px] font-bold text-emerald-700">Identity Updated: Delivery node migrated successfully.</span>
                   </div>
                 </div>
               )}
            </div>
          </div>
        )}

        {activeTab === 'FAQ' && (
          <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden flex flex-col divide-y divide-slate-100">
             <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-600" />
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">Identity Governance & Support FAQ</span>
             </div>
             {faqs.map((f, i) => (
               <div key={i} className="flex flex-col">
                  <button 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
                  >
                    <span className="text-xs font-bold text-slate-700 pr-8">{f.q}</span>
                    {openFaq === i ? <ChevronUp className="w-4 h-4 text-slate-300" /> : <ChevronDown className="w-4 h-4 text-slate-300" />}
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-300">
                       <div className="p-3 bg-slate-50 rounded border border-slate-100 italic font-serif text-[11px] text-slate-500 leading-relaxed indent-4">
                        {f.a}
                       </div>
                    </div>
                  )}
               </div>
             ))}
          </div>
        )}
      </div>

      {/* OTP Verification Modal */}
      {isVerifying && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-sm rounded-lg border border-slate-200 shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <ShieldCheck className="w-4 h-4 text-indigo-600" />
                   <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter">Identity Verification Node</span>
                </div>
                <button onClick={() => setIsVerifying(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
              <div className="p-8 flex flex-col items-center text-center">
                 <div className="w-12 h-12 bg-indigo-50 rounded flex items-center justify-center mb-4">
                    <Smartphone className="w-6 h-6 text-indigo-600" />
                 </div>
                 <h4 className="text-sm font-bold text-slate-800">Verify Device Identity</h4>
                 <p className="text-[10px] text-slate-400 mt-1 max-w-[200px]">A 6-digit verification protocol was transmitted to <span className="text-indigo-600 font-bold">{newNumber}</span>. Please authorize.</p>
                 
                 <div className="mt-8 flex flex-col gap-4 w-full">
                    <input 
                      type="text" 
                      value={otpValue}
                      onChange={(e) => {
                        setOtpValue(e.target.value);
                        setOtpError(false);
                      }}
                      maxLength={6}
                      placeholder="0 0 0 0 0 0"
                      className={cn(
                        "w-full text-center py-3 text-2xl font-black font-mono tracking-[0.4em] bg-slate-50 border rounded outline-none transition-all",
                        otpError ? "border-red-300 ring-1 ring-red-500 text-red-600" : "border-slate-200 focus:ring-1 focus:ring-indigo-500"
                      )}
                    />
                    {otpError && <span className="text-[9px] font-bold text-red-500 uppercase tracking-tight">Invalid Verification Token</span>}
                    
                    <button 
                      onClick={verifyOtp}
                      className="w-full py-3 bg-slate-800 text-white text-xs font-bold rounded hover:bg-slate-700 transition-colors shadow-sm mt-2 font-mono tracking-widest"
                    >
                      AUTHORIZE IDENTITY
                    </button>
                    
                    <div className="flex items-center justify-between mt-2">
                       <button className="text-[10px] text-slate-400 hover:text-indigo-600 underline">Resend Token</button>
                       <span className="text-[10px] text-slate-400">00:59</span>
                    </div>
                 </div>
              </div>
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-center">
                 <p className="text-[9px] text-slate-300 uppercase tracking-[0.2em] font-bold">Secure Auth Node / OBH Dashboard v4.0</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
