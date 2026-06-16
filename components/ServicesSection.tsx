"use client";
import { motion } from 'framer-motion';
import type { LandingContent } from '@/lib/landing';

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.15,
            duration: 0.5,
        },
    }),
};

interface ServicesSectionProps {
    content: LandingContent;
}

export default function ServicesSection({ content }: ServicesSectionProps) {
    const { services } = content;

    return (
        <section className="py-20 bg-white" aria-labelledby="services-title">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16 text-center"
                >
                    <h2 id="services-title" className="mb-4 text-4xl font-bold text-gray-900">
                        {services.title}
                    </h2>
                    <p className="max-w-2xl mx-auto text-xl text-gray-600">
                        {services.subtitle}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {services.items.map((service, index) => (
                        <motion.div
                            key={`${service.title}-${index}`}
                            custom={index}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={cardVariants}
                            whileHover={{ y: -8 }}
                            className="overflow-hidden transition-shadow duration-300 bg-white border border-gray-200 shadow-lg rounded-2xl hover:shadow-2xl"
                        >
                            <div className={`h-2 bg-gradient-to-r ${service.color}`}></div>
                            <div className="p-8">
                                <div className="mb-4 text-5xl">{service.icon}</div>
                                <h3 className="mb-2 text-2xl font-bold text-gray-900">
                                    {service.title}
                                </h3>
                                <p className="mb-6 text-gray-600">{service.description}</p>
                                <ul className="space-y-2">
                                    {service.items.map((item, i) => (
                                        <li key={i} className="flex items-center text-gray-700">
                                            <svg
                                                className="w-5 h-5 mr-2 text-green-600"
                                                fill="none"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path d="M5 13l4 4L19 7"></path>
                                            </svg>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
