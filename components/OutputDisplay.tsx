import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Check, FileText, Download, ChevronDown, ChevronUp, Database, Mail } from 'lucide-react';
import { InsuranceFormData } from '../types';
import { generateQuotePDF, generateDataSheetPDF, getEstimatedPrice, formatSwissPrice } from '../services/pdfService';

interface OutputDisplayProps {
  result: string;
  formData: InsuranceFormData;
}

const PROVIDER_STYLES: Record<string, string> = {
  'AXA': 'border-blue-700 text-blue-800',
  'Allianz': 'border-blue-600 text-blue-700',
  'Zurich': 'border-sky-600 text-sky-700',
  'Helvetia Baloise': 'border-indigo-600 text-indigo-700',
  'Mobiliar': 'border-red-600 text-red-700',
  'Generali': 'border-rose-600 text-rose-700',
  'Vaudoise': 'border-emerald-600 text-emerald-700',
  'Emmentaler': 'border-amber-600 text-amber-800',
};

// Providers that require an Email workflow instead of direct simulated PDF
const EMAIL_REQ_PROVIDERS = [
  'Emmentaler', 
  'Generali', 
  'Helvetia Baloise', 
  'Mobiliar', 
  'Vaudoise'
];

// Specific email recipients for providers
const PROVIDER_EMAILS: Record<string, string> = {
  'Mobiliar': 'makler.wetzikon@mobi.ch',
};

