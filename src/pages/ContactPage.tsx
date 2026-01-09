import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

interface FAQItem {
    question: string;
    answer: string;
}

const faqItems: FAQItem[] = [{
    question: "What is the minimum order quantity for custom tin packaging?",
    answer: "Our minimum order quantity (MOQ) for custom tin packaging is typically 1,000 units. However, this can vary depending on the specific product type, size, and customization requirements. Please contact our sales team for detailed information based on your specific needs.",
    icon: "box"
}, {
    question: "What is the lead time for production?",
    answer: "Standard lead time for production is 3-4 weeks after artwork approval and deposit confirmation. For rush orders, we may be able to accommodate shorter lead times depending on our production schedule. Please discuss your timeline requirements with our sales team.",
    icon: "clock"
}, {
    question: "Can I request samples before placing a bulk order?",
    answer: "Yes, we offer sample services. You can request standard samples or custom samples with your design. Standard samples are usually free of charge, but there may be a fee for custom samples. Shipping costs for samples are the responsibility of the customer.",
    icon: "vial"
}, {
    question: "What file formats do you accept for custom designs?",
    answer: "We prefer vector file formats such as AI (Adobe Illustrator), EPS, or PDF with embedded fonts. For images, high-resolution JPG or PNG files (minimum 300 DPI) are acceptable. Please ensure that all text is converted to outlines in vector files to avoid font issues.",
    icon: "file-alt"
}, {
    question: "Do you offer international shipping?",
    answer: "Yes, we ship our products worldwide. We work with reliable freight forwarders to ensure safe and timely delivery. Shipping costs will vary depending on the destination, shipment size, and shipping method. Our sales team can provide you with detailed shipping quotes.",
    icon: "globe"
}];

