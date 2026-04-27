import React, { useState } from 'react';
import { 
  ScaleIcon, 
  ShieldCheckIcon, 
  BuildingOfficeIcon, 
  HomeIcon, 
  ComputerDesktopIcon,
  XMarkIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  DocumentMagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const WomenRights = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedLaw, setSelectedLaw] = useState(null);

  const categories = [
    { id: 'All', name: 'All Rights', icon: ScaleIcon },
    { id: 'Constitutional', name: 'Constitutional', icon: ScaleIcon },
    { id: 'Criminal', name: 'Criminal & Protection', icon: ShieldCheckIcon },
    { id: 'Workplace', name: 'Workplace', icon: BuildingOfficeIcon },
    { id: 'Property', name: 'Property & Marital', icon: HomeIcon },
    { id: 'Cyber', name: 'Cyber & Digital', icon: ComputerDesktopIcon },
  ];

  const rightsData = [
    // --- Constitutional ---
    {
      id: 1, category: 'Constitutional',
      name: 'Right to Equality',
      section: 'Article 14, Constitution of India',
      description: 'Ensures equal rights and opportunities for women, prohibiting any unfair discrimination before the law.',
      punishment: 'Fundamental Right violation; allows direct petition to High Court/Supreme Court through Writ.',
      procedure: 'File a Writ Petition in the High Court under Article 226 or Supreme Court under Article 32.'
    },
    {
      id: 2, category: 'Constitutional',
      name: 'Prohibition of Discrimination',
      section: 'Article 15(1) & 15(3), Constitution',
      description: 'State cannot discriminate merely on grounds of sex. State can make special provisions for women & children.',
      punishment: 'Unconstitutional laws or discriminatory state actions are struck down by courts.',
      procedure: 'Approach State Human Rights Commission or file a Writ Petition.'
    },
    {
      id: 3, category: 'Constitutional',
      name: 'Equality in Public Employment',
      section: 'Article 16, Constitution',
      description: 'Guarantees equal opportunity for all citizens in matters relating to employment under the State.',
      punishment: 'Nullification of discriminatory recruitment processes and mandates compensation.',
      procedure: 'Appeal to Administrative Tribunals or High Courts against discriminatory state employers.'
    },
    {
      id: 4, category: 'Constitutional',
      name: 'Right to Life and Liberty',
      section: 'Article 21, Constitution',
      description: 'Provides the right to live with human dignity, explicitly protecting a woman\'s personal liberty and privacy.',
      punishment: 'Extensive compensatory judgments and strict restraining orders against violators.',
      procedure: 'File FIR for violations or directly approach constitutional courts.'
    },
    {
      id: 5, category: 'Constitutional',
      name: 'Equal Pay for Equal Work',
      section: 'Article 39(d), Constitution & Equal Remuneration Act 1976',
      description: 'Mandates equal pay for equal work for both men and women, forbidding wage discrimination.',
      punishment: 'Employers face heavy fines extending up to ₹10,000 to ₹20,000 for initial offenses and potential imprisonment.',
      procedure: 'File a complaint with the Labour Commissioner or Labour Court/Tribunal.'
    },

    // --- Criminal ---
    {
      id: 6, category: 'Criminal',
      name: 'Protection against Outraging Modesty',
      section: 'Section 354, Indian Penal Code (IPC) / BNS',
      description: 'Assault or criminal force to a woman with the intent to outrage her modesty.',
      punishment: 'Imprisonment from 1 to 5 years, along with a fine.',
      procedure: 'File an FIR at the nearest police station immediately (Cognizable and Non-Bailable offense).'
    },
    {
      id: 7, category: 'Criminal',
      name: 'Zero FIR Rights',
      section: 'Section 154, CrPC / BNSS',
      description: 'A victim can file an FIR at ANY police station, regardless of the jurisdiction where the crime occurred.',
      punishment: 'Police officials refusing a Zero FIR face imprisonment up to 2 years under Sec 166A IPC.',
      procedure: 'Visit any police station. The police MUST register it and transfer it to the relevant jurisdiction.'
    },
    {
      id: 8, category: 'Criminal',
      name: 'Arrest of Women Guidelines',
      section: 'Section 46(4), CrPC / BNSS',
      description: 'A woman cannot be arrested after sunset and before sunrise except in exceptional circumstances. Only female officers can arrest.',
      punishment: 'Disciplinary action, suspension, and contempt of court proceedings against the violating police officers.',
      procedure: 'File a complaint with the Police Complaints Authority or the Magistrate.'
    },
    {
      id: 9, category: 'Criminal',
      name: 'Protection from Stalking',
      section: 'Section 354D, IPC / BNS',
      description: 'Following a woman, contacting her repeatedly, or monitoring her electronic communication involuntarily.',
      punishment: 'First conviction: Imprisonment up to 3 years + fine. Subsequent: Up to 5 years + fine.',
      procedure: 'Call 100/1091 or file an FIR natively online through the Cyber Crime Portal.'
    },
    {
      id: 10, category: 'Criminal',
      name: 'Acid Attack Protection',
      section: 'Section 326A & 326B, IPC / BNS',
      description: 'Strict punishment for causing permanent/partial damage using acid, along with mandatory free medical treatment.',
      punishment: 'Minimum 10 years extending to life imprisonment, plus a fine compensating the victim.',
      procedure: 'Immediate hospital admission (hospitals cannot refuse) followed by an urgent FIR registration.'
    },

    // --- Workplace ---
    {
      id: 11, category: 'Workplace',
      name: 'POSH Act (Sexual Harassment)',
      section: 'PoSH Act, 2013',
      description: 'Protects women from sexual harassment at the workplace and mandates an Internal Complaints Committee (ICC).',
      punishment: 'Termination of accused, financial penalties. Companies failing to form an ICC fined ₹50,000.',
      procedure: 'Submit a written complaint to the company\'s ICC within 3 months of the incident.'
    },
    {
      id: 12, category: 'Workplace',
      name: 'Maternity Benefits',
      section: 'Maternity Benefit Act, 1961 (Amended 2017)',
      description: 'Mandates 26 weeks of paid maternity leave for biological mothers and 12 weeks for adopting/commissioning mothers.',
      punishment: 'Employers can face imprisonment up to 1 year and heavy statutory fines.',
      procedure: 'Notify human resources with medical certificates 8 weeks prior to expected delivery.'
    },
    {
      id: 13, category: 'Workplace',
      name: 'Creche Facilities',
      section: 'Section 111A, Maternity Benefit Act',
      description: 'Any establishment with 50 or more employees MUST provide mandatory creche (daycare) facilities.',
      punishment: 'Cancellation of business licenses and statutory penal fines.',
      procedure: 'File a labor complaint with the District Labour Commissioner if the employer refuses.'
    },
    {
      id: 14, category: 'Workplace',
      name: 'Night Shift Protections',
      section: 'Factories Act, 1948',
      description: 'Women cannot be forced into night shifts (7 PM - 6 AM) without explicit consent and mandatory transit safety provisions.',
      punishment: 'License revocation and severe legal penalties for factory/business owners.',
      procedure: 'Report safety violations to the State Labor Board or Women Commission.'
    },
    {
      id: 15, category: 'Workplace',
      name: 'Right against Workplace Retaliation',
      section: 'Various Labour Statutes',
      description: 'Women cannot be fired or demoted for reporting harassment, pregnancy, or demanding equal pay.',
      punishment: 'Mandatory reinstatement with full back-pay and exemplary damages.',
      procedure: 'File a retaliation suit in the Industrial/Labour Court.'
    },

    // --- Property & Marital ---
    {
      id: 16, category: 'Property',
      name: 'Equal Inheritance Rights',
      section: 'Hindu Succession (Amendment) Act, 2005',
      description: 'Daughters have equal right (coparcenary) to inherit ancestral property just like sons, regardless of marital status.',
      punishment: 'Civil injunctions against brothers/fathers refusing share; nullification of illegal property sales.',
      procedure: 'File a civil partition suit in the Family or Civil Court.'
    },
    {
      id: 17, category: 'Property',
      name: 'Protection from Domestic Violence',
      section: 'PWDVA, 2005',
      description: 'Protects against physical, emotional, sexual, and economic abuse in a shared household.',
      punishment: 'Breach of protection order yields up to 1 year imprisonment and/or ₹20,000 fine.',
      procedure: 'Contact a Protection Officer (PO) or file a complaint directly before the Magistrate.'
    },
    {
      id: 18, category: 'Property',
      name: 'Right to Maintenance',
      section: 'Section 125 CrPC / BNSS',
      description: 'A married woman, divorcee, or destitute wife has the right to claim financial maintenance from her husband.',
      punishment: 'Failure to pay ordered maintenance results in arrest and imprisonment until paid.',
      procedure: 'File a maintenance petition in the Family Court.'
    },
    {
      id: 19, category: 'Property',
      name: 'Dowry Prohibition',
      section: 'Dowry Prohibition Act, 1961',
      description: 'Giving, taking, or demanding dowry is strictly illegal and a punishable offense.',
      punishment: 'Imprisonment of minimum 5 years and a fine not less than ₹15,000 or the amount of dowry.',
      procedure: 'Register a complaint with the Dowry Prohibition Officer or file an FIR (Section 498A).'
    },
    {
      id: 20, category: 'Property',
      name: 'Right to Stridhan',
      section: 'Section 14, Hindu Succession Act',
      description: 'Absolute ownership of all gifts, jewelry, and assets given to a woman before, during, or after marriage.',
      punishment: 'In-laws refusing to return Stridhan face criminal breach of trust (Sec 406 IPC) - up to 3 years prison.',
      procedure: 'File a police complaint for Criminal Breach of Trust to recover assets.'
    },

    // --- Cyber & Digital ---
    {
      id: 21, category: 'Cyber',
      name: 'Protection from Voyeurism',
      section: 'Section 354C IPC / IT Act',
      description: 'Taking photos/videos of a woman in private acts without consent, or disseminating such images.',
      punishment: 'First conviction: 1 to 3 years prison. Subsequent: 3 to 7 years + Fine.',
      procedure: 'Report instantly on the National Cyber Crime Portal (cybercrime.gov.in) or call 1930.'
    },
    {
      id: 22, category: 'Cyber',
      name: 'Non-Consensual Material (Revenge Porn)',
      section: 'Section 66E & 67A, IT Act',
      description: 'Publishing or transmitting sexually explicit material or private images without consent.',
      punishment: 'Imprisonment extending up to 5 years and a fine reaching ₹5 Lakhs (Sec 67A).',
      procedure: 'File an emergency takedown request and FIR via the Cyber Police.'
    },
    {
      id: 23, category: 'Cyber',
      name: 'Cyber Stalking & Bullying',
      section: 'Section 354D IPC / Section 67 IT Act',
      description: 'Repeatedly messaging, tracking online activity, or threatening a woman digitally.',
      punishment: 'Imprisonment up to 3 years and heavy fines for continuous harassment.',
      procedure: 'Retain screenshots as evidence and report via the Cyber Crime Portal.'
    },
    {
      id: 24, category: 'Cyber',
      name: 'Anonymity in Rape/Assault Cases',
      section: 'Section 228A, IPC / BNS',
      description: 'It is strictly illegal for media or digital platforms to publish the name or reveal the identity of a rape/assault survivor.',
      punishment: 'Imprisonment extending up to 2 years and fine for journalists or individuals.',
      procedure: 'File an immediate complaint against the publication to the Press Council or Cyber Police.'
    },
    {
      id: 25, category: 'Cyber',
      name: 'Right to Virtual Complaints',
      section: 'NCW Cyber Cell Guidelines',
      description: 'Women can file complaints virtually without physically visiting a police station, utilizing specific email portals.',
      punishment: 'Police cannot deny registration of severe cyber offenses communicated via email.',
      procedure: 'Email the relevant State\'s Cyber Cell directly or use the National portal.'
    }
  ];

  const filteredRights = activeCategory === 'All' 
    ? rightsData 
    : rightsData.filter(r => r.category === activeCategory);

  return (
    <div className="bg-[#f5f6f8] min-h-screen -mx-4 -mt-4 p-4 md:-mx-6 md:-mt-6 md:p-6 pb-20">
      
      {/* Header */}
      <div className="pt-2 pb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#3a3f45] flex items-center gap-2">
          <ScaleIcon className="w-8 h-8 text-[#ff556c]" /> 
          WOMEN'S LEGAL RIGHTS LIBRARY
        </h1>
        <p className="text-gray-500 mt-2 font-medium text-sm md:text-base">
          Explore 25+ essential legal rights, sections, and procedures mapped to your safety.
        </p>
      </div>

      {/* Categories Scroller */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-3 overflow-x-auto mb-8 hide-scrollbar">
        {categories.map((cat) => (
          <button 
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`whitespace-nowrap px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
              activeCategory === cat.id 
              ? 'bg-[#7c56c2] text-white shadow-md' 
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <cat.icon className="w-5 h-5" />
            {cat.name}
          </button>
        ))}
      </div>

      {/* Rights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredRights.map((right) => (
          <div 
            key={right.id} 
            onClick={() => setSelectedLaw(right)}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-[#987dd0] transition-all cursor-pointer group flex flex-col h-full"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="bg-purple-50 text-[#7c56c2] text-xs font-extrabold px-3 py-1 rounded-lg uppercase tracking-wider">
                {right.category}
              </span>
              <DocumentMagnifyingGlassIcon className="w-6 h-6 text-gray-300 group-hover:text-[#ff556c] transition-colors" />
            </div>
            
            <h3 className="text-lg font-black text-gray-800 mb-2 leading-tight">
              {right.name}
            </h3>
            
            <p className="text-sm text-gray-500 font-medium line-clamp-2 mb-4 flex-grow">
              {right.description}
            </p>
            
            <div className="mt-auto pt-4 border-t border-gray-50 flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Section:</span>
              <span className="text-xs font-bold text-gray-700 bg-gray-50 px-2 py-1 rounded">{right.section}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Deep Legal Detail Modal */}
      {selectedLaw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedLaw(null)}></div>
          
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-gray-100 p-6 flex justify-between items-start z-20">
              <div>
                <span className="bg-red-50 text-red-600 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest mb-2 inline-block">
                  {selectedLaw.category} Code
                </span>
                <h2 className="text-2xl font-black text-gray-900 leading-tight">
                  {selectedLaw.name}
                </h2>
              </div>
              <button 
                onClick={() => setSelectedLaw(null)}
                className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full text-gray-600 transition"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-8">
              
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <InformationCircleIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Law Designation</h4>
                  <p className="font-bold text-gray-800 bg-gray-50 inline-block px-3 py-1 rounded-lg">
                    {selectedLaw.section}
                  </p>
                  <p className="text-gray-600 mt-3 font-medium leading-relaxed">
                    {selectedLaw.description}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Punishments & Fines</h4>
                  <p className="text-red-700 font-semibold leading-relaxed bg-red-50/50 p-4 rounded-xl border border-red-100">
                    {selectedLaw.punishment}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                  <ShieldCheckIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Procedure to File Complaint</h4>
                  <p className="text-green-800 font-semibold leading-relaxed bg-green-50/50 p-4 rounded-xl border border-green-100">
                    {selectedLaw.procedure}
                  </p>
                </div>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row gap-3 rounded-b-3xl">
              <button 
                onClick={() => navigate('/cyber-crime')}
                className="flex-1 bg-[#333] hover:bg-black text-white px-6 py-4 rounded-xl font-bold transition-all shadow-md"
              >
                Go to Complaint Portal
              </button>
              <button 
                onClick={() => window.open('tel:1091')}
                className="flex-1 bg-white border-2 border-gray-200 hover:border-[#ff556c] text-gray-800 hover:text-[#ff556c] px-6 py-4 rounded-xl font-bold transition-all"
              >
                Call Women Helpline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global strict styles overrides for hide-scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default WomenRights;
