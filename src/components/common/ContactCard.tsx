import React, { useState, memo, useRef, useCallback } from "react";
import { getCurrentContactFormConfig } from "../../config/contactFormConfig";

interface ContactCardPropsType {
  setIsModalShow?: React.Dispatch<React.SetStateAction<boolean>>;
  showEmail?: boolean;
  useConfig?: boolean;
}

interface FormData {
  name: string;
  mobile: string;
  email: string;
  consent: boolean;
}

interface DownloadState {
  isLoading: boolean;
  error: string | null;
}

const PDF_URL = '/Moonglade-Brochure.pdf';
const PDF_FILENAME = 'Moonglade-Brochure.pdf';

function ContactCard({
  setIsModalShow,
  showEmail,
  useConfig,
}: ContactCardPropsType) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    mobile: "",
    email: "",
    consent: false,
  });
  
  const [downloadState, setDownloadState] = useState<DownloadState>({
    isLoading: false,
    error: null,
  });
  
  const formRef = useRef<HTMLFormElement>(null);

  const shouldShowEmail = useConfig
    ? getCurrentContactFormConfig().showEmail
    : showEmail;

  const isFormValid = useCallback(() => {
    const { name, mobile, consent } = formData;
    const emailRequired = shouldShowEmail ? formData.email : true;
    
    return name.trim() && mobile.trim() && consent && emailRequired;
  }, [formData, shouldShowEmail]);

  const validateForm = useCallback(() => {
    if (!formRef.current) return false;
    
    if (!formRef.current.checkValidity()) {
      formRef.current.reportValidity();
      return false;
    }
    
    return true;
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      name: "",
      mobile: "",
      email: "",
      consent: false,
    });
    setDownloadState({ isLoading: false, error: null });
  }, []);

  const handleInputChange = useCallback((field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    if (downloadState.error) {
      setDownloadState(prev => ({ ...prev, error: null }));
    }
  }, [downloadState.error]);

  const checkPdfAvailability = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch(PDF_URL, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.error('Error checking PDF availability:', error);
      return false;
    }
  }, []);

  const downloadPdf = useCallback(async (): Promise<boolean> => {
    try {
      const link = document.createElement('a');
      link.href = PDF_URL;
      link.download = PDF_FILENAME;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return true;
    } catch (error) {
      console.error('Error downloading PDF:', error);
      return false;
    }
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      alert("Please fill in all fields and provide consent before submitting.");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setDownloadState({ isLoading: true, error: null });

    try {
      const isAvailable = await checkPdfAvailability();
      
      if (!isAvailable) {
        throw new Error('PDF file is not available on site');
      }

      const downloadSuccess = await downloadPdf();
      
      if (!downloadSuccess) {
        throw new Error('Failed to download PDF');
      }

      alert(
        "Thank you for contacting us! We have received your details and will get back to you soon. The brochure is being downloaded."
      );
      
      resetForm();
      setIsModalShow?.(false);
      
    } catch (error) {
      console.error('Form submission error:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred. Please try again later.';
      
      setDownloadState({ 
        isLoading: false, 
        error: errorMessage 
      });
      
      alert(`Error: ${errorMessage}`);
    }
  }, [isFormValid, validateForm, checkPdfAvailability, downloadPdf, resetForm, setIsModalShow]);

  return (
    <section
      className="w-[237px] md:w-[300px] lg:w-[350px] xl:w-[521px] bg-contactFormBG/80 rounded-xl shadow-lg p-4 sm:p-6 md:p-8 lg:p-10 backdrop-blur-lg"
      aria-label="Contact Form"
    >
      <form
        ref={formRef}
        className="flex flex-col gap-6"
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        {/* Header */}
        <div className="flex flex-col justify-center">
          <span className="font-['Prata'] text-primaryTitleText font-normal text-[14px] md:text-[40px] leading-normal tracking-normal">
            Be seen at
          </span>
          <span className="font-['Prata'] font-normal text-[24px] md:text-[50px] leading-normal tracking-normal text-primaryTitleText">
            Moonglade
          </span>
        </div>

        {/* Name Field */}
        <div>
          <label
            className="block text-primaryTitleText font-['Prata'] font-normal not-italic text-12px leading-[100%] tracking-[0] mb-2 md:text-24px"
            htmlFor="name"
          >
            Name:
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full font-['Prata'] font-normal not-italic text-12px md:text-24px leading-[100%] tracking-[0] text-placeholderText bg-transparent border-0 border-b-2 border-bgPrimary focus:ring-0 focus:border-bgPrimary placeholder:text-placeholderText pb-3 pl-1 outline-none"
            required
            aria-required="true"
            disabled={downloadState.isLoading}
          />
        </div>

        {/* Email Field (Conditional) */}
        {shouldShowEmail && (
          <div>
            <label
              className="block text-primaryTitleText font-['Prata'] font-normal not-italic text-12px leading-[100%] tracking-[0] mb-2 md:text-24px"
              htmlFor="email"
            >
              Email ID:
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full font-['Prata'] font-normal not-italic text-12px md:text-24px leading-[100%] tracking-[0] text-placeholderText bg-transparent border-0 border-b-2 border-bgPrimary focus:ring-0 focus:border-bgPrimary placeholder:text-placeholderText pb-3 pl-1 outline-none"
              required
              aria-required="true"
              disabled={downloadState.isLoading}
            />
          </div>
        )}

        {/* Mobile Field */}
        <div>
          <label
            className="block text-primaryTitleText font-['Prata'] font-normal not-italic text-12px leading-[100%] tracking-[0] mb-2 md:text-24px"
            htmlFor="mobile"
          >
            Mobile Number:
          </label>
          <input
            id="mobile"
            type="tel"
            value={formData.mobile}
            onChange={(e) => handleInputChange('mobile', e.target.value)}
            className="w-full font-['Prata'] font-normal not-italic text-14px md:text-24px leading-[100%] tracking-[0] text-placeholderText bg-transparent border-0 border-b-2 border-bgPrimary focus:ring-0 focus:border-bgPrimary placeholder:text-placeholderText pb-3 pl-1 outline-none"
            required
            aria-required="true"
            pattern="[0-9+\- ]{10,15}"
            disabled={downloadState.isLoading}
          />
        </div>

        {/* Consent Checkbox */}
        <div className="flex gap-3 justify-start items-start">
          <input
            id="consent"
            type="checkbox"
            checked={formData.consent}
            onChange={(e) => handleInputChange('consent', e.target.checked)}
            className="mt-1 bg-transparent rounded border border-bgPrimary"
            required
            aria-required="true"
            disabled={downloadState.isLoading}
          />
          <label
            htmlFor="consent"
            className="font-['Prata'] font-normal not-italic text-[6px] md:text-12px text-primaryTitleText"
          >
            I authorize representatives of IRA Aspiration to call, SMS, Email,
            or WhatsApp me about its products and offers. This consent overrides
            any registration for DNC/NDNC.
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex justify-start">
          <button
            className={`font-['Prata'] text-primaryTitleText shadow-sm font-bold rounded-full text-9px leading-11px md:text-lg lg:text-xl tracking-tighter border-[0.58px] border-bgPrimary px-3 py-1 md:px-6 md:py-2 lg:px-8 lg:py-2 ${
              downloadState.isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            type="submit"
            disabled={downloadState.isLoading}
            aria-label={downloadState.isLoading ? 'Submitting form...' : 'Submit form'}
          >
            {downloadState.isLoading ? 'Submitting...' : 'Submit'}
          </button>
        </div>

        {/* Error Display */}
        {downloadState.error && (
          <div className="text-red-500 text-sm font-['Prata']">
            {downloadState.error}
          </div>
        )}
      </form>
    </section>
  );
}

export default memo(ContactCard);