export default function ContactPage() {
    const [formData, setFormData] = useState<ContactFormData>({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    interface FAQItem {
        question: string;
        answer: string;
        icon?: string;
    }

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {
            name,
            value
        } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            toast.success("Thank you for your message! We will get back to you soon.");

            setFormData({
                name: "",
                email: "",
                subject: "",
                message: ""
            });
        } catch (error) {
            toast.error("An error occurred while submitting your message. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleFAQ = (index: number) => {
        setExpandedFAQ(expandedFAQ === index ? null : index);
    };

    return (
        <div
            className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
            <Navbar />
            {}
            <section
                className="relative h-72 bg-gradient-to-r from-blue-600 to-blue-800 overflow-hidden">
                <div className="absolute inset-0 flex items-center">
                    <div className="container mx-auto px-4">
                        <motion.h1
                            initial={{
                                opacity: 0,
                                y: 20
                            }}
                            animate={{
                                opacity: 1,
                                y: 0
                            }}
                            transition={{
                                duration: 0.7
                            }}
                            className="text-4xl md:text-5xl font-bold text-white mb-4">Contact Us
                                                                                                                                                                                                                </motion.h1>
                        <motion.p
                            initial={{
                                opacity: 0,
                                y: 20
                            }}
                            animate={{
                                opacity: 1,
                                y: 0
                            }}
                            transition={{
                                duration: 0.7,
                                delay: 0.2
                            }}
                            className="text-xl text-white/90 max-w-2xl">Have questions or need assistance? Our team is here to help.
                                                                                                                                                                                                                </motion.p>
                    </div>
                </div>
            </section>
            {}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <SectionHeader
                        title="Get In Touch"
                        subtitle="Contact us for inquiries, quotes, or any other questions you may have" />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {}
                        <motion.div
                            initial={{
                                opacity: 0,
                                x: -50
                            }}
                            whileInView={{
                                opacity: 1,
                                x: 0
                            }}
                            viewport={{
                                once: true
                            }}
                            transition={{
                                duration: 0.7
                            }}
                            className="space-y-8">
                            <div
                                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md"
                                style={{
                                    padding: "52px"
                                }}>
                                <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                                <div className="space-y-6">
                                    <div className="flex items-start">
                                        <div
                                            className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-4 flex-shrink-0">
                                            <i
                                                className="fas fa-map-marker-alt text-blue-600 dark:text-blue-400 text-xl"></i>
                                        </div>
                                        <div>
                                            <h4 className="font-bold mb-1">Our Location</h4>
                                            <p className="text-gray-600 dark:text-gray-300">123 Dongyuan Avenue, shiPai Town, Dongguan City, Guangdong Province,China
                                                                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div
                                            className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-4 flex-shrink-0">
                                            <i className="fas fa-phone-alt text-blue-600 dark:text-blue-400 text-xl"></i>
                                        </div>
                                        <div>
                                            <h4 className="font-bold mb-1">Phone</h4>
                                            <p className="text-gray-600 dark:text-gray-300">+86 13826956953
                                                                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div
                                            className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-4 flex-shrink-0">
                                            <i className="fas fa-envelope text-blue-600 dark:text-blue-400 text-xl"></i>
                                        </div>
                                        <div>
                                            <h4 className="font-bold mb-1">Email</h4>
                                            <p className="text-gray-600 dark:text-gray-300">jancy@tinshine.com
                                                                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-xl overflow-hidden shadow-md">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1835.5451042947493!2d113.9656956356322!3d23.057154151025404!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1szh-CN!2snl!4v1767921276061!5m2!1szh-CN!2snl"
                                    width="100%"
                                    height="450"
                                    style={{
                                        border: 0
                                    }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="w-full h-[450px]"></iframe>
                             </div>
                            <div className="flex justify-center items-center flex-wrap gap-6"
                                style={{
                                    margin: "50px 20px",
                                    padding: "20px"
                                }}>
                                <div className="flex flex-col items-center">
                                    <a
                                        href="#"
                                        className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-blue-600 hover:text-white transition-colors duration-300 mb-2">
                                        <i className="fab fa-facebook-f text-3xl"></i>
                                    </a>
                                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">Facebook</p>
                                </div>
                                <div className="flex flex-col items-center">
                                    <a
                                        href="#"
                                        className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-blue-400 hover:text-white transition-colors duration-300 mb-2">
                                        <i className="fab fa-twitter text-3xl"></i>
                                    </a>
                                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">Twitter</p>
                                </div>
                                <div className="flex flex-col items-center">
                                    <a
                                        href="#"
                                        className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-pink-500 hover:text-white transition-colors duration-300 mb-2">
                                        <i className="fab fa-instagram text-3xl"></i>
                                    </a>
                                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">Instagram</p>
                                </div>
                                <div className="flex flex-col items-center">
                                    <a
                                        href="#"
                                        className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-blue-700 hover:text-white transition-colors duration-300 mb-2">
                                        <i className="fab fa-linkedin text-3xl"></i>
                                    </a>
                                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">LinkedIn</p>
                                </div>
                                <div className="flex flex-col items-center">
                                    <img 
                                        src="https://lf-code-agent.coze.cn/obj/x-ai-cn/320719794690/attachment/Jancy WhatsApp_20260109095553.png" 
                                        alt="WhatsApp QR Code" 
                                        className="w-24 h-24 rounded-lg shadow-md mb-2"
                                    />
                                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">WhatsApp</p>
                                </div>
                            </div>
                        </motion.div>
                        {}
                        <div className="space-y-8">
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    x: 50
                                }}
                                whileInView={{
                                    opacity: 1,
                                    x: 0
                                }}
                                viewport={{
                                    once: true
                                }}
                                transition={{
                                    duration: 0.7
                                }}>
                                <div
                                    className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md"
                                    style={{
                                        padding: "10px"
                                    }}>
                                    <h3 className="text-2xl font-bold mb-6">Send Us a Message</h3>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <label
                                                htmlFor="name"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Name
                                                                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 dark:text-white" />
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="email"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address
                                                                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 dark:text-white" />
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="subject"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject
                                                                                            </label>
                                            <input
                                                type="text"
                                                id="subject"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 dark:text-white" />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                                            {isSubmitting ? <>
                                                <i className="fas fa-spinner fa-spin mr-2"></i>Sending...
                                                                                            </> : "Send Message"}
                                        </button>
                                    </form>
                                </div>
                            </motion.div>
                            {}
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    y: 20
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0
                                }}
                                viewport={{
                                    once: true
                                }}
                                transition={{
                                    duration: 0.7,
                                    delay: 0.2
                                }}
                                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
                                <SectionHeader
                                    title="Frequently Asked Questions"
                                    subtitle="Find answers to common questions"
                                    align="left" />
                                <div className="space-y-4">
                                    {faqItems.map((item, index) => <motion.div
                                        key={index}
                                        initial={{
                                            opacity: 0,
                                            y: 20
                                        }}
                                        whileInView={{
                                            opacity: 1,
                                            y: 0
                                        }}
                                        viewport={{
                                            once: true
                                        }}
                                        transition={{
                                            duration: 0.5,
                                            delay: index * 0.1
                                        }}
                                        className="bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center p-6 text-left focus:outline-none">
                  <div className="flex items-center">
                    {item.icon && (
                      <i className={`fas fa-${item.icon} mr-3 text-blue-600 dark:text-blue-400`}></i>
                    )}
                    <h4 className="text-lg font-medium">{item.question}</h4>
                  </div>
                  <i
                      className={`fas fa-chevron-down transition-transform duration-300 ${expandedFAQ === index ? "transform rotate-180" : ""}`}></i>
                </button>
                                        <motion.div
                                            initial={{
                                                height: 0,
                                                opacity: 0
                                            }}
                                            animate={{
                                                height: expandedFAQ === index ? "auto" : 0,
                                                opacity: expandedFAQ === index ? 1 : 0
                                            }}
                                            transition={{
                                                duration: 0.3
                                            }}
                                            className="overflow-hidden">
                                            <div className="px-6 pb-6 text-gray-600 dark:text-gray-300">
                                                {item.answer}
                                            </div>
                                        </motion.div>
                                    </motion.div>)}
                                </div>
                                <div className="text-center mt-10">
                                    <p className="text-gray-600 dark:text-gray-300 mb-4">Can't find the answer you're looking for?
                                                                            </p>
                                    <button
                                        onClick={() => document.getElementById("name")?.focus()}
                                        className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300 shadow-md">Contact Our Support Team
                                                                                <i className="fas fa-arrow-right ml-2"></i>
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}