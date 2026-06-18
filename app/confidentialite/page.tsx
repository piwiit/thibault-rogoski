import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'Politique de Confidentialité | Thibault Rogoski',
  description: 'Politique de confidentialité et protection des données personnelles (RGPD) de l\'entreprise Thibault Rogoski.',
};

export default function ConfidentialitePage() {
  const dateStr = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="px-4 mx-auto max-w-4xl sm:px-6 lg:px-8">
          <h1 className="mb-8 text-4xl font-bold text-gray-900">Politique de Confidentialité</h1>
          
          <p className="mb-8 text-sm text-gray-500 italic">Dernière mise à jour : {dateStr}</p>

          <div className="prose prose-green max-w-none text-gray-700 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <p>
                La présente Politique de Confidentialité définit la manière dont l'entreprise de <strong>Thibault Rogoski</strong> utilise et protège les informations que vous nous transmettez lorsque vous utilisez le présent site accessible à l'adresse : thibaultrogoski.com.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Responsable du traitement des données</h2>
              <p>
                Le responsable du traitement des données à caractère personnel est :<br />
                <strong>Thibault Rogoski</strong><br />
                Email : thibaultrogoski@hotmail.com
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Données collectées</h2>
              <p>Nous collectons les données suivantes via notre formulaire de contact ou l'interface d'administration :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Identité :</strong> Nom, prénom.</li>
                <li><strong>Coordonnées :</strong> Adresse email.</li>
                <li><strong>Contenu :</strong> Message envoyé via le formulaire de contact.</li>
                <li><strong>Données techniques :</strong> Cookies de session (uniquement pour l'accès administrateur).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Finalités du traitement</h2>
              <p>Les données sont collectées pour les raisons suivantes :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Répondre à vos demandes de devis ou d'informations.</li>
                <li>Gestion de l'affichage des projets (pour l'administrateur).</li>
                <li>Amélioration de l'expérience utilisateur sur le site.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Base juridique</h2>
              <p>Le traitement de vos données est basé sur :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Votre consentement :</strong> Lorsque vous envoyez un message via le formulaire de contact.</li>
                <li><strong>L'intérêt légitime :</strong> Pour la gestion des prospects et la présentation des travaux réalisés.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Destinataires des données</h2>
              <p>
                Vos données sont strictement confidentielles et ne sont jamais vendues à des tiers. Elles sont toutefois traitées par nos prestataires techniques nécessaires au fonctionnement du site :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Vercel :</strong> Hébergement du site.</li>
                <li><strong>Supabase :</strong> Stockage de la base de données et des images.</li>
                <li><strong>Meta (Facebook) :</strong> Uniquement si vous interagissez avec les fonctions de partage social.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Durée de conservation</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Données de contact :</strong> Les données sont conservées pendant une durée maximale de 3 ans après le dernier contact.</li>
                <li><strong>Données administrateur :</strong> Conservées tant que le compte est actif.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Vos droits (RGPD)</h2>
              <p>Conformément à la réglementation européenne, vous disposez des droits suivants :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Droit d'accès et de communication de vos données.</li>
                <li>Droit de rectification de vos données.</li>
                <li>Droit d'effacement (droit à l'oubli).</li>
                <li>Droit de limitation du traitement.</li>
                <li>Droit d'opposition au traitement.</li>
              </ul>
              <p className="mt-4">
                Pour exercer ces droits, vous pouvez nous contacter par email à : <strong>thibaultrogoski@hotmail.com</strong>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Cookies</h2>
              <p>
                Le site utilise des cookies techniques essentiels au fonctionnement de l'espace administration. Ces cookies ne sont pas utilisés à des fins publicitaires ou de traçage comportemental.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Sécurité</h2>
              <p>
                Nous mettons en œuvre des mesures de sécurité appropriées (HTTPS, hachage des mots de passe) pour protéger vos données contre tout accès, modification ou divulgation non autorisés.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
