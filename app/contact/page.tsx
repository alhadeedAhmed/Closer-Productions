'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null as string | null }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(prevStatus => ({ ...prevStatus, submitting: true }));
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message');
      }
      
      if (result.previewUrl) {
        console.log('Email Preview URL:', result.previewUrl);
        console.log('Open this URL to see how the email looks');
      }
      
      setStatus({
        submitted: true,
        submitting: false,
        info: { error: false, msg: 'Thank you! Your message has been sent successfully.' }
      });
      
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus({
        submitted: false,
        submitting: false,
        info: { error: true, msg: error instanceof Error ? error.message : 'Something went wrong. Please try again later.' }
      });
    }

  };

  return (
    <main className="min-h-screen bg-[#FEFAF7] dark:bg-gray-900 flex flex-col transition-colors duration-300">
      <div className="flex-grow flex items-start md:items-center justify-center p-6 md:p-10 pt-0 md:pt-4">
        <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-10 mt-4 md:mt-0 transition-colors duration-300 border border-gray-100 dark:border-gray-700">
          
          <div className="text-center mb-10 relative">
            {/* <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-[#AB75FF] to-[#6B44EC] rounded-full flex items-center justify-center shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div> */}
            <h1 className="text-3xl md:text-4xl font-bold text-center mt-6 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#7651DB] to-[#AB75FF] dark:from-[#AB75FF] dark:to-[#7651DB]">Get in Touch</h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
              We&apos;d love to hear from you! Fill out the form below and our team will get back to you as soon as possible.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="group">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 group-hover:text-[#7651DB] dark:group-hover:text-[#AB75FF] transition-colors duration-200">
                  Your Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-[#7651DB] dark:group-hover:text-[#AB75FF] transition-colors duration-200" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7651DB] focus:border-[#7651DB] shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 hover:border-[#7651DB] dark:hover:border-[#AB75FF]"
                    placeholder="John Doe"
                  />
                </div>
              </div>
              
              <div className="group">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 group-hover:text-[#7651DB] dark:group-hover:text-[#AB75FF] transition-colors duration-200">
                  Your Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-[#7651DB] dark:group-hover:text-[#AB75FF] transition-colors duration-200" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7651DB] focus:border-[#7651DB] shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 hover:border-[#7651DB] dark:hover:border-[#AB75FF]"
                    placeholder="johndoe@example.com"
                  />
                </div>
              </div>
            </div>
            
            <div className="group">
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 group-hover:text-[#7651DB] dark:group-hover:text-[#AB75FF] transition-colors duration-200">
                Subject
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-[#7651DB] dark:group-hover:text-[#AB75FF] transition-colors duration-200" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7651DB] focus:border-[#7651DB] shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 hover:border-[#7651DB] dark:hover:border-[#AB75FF] appearance-none"
                  style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundPosition: "right 0.5rem center", backgroundRepeat: "no-repeat", backgroundSize: "1.5em 1.5em", paddingRight: "2.5rem" }}
                >
                  <option value="" disabled>Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="group">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 group-hover:text-[#7651DB] dark:group-hover:text-[#AB75FF] transition-colors duration-200">
                Message
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-[#7651DB] dark:group-hover:text-[#AB75FF] transition-colors duration-200" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                  </svg>
                </div>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7651DB] focus:border-[#7651DB] shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 hover:border-[#7651DB] dark:hover:border-[#AB75FF]"
                  placeholder="Your message here..."
                ></textarea>
              </div>
            </div>
            
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={status.submitting}
                className="px-10 py-4 bg-gradient-to-r from-[#7651DB] to-[#AB75FF] text-white rounded-full text-base md:text-lg font-medium transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#7651DB] focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none w-full max-w-[300px]"
              >
                {status.submitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </div>
                ) : 'Send Message'}
              </button>
            </div>
            
            {status.info.msg && (
              <div className={`mt-6 text-center p-4 rounded-xl border ${status.info.error ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800/30' : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-800/30'} animate-fadeIn`}>
                <div className="flex items-center justify-center">
                  {status.info.error ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                  {status.info.msg}
                </div>
              </div>
            )}
            
            <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6 border-t border-gray-100 dark:border-gray-700 pt-6">
              <p className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-[#7651DB] dark:text-[#AB75FF]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Your data is secure and will never be shared with third parties
              </p>
              <p className="mt-2">We&apos;ll get back to you within 24-48 hours</p>
            </div>
          </form>
          
          <div className="absolute top-10 right-10 w-20 h-20 bg-[#7651DB]/10 rounded-full -z-10 dark:bg-[#7651DB]/5"></div>
          <div className="absolute bottom-10 left-10 w-32 h-32 bg-[#AB75FF]/10 rounded-full -z-10 dark:bg-[#AB75FF]/5"></div>
        </div>
      </div>
    </main>
  );
} 
