'use client';

import React, { useState } from 'react';
import { MdLocalPhone } from "react-icons/md";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import Image from "next/image";
import SectionBackground from './SectionBackground';

// --- Type Definitions ---
interface IconLinkProps {
href: string;
icon: React.ElementType;
label: string;
}

interface FormFieldProps {
label: string;
children: React.ReactNode;
className?: string;
}
// --- End Type Definitions ---


const IconLink: React.FC<IconLinkProps> = ({ href, icon: IconComponent, label }) => (
<a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="icon-link mx-3 transition-transform duration-300 hover:translate-y-[-5px]"
    aria-label={label}
    title={label}
>
    <IconComponent className="w-6 h-6" />
</a>
);

const FormField: React.FC<FormFieldProps> = ({ label, children, className }) => (
<div className="mb-6">
    {/* Label: Uses secondary text color and font-secondary */}
    <label className="block text-sm font-semibold mb-2 uppercase text-[var(--secondary-text)] font-[var(--font-secondary)]">
    {label}
    </label>
    {/* Input Container: Uses accent color as background */}
    <div className={`p-1 rounded-[var(--radius)] bg-[var(--accent)] ${className ?? ''}`}>
    {children}
    </div>
</div>
);

/**
 * Main component to display the Contact Section.
 */
export const ContactSection: React.FC = () => {
const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
const [feedback, setFeedback] = useState<string>('');

const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setFeedback('');

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Build JSON payload from form data
    const payload = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        message: formData.get('message') as string,
    };

    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json' 
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (response.ok && data.ok) {
            form.reset();
            setStatus('success');
            setFeedback('Thanks! Your message has been delivered.');
        } else {
            setStatus('error');
            setFeedback(data?.errors?.join(', ') ?? 'Submission failed. Please try again.');
        }
    } catch (error) {
        console.error('Form submission error', error);
        setStatus('error');
        setFeedback('Network error. Please try again.');
    }
};

return (
    <section className="reveal-section py-12 sm:py-16 md:py-20 bg-[var(--background)] font-[var(--font-secondary)] min-h-screen relative" id="contact">
        <div className="text-number absolute top-5 right-0 -mt-0 -ml-0 text-[var(--secondary-text)] transform -rotate-270 text-6xl hidden md:block">
            04
        </div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header/Section Numbering */}
        <div className="mb-4">            
            {/* Contact Me Label */}
            <h4 className="body-text-b text-right reveal-el">
                Contact Me
            </h4>
            <div className="h-px bg-[var(--secondary-text)] ml-auto max-w-[565px] reveal-el"/>
        </div>

        {/* --- Main Content Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-start">
        
            {/* Left Column: Logo and Social Links */}
            <div className="flex flex-col items-center justify-center justify-self-center self-center pt-6 sm:pt-10 pb-12 sm:pb-16 lg:pb-0 lg:pt-0 reveal-el">
                {/* Logo/Monogram: Uses h1 style, accent color */}
                <Image src="/assets/K.svg" alt="Logo" width={100} height={100} className='mb-6 sm:mb-8'/>
                
                {/* Social Icons */}
                <div className="flex justify-center mb-8 pop-on-scroll">
                <IconLink href="https://www.linkedin.com/in/karim-massaoud" icon={FaLinkedin} label="LinkedIn" />
                <IconLink href="tel:0616537940" icon={MdLocalPhone} label="Call" />
                <IconLink href="https://github.com/ic0nk" icon={FaGithub} label="GitHub" />
                <IconLink href="mailto:karimmassoud668@gmail.com" icon={IoMdMail} label="Email" />
                </div>
                
                {/* Tagline: Uses secondary text color and body-text-r style */}
                <p className="text-base text-[var(--secondary-text)] font-[var(--font-secondary)] reveal-el">
                    Let's Build Something Great Together
                </p>
            </div>
            
            {/* Right Column: Contact Form */}
            <div className="w-full reveal-el">
                
                {/* Title: Uses h2 style, secondary-text color */}
                <h3 className="text-2xl sm:text-3xl md:text-4xl text-left font-primary mb-8 sm:mb-12 max-w-[565px] w-full ml-auto pop-on-scroll">
                GET IN TOUCH FOR PROJECTS AND PARTNERSHIPS
                </h3>

                <form onSubmit={handleSubmit}>
                
                {/* Name Field */}
                <FormField label="NAME" className="bg-[var(--accent)]">
                    <input suppressHydrationWarning
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    className="w-full py-2.5 sm:py-3 px-3 sm:px-4 rounded-[var(--radius-sm)] border-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--background)] text-[var(--text)] body-text-r"
                    required
                    />
                </FormField>

                {/* Email Field */}
                <FormField label="YOUR EMAIL">
                    <input suppressHydrationWarning
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    className="w-full py-2.5 sm:py-3 px-3 sm:px-4 rounded-[var(--radius-sm)] border-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--background)] text-[var(--text)] body-text-r"
                    required
                    />
                </FormField>
                
                {/* Phone Field */}
                <FormField label="PHONE">
                    <input suppressHydrationWarning
                    type="tel"
                    name="phone"
                    placeholder="Your Number"
                    className="w-full py-2.5 sm:py-3 px-3 sm:px-4 rounded-[var(--radius-sm)] border-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--background)] text-[var(--text)] body-text-r"
                    />
                </FormField>
                
                {/* Message Field */}
                <FormField label="YOUR MESSAGE">
                    <textarea suppressHydrationWarning
                    name="message"
                    placeholder="Tell me all what you want...."
                    rows={6}
                    className="w-full py-2.5 sm:py-3 px-3 sm:px-4 rounded-[var(--radius-sm)] border-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--background)] text-[var(--text)] body-text-r resize-none"
                    required
                    />
                </FormField>

                {/* Submit Button */}
                <button suppressHydrationWarning
                    type="submit"
                    disabled={status === 'loading'}
                    className="btn btn-primary w-full mt-4 pop-on-scroll disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {status === 'loading' ? 'Sending…' : 'SEND TO ME'}
                </button>
                {feedback ? (
                    <p className={`mt-3 text-sm ${status === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                        {feedback}
                    </p>
                ) : null}
                </form>
            </div>
        </div>
        
    </div>
    </section>
);
};

export default ContactSection;
