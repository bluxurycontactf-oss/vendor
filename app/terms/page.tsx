import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

export const metadata = {
  title: "Conditions Générales d'Utilisation — Shoply",
  description: "Conditions Générales d'Utilisation de la plateforme Shoply.",
};

export default function TermsPage() {
  return (
    <main>
      <Navbar />

      <div className="relative bg-gradient-to-br from-[#F0F7FF] via-white to-[#EAF3FF] dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 pt-28 pb-12 px-4 text-center border-b border-gray-100 dark:border-gray-800">
        <h1 className="text-3xl sm:text-4xl font-black text-[#0D1B3E] dark:text-white mb-3">Conditions Générales d&apos;Utilisation</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Dernière mise à jour : 12 juin 2026</p>
      </div>

      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto flex flex-col gap-8 text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">

          <div>
            <h2 className="text-xl font-black text-[#0D1B3E] dark:text-white mb-3">1. Présentation du service</h2>
            <p>
              Shoply (accessible sur myshoply.web.app) est une plateforme SaaS qui permet à toute personne de créer
              et gérer gratuitement sa propre boutique en ligne, de mettre en vente des produits, de recevoir des
              commandes et d&apos;être payée via Mobile Money. En utilisant Shoply, vous acceptez sans réserve les
              présentes Conditions Générales d&apos;Utilisation (« CGU »).
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-[#0D1B3E] dark:text-white mb-3">2. Création de compte et de boutique</h2>
            <p>
              Pour utiliser Shoply, vous devez créer un compte avec une adresse email valide. Vous êtes responsable
              de la confidentialité de vos identifiants et de toute activité effectuée depuis votre compte. Les
              informations fournies (nom de la boutique, coordonnées, numéros de paiement) doivent être exactes et à
              jour.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-[#0D1B3E] dark:text-white mb-3">3. Plans et tarifs</h2>
            <p>
              Shoply propose plusieurs plans (Gratuit, Premium, Business) offrant des fonctionnalités et limites
              différentes (nombre de produits, nombre de boutiques, produits vedettes, frais de transaction, etc.).
              Le détail de chaque plan est consultable sur la page d&apos;accueil. Le passage à un plan payant se fait
              via un paiement Mobile Money sécurisé par notre prestataire FedaPay et donne accès aux fonctionnalités
              correspondantes pour la durée annoncée.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-[#0D1B3E] dark:text-white mb-3">4. Paiements et transactions</h2>
            <p>
              Les paiements des clients (achats sur les boutiques) ainsi que les abonnements aux plans payants sont
              traités par notre partenaire de paiement FedaPay (Mobile Money MTN, Moov, Wave, Orange Money). Shoply ne
              stocke aucune donnée bancaire ou de carte. Sur le plan Gratuit, des frais de transaction sont ajoutés au
              prix payé par le client conformément aux informations affichées au moment de la commande. Les sommes
              dues aux vendeurs sont reversées sur les numéros Mobile Money renseignés dans leur compte, après
              confirmation de la livraison.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-[#0D1B3E] dark:text-white mb-3">5. Obligations du vendeur</h2>
            <p>
              Le vendeur s&apos;engage à : (a) ne proposer que des produits ou services licites, conformes à la
              législation en vigueur ; (b) fournir des descriptions, prix et photos exacts et non trompeurs ; (c) ne
              pas vendre de produits contrefaits, dangereux, ou interdits ; (d) honorer les commandes reçues et
              assurer un service client correct. Shoply se réserve le droit de retirer tout produit ou de suspendre
              toute boutique ne respectant pas ces règles.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-[#0D1B3E] dark:text-white mb-3">6. Commandes et livraison</h2>
            <p>
              Les commandes passées par les clients sont transmises au vendeur, qui organise la livraison (lui-même
              ou via un agent livreur). Le statut des commandes (en attente, en livraison, livrée) est mis à jour
              dans le tableau de bord du vendeur et déclenche, le cas échéant, le versement des sommes dues et
              l&apos;envoi de notifications.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-[#0D1B3E] dark:text-white mb-3">7. Propriété intellectuelle</h2>
            <p>
              La marque Shoply, son logo, son design et son code restent la propriété de leurs éditeurs. Le contenu
              ajouté par chaque vendeur (textes, photos de produits, nom de boutique) reste sa propriété, mais le
              vendeur garantit disposer des droits nécessaires sur ce contenu et autorise Shoply à l&apos;afficher et
              à le diffuser dans le cadre du fonctionnement normal du service (y compris sur les pages publiques de la
              boutique et, le cas échéant, sur des réseaux sociaux connectés par le vendeur).
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-[#0D1B3E] dark:text-white mb-3">8. Suspension et résiliation</h2>
            <p>
              Shoply peut suspendre ou supprimer un compte en cas de fraude, de non-respect des présentes CGU,
              d&apos;activité illégale ou frauduleuse, ou d&apos;inactivité prolongée. Le vendeur peut supprimer son
              compte à tout moment depuis son tableau de bord ou en contactant le support.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-[#0D1B3E] dark:text-white mb-3">9. Limitation de responsabilité</h2>
            <p>
              Shoply fournit une plateforme technique et n&apos;est pas partie aux transactions entre vendeurs et
              clients. Shoply ne saurait être tenu responsable de la qualité des produits vendus, des retards de
              livraison, ou de tout litige commercial entre un vendeur et son client. Le service est fourni « en
              l&apos;état », sans garantie de disponibilité ininterrompue.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-[#0D1B3E] dark:text-white mb-3">10. Modification des CGU</h2>
            <p>
              Shoply peut modifier les présentes CGU à tout moment. Les utilisateurs seront informés des changements
              significatifs. La poursuite de l&apos;utilisation du service après modification vaut acceptation des
              nouvelles CGU.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-[#0D1B3E] dark:text-white mb-3">11. Droit applicable et contact</h2>
            <p>
              Les présentes CGU sont régies par le droit applicable au Bénin. Pour toute question, vous pouvez nous
              contacter à l&apos;adresse : <a href="mailto:didilolade@gmail.com" className="text-[#0A66FF] font-semibold hover:underline">didilolade@gmail.com</a>.
            </p>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
