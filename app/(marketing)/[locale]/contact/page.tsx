import { getDictionary } from "@/lib/dictionary"
import type { Locale } from "@/lib/i18n-config"
import ContactForm from "@/components/ui/contact-form"
import SectionWrapper from "@/components/ui/section-wrapper"
import { Mail, MapPin, Phone } from "lucide-react"

export default async function ContactPage({
  params: { locale },
}: {
  params: { locale: Locale }
}) {
  const dict = await getDictionary(locale)

  // Default contact form dictionary
  const contactFormDict = {
    name: "Name",
    email: "Email",
    message: "Message",
    submit: "Send Message",
    success: "Your message has been sent successfully. We'll get back to you soon!",
    error: "There was an error sending your message. Please try again.",
  }

  return (
    <>
      <SectionWrapper className="bg-gray-50">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions about our programs or want to learn more? Get in touch with our team.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
            <div className="mx-auto w-12 h-12 flex items-center justify-center bg-primary/10 rounded-full mb-4">
              <Phone className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2">Phone</h3>
            <p className="text-gray-600">+1 (555) 123-4567</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
            <div className="mx-auto w-12 h-12 flex items-center justify-center bg-primary/10 rounded-full mb-4">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2">Email</h3>
            <p className="text-gray-600">info@zetaonline.com</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
            <div className="mx-auto w-12 h-12 flex items-center justify-center bg-primary/10 rounded-full mb-4">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2">Address</h3>
            <p className="text-gray-600">123 Education St, Learning City, 10001</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
            <ContactForm dictionary={contactFormDict} />
          </div>

          <div className="h-96 bg-gray-200 rounded-lg overflow-hidden">
            {/* This would be replaced with an actual map component */}
            <div className="w-full h-full flex items-center justify-center text-gray-500">Map placeholder</div>
          </div>
        </div>
      </SectionWrapper>
    </>
  )
}