const OutputDisplay: React.FC<OutputDisplayProps> = ({ result, formData }) => {
  const [copied, setCopied] = React.useState(false);
  const [isAnalysisExpanded, setIsAnalysisExpanded] = React.useState(false);
  const [crmStatus, setCrmStatus] = React.useState<'idle' | 'loading' | 'success'>('idle');

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCrmExport = () => {
    setCrmStatus('loading');
    // Simulate API call
    setTimeout(() => {
        setCrmStatus('success');
        setTimeout(() => setCrmStatus('idle'), 3000);
    }, 1500);
  };

  const handleEmailRequest = (providerName: string) => {
    // 1. Generate and download the PDF data sheet
    generateDataSheetPDF(formData);

    // 2. Construct Mailto link
    // Note: We cannot attach files programmatically via mailto, so we instruct the user.
    const recipient = PROVIDER_EMAILS[providerName] || '';
    const subject = encodeURIComponent(`Offertanfrage Autoversicherung - ${formData.lastName} ${formData.firstName}`);
    const body = encodeURIComponent(
      `Sehr geehrte Damen und Herren,\n\n` +
      `Bitte erstellen Sie mir eine Offerte für eine Motorfahrzeugversicherung bei der ${providerName}.\n\n` +
      `Die detaillierten Fahrzeug- und Kundendaten finden Sie im angehängten PDF-Formular ("Fahrzeugdaten_${formData.lastName}.pdf"), ` +
      `welches soeben heruntergeladen wurde.\n\n` +
      `Freundliche Grüsse,\n` +
      `${formData.firstName} ${formData.lastName}`
    );

    // 3. Open Email Client
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
    
    // Optional: Alert/Notification could be added here, but the download is visible.
    alert(`Das Datenblatt wurde heruntergeladen.\n\nBitte hängen Sie die Datei "Fahrzeugdaten_${formData.lastName}.pdf" an die nun geöffnete E-Mail an.`);
  };

  // Filter providers based on selection. If none selected (edge case), show default 4, but usually formData controls this.
  const activeProviders = formData.selectedProviders.length > 0 
    ? formData.selectedProviders 
    : ['Allianz', 'AXA', 'Helvetia Baloise', 'Zurich'];

  return (
    <div className="space-y-8 animate-fade-in-up">
      
      {/* PDF Download Section */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
        <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center">
             <h2 className="text-white font-semibold text-lg flex items-center gap-2">
                <span className="text-xl">📑</span> Offerten & Anfragen
            </h2>
            <button
                onClick={handleCrmExport}
                disabled={crmStatus === 'loading' || crmStatus === 'success'}
                className={`
                    text-xs px-3 py-1.5 rounded-md flex items-center gap-2 transition-all font-medium border
                    ${crmStatus === 'success' 
                        ? 'bg-green-600 text-white border-green-500' 
                        : 'bg-slate-700 text-slate-200 border-slate-600 hover:bg-slate-600 hover:text-white'}
                    disabled:opacity-80 disabled:cursor-not-allowed
                `}
            >
                {crmStatus === 'success' ? <Check className="w-3.5 h-3.5" /> : <Database className="w-3.5 h-3.5" />}
                {crmStatus === 'loading' ? 'Sende...' : crmStatus === 'success' ? 'Im CRM gespeichert' : 'In CRM speichern'}
            </button>
        </div>
        <div className="p-6">
            <p className="text-sm text-slate-500 mb-4">
                Wählen Sie die gewünschte Aktion für die selektierten Anbieter:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeProviders.map((providerName) => {
                    const price = getEstimatedPrice(providerName, formData);
                    const styleClass = PROVIDER_STYLES[providerName] || 'border-slate-400 text-slate-700';
                    const isEmailProvider = EMAIL_REQ_PROVIDERS.includes(providerName);
                    
                    return (
                        <button
                            key={providerName}
                            onClick={() => isEmailProvider ? handleEmailRequest(providerName) : generateQuotePDF(providerName, formData)}
                            className={`flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-all group ${styleClass}`}
                        >
                            <div className="flex items-center gap-3 flex-1">
                                <div className={`p-2 rounded-md group-hover:bg-white transition-colors shrink-0 ${isEmailProvider ? 'bg-amber-100 text-amber-700' : 'bg-slate-100'}`}>
                                    {isEmailProvider ? <Mail className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                                </div>
                                <div className="text-left w-full pr-4">
                                    <div className="flex justify-between items-center">
                                        <span className="block font-bold text-lg">{providerName}</span>
                                        {!isEmailProvider && (
                                           <span className="text-sm font-bold bg-white/50 px-2 py-0.5 rounded border border-current opacity-90">CHF {formatSwissPrice(price)}</span>
                                        )}
                                    </div>
                                    <span className="text-xs opacity-70">
                                        {isEmailProvider ? 'Offerte per E-Mail anfordern' : 'Sofort-Offerte herunterladen'}
                                    </span>
                                </div>
                            </div>
                            {isEmailProvider ? (
                                <Mail className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity shrink-0" />
                            ) : (
                                <Download className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity shrink-0" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
      </div>

      {/* AI Analysis Section (Collapsible) */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden transition-all">
        <div 
            className="bg-slate-800 px-6 py-4 flex justify-between items-center cursor-pointer hover:bg-slate-700 transition-colors"
            onClick={() => setIsAnalysisExpanded(!isAnalysisExpanded)}
        >
          <h2 className="text-white font-semibold text-lg flex items-center gap-2">
              <span className="text-xl">📊</span> Detaillierte Analyse & Simulation
          </h2>
          <div className="flex items-center gap-3">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded transition-colors border border-slate-600 z-10"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Kopiert!' : 'Kopieren'}
              </button>
              {isAnalysisExpanded ? (
                  <ChevronUp className="w-5 h-5 text-slate-300" />
              ) : (
                  <ChevronDown className="w-5 h-5 text-slate-300" />
              )}
          </div>
        </div>
        
        {isAnalysisExpanded && (
            <div className="p-8 prose prose-slate max-w-none prose-headings:text-blue-700 prose-strong:text-slate-900 prose-li:marker:text-blue-500 border-t border-slate-200 animate-fade-in-down">
            <ReactMarkdown>{result}</ReactMarkdown>
            </div>
        )}
      </div>
    </div>
  );
};

export default OutputDisplay;