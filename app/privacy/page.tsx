import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

export const metadata = {
  title: 'Politique de Confidentialité — Shoply',
  description: 'Politique de confidentialité de la plateforme Shoply.',
};

export default function PrivacyPage() {
  return (
    <main>
      <Navbar />

      <div className="relative bg-gradient-to-br from-[#F0F7FF] via-white to-[#EAF3FF] dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 pt-28 pb-12 px-4 text-center border-b border-gray-100 dark:border-gray-800">
        <h1 className="text-3xl sm:text-4xl font-black text-[#0D1B3E] dark:text-white mb-3">Politique de Confidentialité</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Dernière mise à jour : 12 juin 2026</p>
      </div>

      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto flex flex-col gap-8 text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">

          <div>
            <p>
              La présente politique explique quelles données Shoply (myshoply.web.app) collecte, pourquoi, et
              comment elles sont utilisées et protégées. En utilisant Shoply, vous acceptez cette politique.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-[#0D1B3E] dark:text-white mb-3">1. Données que nous collectons</h2>
            <ul className="list-disc pl-5 flex flex-col gap-2">
              <li><strong>Compte :</strong> adresse email, mot de passe (chiffré), nom et informations de la boutique.</li>
              <li><strong>Boutique :</strong> produits, descriptions, prix, images, catégories ajoutés par le vendeur.</li>
              <li><strong>Commandes :</strong> nom, numéro de téléphone et adresse du client final, détails de la commande.</li>
              <li><strong>Paiement :</strong> numéros Mobile Money pour recevoir les paiements. Les transactions elles-mêmes sont traitées par notre partenaire FedaPay ; Shoply ne stocke aucune donnée bancaire.</li>
              <li><strong>Notifications :</strong> jetons techniques (FCM) permettant d&apos;envoyer des notifications push aux abonnés d&apos;une boutique (nouveaux produits, retours en stock).</li>
              <li><strong>Usage :</strong> préférences (langue, thème), données techniques de navigation (type d&apos;appareil, pages visitées) à des fins d&apos;amélioration du service.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-black text-[#0D1B3E] dark:text-white mb-3">2. Comment nous utilisons ces données</h2>
            <p>
              Ces données sont utilisées pour : faire fonctionner votre boutique en ligne et le tableau de bord
              vendeur, traiter les commandes et paiements, envoyer des notifications (nouveaux produits, commandes,
              retours en stock), assurer le support client, améliorer et sécuriser la plateforme, et générer des
              pages publiques de boutique/produit référencées par les moteurs de recherche.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-[#0D1B3E] dark:text-white mb-3">3. Partage avec des tiers</h2>
            <p>Shoply s&apos;appuie sur les prestataires suivants pour fonctionner :</p>
            <ul className="list-disc pl-5 flex flex-col gap-2 mt-2">
              <li><strong>Firebase / Google Cloud :</strong> hébergement du site, authentification, base de données, notifications push.</li>
              <li><strong>FedaPay :</strong> traitement des paiements Mobile Money.</li>
              <li><strong>ImgBB :</strong> hébergement des images de produits/boutiques.</li>
              <li><strong>Render :</strong> service backend d&apos;envoi des notifications.</li>
            </ul>
            <p className="mt-2">
              Nous ne vendons jamais vos données personnelles à des tiers à des fins publicitaires.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-[#0D1B3E] dark:text-white mb-3">4. Réseaux sociaux connectés</h2>
            <p>
              Si un vendeur choisit de connecter un compte de réseau social (par exemple TikTok, Facebook ou
              Instagram) pour publier automatiquement ses nouveaux produits, Shoply accède uniquement aux
              autorisations strictement nécessaires à cette publication (par exemple : publier du contenu en son
              nom). Ces autorisations peuvent être révoquées à tout moment par le vendeur depuis son tableau de bord
              ou directement depuis les paramètres de son compte sur le réseau social concerné.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-[#0D1B3E] dark:text-white mb-3">5. Conservation des données</h2>
            <p>
              Vos données sont conservées tant que votre compte est actif. En cas de suppression de compte, les
              données personnelles sont supprimées ou anonymisées dans un délai raisonnable, sauf obligation légale
              de conservation (par exemple, données de facturation).
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-[#0D1B3E] dark:text-white mb-3">6. Sécurité</h2>
            <p>
              Les données sont stockées sur des infrastructures sécurisées (Firebase/Google Cloud), avec des règles
              d&apos;accès restreignant la lecture et l&apos;écriture aux seuls utilisateurs autorisés. Les mots de
              passe sont gérés de façon chiffrée par notre fournisseur d&apos;authentification.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-[#0D1B3E] dark:text-white mb-3">7. Vos droits</h2>
            <p>
              Vous pouvez à tout moment demander l&apos;accès, la correction ou la suppression de vos données
              personnelles en nous contactant à <a href="mailto:didilolade@gmail.com" className="text-[#0A66FF] font-semibold hover:underline">didilolade@gmail.com</a>.
              Vous pouvez également modifier les informations de votre boutique directement depuis votre tableau de
              bord.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-[#0D1B3E] dark:text-white mb-3">8. Cookies</h2>
            <p>
              Shoply utilise uniquement des cookies/stockages techniques nécessaires au fonctionnement du site
              (session, préférence de langue, thème clair/sombre). Aucun cookie publicitaire tiers n&apos;est utilisé.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-[#0D1B3E] dark:text-white mb-3">9. Modifications de cette politique</h2>
            <p>
              Cette politique peut être mise à jour pour refléter l&apos;évolution du service ou de la
              réglementation. La date de dernière mise à jour est indiquée en haut de cette page.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-[#0D1B3E] dark:text-white mb-3">10. Contact</h2>
            <p>
              Pour toute question relative à cette politique de confidentialité : <a href="mailto:didilolade@gmail.com" className="text-[#0A66FF] font-semibold hover:underline">didilolade@gmail.com</a>.
            </p>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
