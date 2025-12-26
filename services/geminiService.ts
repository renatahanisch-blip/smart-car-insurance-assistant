import { GoogleGenAI } from "@google/genai";
import { InsuranceFormData } from '../types';

const SYSTEM_INSTRUCTION = `
Rolle und Zielsetzung: Du bist "REMAlino MF", der intelligente Offerten-Assistent. Deine Hauptaufgabe ist es, alle in den INPUT-VARIABLEN bereitgestellten Daten in drei klar definierte Blöcke umzuwandeln:

1. 📄 ECOhub INPUT BLOCK: Ein strukturierter Textblock, der sofort in die Offertsysteme kopiert werden kann.
2. 💡 TARIF-ANALYSE BLOCK: Eine Analyse, die auf Basis hinterlegter Schweizer Versicherungslogiken kritische Prämien-Treiber identifiziert.
3. 💰 OFFERT-SIMULATION: Eine tabellarische Gegenüberstellung und Prämien-Indikation NUR für die vom User ausgewählten Versicherer.

Abstrakte Schweizer Tarif-Logiken:
- LOGIK ZUSCHLAG: Hochrisiko-Zonen (Städte wie Zürich 80xx, Genf, Basel) führen oft zu +10-20% auf Haftpflicht.
- LOGIK ZUSCHLAG: Junglenker unter 26 Jahren führen zu massiven Aufschlägen (20-30%), insbesondere bei AXA und Helvetia Baloise.
- LOGIK RABATT: Wenigfahrer (< 8'000 km) werden oft von Zurich und Allianz stärker rabattiert.
- LOGIK DECKUNG: Bonusschutz & Grobfahrlässigkeit zusammen erhöhen die Prämie um ca. 10-15%.
- LOGIK SCHADEN: Vor-Schäden führen zu Bonus-Rückstufungen, wobei die 'Allianz' hier oft kulantere Einstufungsmodelle hat als z.B. die 'AXA'.

Anweisungen für den Output:
- Generiere den Output im Markdown-Format.
- Im Block "OFFERT-SIMULATION": Erstelle eine Markdown-Tabelle mit den Spalten "Anbieter", "Einschätzung", "Pro & Contra", "Geschätzte Prämie (CHF)". 
- Fülle die "Geschätzte Prämie" mit plausiblen fiktiven Werten basierend auf dem Fahrzeugwert und den Risikofaktoren (z.B. "ca. 1'200 - 1'300").
- Simuliere ausschliesslich die angefragten Gesellschaften.
`;

export const generateAnalysis = async (data: InsuranceFormData): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Formatting the input data for the model
  const userPrompt = `
    Bitte generiere die Analyse und Offert-Simulation für folgende Input-Variablen:

    A. Kunden-Daten:
    Name: ${data.lastName} ${data.firstName}
    Nationalität: ${data.nationality} ${data.permitType ? `(${data.permitType})` : ''}
    Führerausweis seit: ${data.licenseDate}
    PLZ/Ort: ${data.zipCode} ${data.city}
    Geburtsdatum VN: ${data.birthDate}
    Schadenfälle (HP): ${data.claimsHP}
    Schadenfälle (VK): ${data.claimsVK}

    B. Fahrzeug-Daten:
    Marke/Typ: ${data.makeModel}
    Katalogpreis (NP): CHF ${data.catalogPrice}
    kW-Leistung: ${data.powerKw} kW
    Jahres-KM-Leistung: ${data.annualMileage} km
    Junglenker < 26: ${data.youngDriver ? 'JA' : 'NEIN'}
    Nutzung: ${data.usage === 'business' ? 'Geschäftlich' : 'Privat'}
    Garagist: ${data.garageName}
    Kontakt Garagist: ${data.garageContact}

    C. Deckungs-Wunsch:
    Kasko-Art: ${data.coverageType}
    SB-Haftpflicht: CHF ${data.deductibleLiability}
    SB-Kollision: CHF ${data.deductibleCollision}
    SB-Teilkasko: CHF ${data.deductiblePartial}
    Bonusschutz: ${data.bonusProtection ? 'JA' : 'NEIN'}
    Grobfahrlässigkeit: ${data.grossNegligence ? 'JA' : 'NEIN'}
    Parkschaden: ${data.parkingDamage ? 'JA' : 'NEIN'}
    Assistance: ${data.assistance ? 'JA' : 'NEIN'}

    D. Gewünschte Anbieter für Simulation:
    ${data.selectedProviders.length > 0 ? data.selectedProviders.join(', ') : 'Alle verfügbaren Anbieter'}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.3, 
      },
    });

    return response.text || "Keine Antwort generiert.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Fehler bei der Generierung der Offerten-Analyse. Bitte versuchen Sie es erneut.");
  }
};