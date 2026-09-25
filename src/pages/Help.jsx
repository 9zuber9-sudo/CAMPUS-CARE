import { useState } from 'react';

const FAQS = [
  {
    q: 'How does CampusCare automatically determine incident priority?',
    a: 'CampusCare uses an AI-assisted priority algorithm that analyzes incident type base scores, urgency keywords in descriptions (e.g., "unconscious", "explosion", "severe"), location risk factors (Labs, Hostels, Libraries), and time of day (night-time hazard multiplier). High scores automatically flag incidents as Critical or High.',
  },
  {
    q: 'How does Auto-Assignment work when multiple incidents compete for responders?',
    a: 'When an incident is reported, the system scans all available on-duty responders and ranks them by specialty match (e.g., Medical for health emergencies, Security for alerts). If all responders are busy, incidents are queued in order of priority score in the Response Queue.',
  },
  {
    q: 'What are the stages of an incident lifecycle?',
    a: 'Every incident follows 4 defined stages:\n1. Reported: Incident submitted by student, faculty or auto-system.\n2. Assigned: Responder matched and dispatched to location.\n3. Responding: Responder on scene actively handling the situation.\n4. Resolved: Incident resolved, notes saved, responder set back to available.',
  },
  {
    q: 'Who should I call in case of an immediate life-threatening emergency?',
    a: 'In case of life-threatening emergencies, immediately call the Campus Security Control Room at +91 98765 43210 or national emergency number 112.',
  },
  {
    q: 'How can responders toggle their duty status?',
    a: 'Responders can be set to Available or Off-Duty on the Responders management page. Off-duty responders will not be assigned to new incoming incidents.',
  },
];

export default function Help() {
  const [openFaq, setOpenFaq] = useState(0);
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitQuery = (e) => {
    e.preventDefault();
    if (!query) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setQuery('');
    }, 3000);
  };

  return (
    <div className="page-container max-w-5xl">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Help & Support Center</h1>
          <p className="page-subtitle">
            Emergency protocols, system usage guide, responder hotlines and frequently asked questions.
          </p>
        </div>
      </div>

      {/* Emergency Hotlines Grid */}
      <div className="grid grid-4 gap-4 mb-6">
        <div className="card stat-card border-left-critical p-4">
          <div className="flex-between align-center mb-2">
            <span className="text-2xl">🚑</span>
            <span className="badge badge-critical">24/7 Hotline</span>
          </div>
          <h4 className="font-bold text-sm">Medical Emergency</h4>
          <div className="font-mono text-lg font-bold text-critical mt-1">+91 98765 43210</div>
          <span className="text-xs text-secondary block mt-1">Medical Center & Doctor on call</span>
        </div>

        <div className="card stat-card border-left-high p-4">
          <div className="flex-between align-center mb-2">
            <span className="text-2xl">👮‍♂️</span>
            <span className="badge badge-high">Security Dispatch</span>
          </div>
          <h4 className="font-bold text-sm">Campus Security</h4>
          <div className="font-mono text-lg font-bold text-high mt-1">+91 98765 43212</div>
          <span className="text-xs text-secondary block mt-1">Main Control Room & Patrol</span>
        </div>

        <div className="card stat-card border-left-medium p-4">
          <div className="flex-between align-center mb-2">
            <span className="text-2xl">🚒</span>
            <span className="badge badge-medium">Fire Rescue</span>
          </div>
          <h4 className="font-bold text-sm">Fire Safety Marshal</h4>
          <div className="font-mono text-lg font-bold text-medium mt-1">+91 98765 43216</div>
          <span className="text-xs text-secondary block mt-1">Fire Response & Equipment</span>
        </div>

        <div className="card stat-card border-left-low p-4">
          <div className="flex-between align-center mb-2">
            <span className="text-2xl">🛠️</span>
            <span className="badge badge-low">Maintenance</span>
          </div>
          <h4 className="font-bold text-sm">Electrical & Plumbing</h4>
          <div className="font-mono text-lg font-bold text-low mt-1">+91 98765 43214</div>
          <span className="text-xs text-secondary block mt-1">Campus Infrastructure Team</span>
        </div>
      </div>

      {/* Main Grid: FAQs & Direct Support Form */}
      <div className="grid grid-12 gap-6">
        {/* FAQs Accordion */}
        <div className="col-span-7 card p-5">
          <div className="card-header border-bottom pb-3 mb-4">
            <h3 className="card-title flex-center gap-2">
              <span>❓</span> Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => (
              <div
                key={index}
                className="border radius-md overflow-hidden bg-subtle"
              >
                <button
                  className="w-full p-3 flex-between align-center text-left font-semibold text-sm hover:bg-hover transition-all"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="flex-center gap-2">
                    <span className="text-accent">Q{index + 1}.</span> {faq.q}
                  </span>
                  <span>{openFaq === index ? '▲' : '▼'}</span>
                </button>
                {openFaq === index && (
                  <div className="p-3 text-xs text-secondary border-top whitespace-pre-line leading-relaxed bg-black-20">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Query Form */}
        <div className="col-span-5 card p-5">
          <div className="card-header border-bottom pb-3 mb-4">
            <h3 className="card-title flex-center gap-2">
              <span>✉️</span> Direct Support Inquiry
            </h3>
          </div>

          {submitted ? (
            <div className="text-center py-8 bg-low-subtle radius-md p-4">
              <div className="text-3xl mb-2">✅</div>
              <h4 className="font-bold text-low">Query Submitted!</h4>
              <p className="text-xs text-secondary mt-1">
                Campus Security Administrator has received your request and will follow up shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitQuery} className="space-y-4">
              <div>
                <label className="form-label">Category</label>
                <select className="form-control form-select text-sm" required>
                  <option value="system">System Guidance & Training</option>
                  <option value="hardware">Emergency Equipment Request</option>
                  <option value="security">Security Patrol Inquiry</option>
                  <option value="other">General Support</option>
                </select>
              </div>

              <div>
                <label className="form-label">Message / Question</label>
                <textarea
                  className="form-control text-sm"
                  rows={4}
                  placeholder="Describe your question or support request..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-full flex-center gap-2">
                <span>✉️</span> Send Inquiry to Control Room
              </button>
            </form>
          )}

          <div className="mt-6 pt-4 border-top text-xs text-secondary space-y-2">
            <div className="flex-between">
              <span>Control Room Operating Hours:</span>
              <span className="font-semibold">24 Hours / 7 Days</span>
            </div>
            <div className="flex-between">
              <span>Admin Email:</span>
              <span className="font-mono text-accent">security@campus.edu</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
