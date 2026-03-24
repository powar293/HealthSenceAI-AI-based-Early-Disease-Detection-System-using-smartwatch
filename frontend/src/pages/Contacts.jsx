import React, { useState, useEffect } from 'react';
import { UserPlus, UserCircle, Trash2, Phone, AlertCircle } from 'lucide-react';
import { getEmergencyContacts, addEmergencyContact, deleteEmergencyContact } from '../services/api';

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relation, setRelation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const data = await getEmergencyContacts();
      setContacts(data);
    } catch (err) {
      console.error("Failed to load contacts", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone || !relation) return;
    
    setIsSubmitting(true);
    try {
      await addEmergencyContact({ name, phone_number: phone, relation });
      setName('');
      setPhone('');
      setRelation('');
      await loadContacts();
    } catch (err) {
      console.error("Failed to add contact", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEmergencyContact(id);
      await loadContacts();
    } catch (err) {
      console.error("Failed to delete contact", err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Emergency Contacts</h1>
        <p className="text-slate-500 mt-1.5 font-semibold text-sm">Manage contacts to notify when critical health events are detected.</p>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-3xl p-5 flex items-start gap-4">
        <div className="p-3 bg-amber-500 text-white rounded-2xl shadow-sm">
          <AlertCircle size={24} />
        </div>
        <div>
          <h4 className="font-bold text-amber-900 tracking-tight text-lg mb-0.5">Automated Alert Calling</h4>
          <p className="font-medium text-amber-800/80 text-sm">When an emergency is triggered and the countdown reaches zero without cancellation, the system will automatically dispatch SMS and call alerts containing your live location to all contacts listed below.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Contact List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-bold text-slate-800 tracking-tight pl-1">Your Saved Contacts</h3>
          
          {loading ? (
            <div className="w-full h-32 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-b-slate-500"></div>
            </div>
          ) : contacts.length > 0 ? (
            <div className="space-y-4">
              {contacts.map(contact => (
                <div key={contact.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100/60 flex items-center justify-between group transition-all hover:shadow-md">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center">
                      <UserCircle size={28} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 leading-tight">{contact.name}</h4>
                      <p className="text-sm font-semibold text-indigo-500/80 mt-0.5 uppercase tracking-wide">{contact.relation}</p>
                      <p className="text-slate-500 font-medium text-sm mt-1 flex items-center gap-1">
                        <Phone size={14} /> {contact.phone_number}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(contact.id)}
                    className="p-3 bg-red-50 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white transform translate-x-2 group-hover:translate-x-0"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
             <div className="bg-white p-10 rounded-3xl border border-slate-100/60 text-center shadow-sm">
                <UserPlus size={40} className="text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-bold tracking-wide">No emergency contacts saved yet.</p>
             </div>
          )}
        </div>

        {/* Add Contact Form */}
        <div>
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-slate-100/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] sticky top-8">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <UserPlus size={20} className="text-healthcare-500" />
              Add New Contact
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Full Name</label>
                <input 
                  type="text" required value={name} onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-healthcare-500/20 focus:border-healthcare-500 block p-3.5 transition-all outline-none font-medium" 
                  placeholder="John Doe" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Phone Number</label>
                <input 
                  type="tel" required value={phone} onChange={e => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-healthcare-500/20 focus:border-healthcare-500 block p-3.5 transition-all outline-none font-medium" 
                  placeholder="+1 (555) 000-0000" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Relationship</label>
                <input 
                  type="text" required value={relation} onChange={e => setRelation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-healthcare-500/20 focus:border-healthcare-500 block p-3.5 transition-all outline-none font-medium" 
                  placeholder="e.g. Spouse, Parent, Doctor" 
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm px-5 py-4 text-center transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                Save Contact
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

