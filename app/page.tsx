"use client";
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  const services = [
    {
      title: 'Terrassement',
      icon: '🚜',
      description: 'Excavation, fondations, préparation de terrain',
      items: ['Excavation', 'Fondation tranchée', 'Béton lavé', 'Nivellement'],
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'VRD',
      icon: '🛠️',
      description: 'Voirie et Réseaux Divers',
      items: ['Assainissement', 'Canalisation', 'Réseaux secs', 'Voirie'],
      color: 'from-orange-500 to-orange-600',
    },
    {
      title: 'Entretien Paysager',
      icon: '🌳',
      description: 'Entretien régulier de vos espaces verts',
      items: ['Tonte', 'Taille', 'Désherbage', 'Soins des plantations'],
      color: 'from-green-500 to-green-600',
    },
  ];

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

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-1 pt-16">
        <Hero />

        {/* Section Services */}
        <section className="py-20 bg-white">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16 text-center"
            >
              <h2 className="mb-4 text-4xl font-bold text-gray-900">
                Nos Prestations
              </h2>
              <p className="max-w-2xl mx-auto text-xl text-gray-600">
                Des services professionnels pour tous vos projets d&apos;aménagement extérieur
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
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

        {/* Section CTA */}
        <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600">
          <div className="max-w-4xl px-4 mx-auto text-center sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-4 text-4xl font-bold text-white">
                Prêt à démarrer votre projet ?
              </h2>
              <p className="mb-8 text-xl text-green-50">
                Contactez-nous pour un devis gratuit et sans engagement
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  href="/contact"
                  className="px-8 py-4 text-lg font-semibold text-green-600 transition-all duration-300 bg-white rounded-lg shadow-lg hover:bg-gray-50 hover:scale-105"
                >
                  Demander un devis
                </Link>
                <Link
                  href="/projets"
                  className="px-8 py-4 text-lg font-semibold text-white transition-all duration-300 border-2 border-white rounded-lg hover:bg-white/10"
                >
                  Voir nos réalisations
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
