import { BookingForm } from './components/BookingForm';
import { CheckerBand } from './components/CheckerBand';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Meter } from './components/Meter';
import { Services } from './components/Services';

/** Page unique du site Taxi Joe : les sections dans l'ordre, séparées par des bandes damier. */
export default function App() {
  return (
    <>
      <a href="#contenu" className="skip-link">
        Aller au contenu
      </a>
      <Header />
      <main id="contenu">
        <Hero />
        <CheckerBand />
        <Meter />
        <CheckerBand />
        <Services />
        <CheckerBand />
        <BookingForm />
      </main>
      <Footer />
    </>
  );
}
