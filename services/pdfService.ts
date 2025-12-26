import { jsPDF } from "jspdf";
import { InsuranceFormData } from "../types";

// Helper to format currency like "1'150.00"
export const formatSwissPrice = (amount: number) => {
  return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, "'");
};

export const getEstimatedPrice = (provider: string, data: InsuranceFormData) => {
  const basePrice = 800;
  // Demo calculation based on name length to create variance
  const factor = provider.length * 50; 
  return basePrice + factor + (data.youngDriver ? 300 : 0);
};

export const generateQuotePDF = (provider: string, data: InsuranceFormData) => {
  const doc = new jsPDF();
  const date = new Date().toLocaleDateString('de-CH');
  
  const estimatedPrice = getEstimatedPrice(provider, data);

  // Header / Branding Simulation
  doc.setFontSize(22);
  doc.setTextColor(0, 51, 153); // Generic Blue
  doc.text(`${provider} Versicherungs-Offerte`, 20, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Erstellt via REMAlino MF-Offerten am ${date}`, 20, 28);

  // Line separator
  doc.setLineWidth(0.5);
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 35, 190, 35);

  // Customer Data
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("Versicherungsnehmer", 20, 50);
  
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.text(`Name: ${data.firstName} ${data.lastName}`, 20, 60);
  doc.text(`Adresse: ${data.zipCode} ${data.city}`, 20, 66);
  doc.text(`Geburtsdatum: ${data.birthDate}`, 20, 72);
  doc.text(`Nationalität: ${data.nationality} ${data.permitType ? `(${data.permitType})` : ''}`, 20, 78);

  // Vehicle Data
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("Fahrzeugdaten", 110, 50);
  
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.text(`Fahrzeug: ${data.makeModel}`, 110, 60);
  doc.text(`Katalogpreis: CHF ${formatSwissPrice(data.catalogPrice)}`, 110, 66);
  doc.text(`Leistung: ${data.powerKw} kW`, 110, 72);
  doc.text(`Jahres-KM: ${data.annualMileage}`, 110, 78);
  if (data.garageName) {
      doc.text(`Garagist: ${data.garageName}`, 110, 84);
  }

  // Coverage Details
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("Gewählte Deckung", 20, 100);

  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  let yPos = 110;
  
  const addLine = (label: string, value: string) => {
    doc.text(label, 20, yPos);
    doc.text(value, 80, yPos);
    yPos += 8;
  };

  addLine("Deckungsart:", data.coverageType.toUpperCase());
  addLine("Haftpflicht SB:", `CHF ${formatSwissPrice(data.deductibleLiability)}`);
  if (data.coverageType !== 'haftpflicht') {
    addLine("Kollision SB:", `CHF ${formatSwissPrice(data.deductibleCollision)}`);
    addLine("Teilkasko SB:", `CHF ${formatSwissPrice(data.deductiblePartial)}`);
  }
  addLine("Bonusschutz:", data.bonusProtection ? "Ja" : "Nein");
  addLine("Grobfahrlässigkeit:", data.grossNegligence ? "Ja" : "Nein");
  addLine("Parkschaden:", data.parkingDamage ? "Ja" : "Nein");

  // Price Box
  doc.setDrawColor(0, 51, 153);
  doc.setLineWidth(1);
  doc.rect(110, 95, 80, 40);
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("Geschätzte Jahresprämie", 115, 105);
  
  doc.setFontSize(24);
  doc.setTextColor(0, 51, 153);
  doc.text(`CHF ${formatSwissPrice(estimatedPrice)}`, 115, 125);
  doc.setFontSize(8);
  doc.text("* unverbindliche Indikation", 115, 132);

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text("Dies ist eine automatisch generierte Simulation zu Demonstrationszwecken.", 20, 280);
  
  // Save
  doc.save(`Offerte_${provider}_${data.lastName}.pdf`);
};

export const generateDataSheetPDF = (data: InsuranceFormData) => {
  const doc = new jsPDF();
  const date = new Date().toLocaleDateString('de-CH');

  // Header
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text("Fahrzeugdaten & Offertanfrage", 20, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Datenblatt erstellt am ${date}`, 20, 28);
  doc.line(20, 32, 190, 32);

  // Helper to add sections
  let currentY = 45;
  const sectionTitle = (title: string) => {
      doc.setFontSize(14);
      doc.setTextColor(0, 51, 153);
      doc.text(title, 20, currentY);
      currentY += 10;
  };
  
  const addField = (label: string, value: string) => {
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      doc.text(label, 20, currentY);
      doc.setTextColor(0, 0, 0);
      doc.text(value, 80, currentY);
      currentY += 7;
  };

  // 1. Kunde
  sectionTitle("1. Kunden-Daten");
  addField("Name / Vorname:", `${data.lastName} ${data.firstName}`);
  addField("Geburtsdatum:", data.birthDate || "-");
  addField("Adresse:", `${data.zipCode} ${data.city}`);
  addField("Nationalität:", `${data.nationality} ${data.permitType ? `(${data.permitType})` : ''}`);
  addField("Führerausweis seit:", data.licenseDate || "-");
  addField("Schäden (HP/VK) 5J:", `${data.claimsHP} / ${data.claimsVK}`);
  currentY += 5;

  // 2. Fahrzeug
  sectionTitle("2. Fahrzeug-Daten");
  addField("Marke & Modell:", data.makeModel);
  addField("Katalogpreis:", `CHF ${formatSwissPrice(data.catalogPrice)}`);
  addField("Leistung:", `${data.powerKw} kW`);
  addField("Jahres-Kilometer:", `${data.annualMileage} km`);
  addField("Nutzung:", data.usage === 'business' ? "Geschäftlich" : "Privat");
  addField("Junglenker < 26:", data.youngDriver ? "Ja" : "Nein");
  addField("Garagist:", data.garageName || "-");
  addField("Kontakt Garagist:", data.garageContact || "-");
  currentY += 5;

  // 3. Deckungswunsch
  sectionTitle("3. Gewünschte Deckung");
  addField("Deckungsart:", data.coverageType.toUpperCase());
  addField("Selbstbehalt HP:", `CHF ${formatSwissPrice(data.deductibleLiability)}`);
  if (data.coverageType !== 'haftpflicht') {
    addField("Selbstbehalt Kollision:", `CHF ${formatSwissPrice(data.deductibleCollision)}`);
    addField("Selbstbehalt Teilkasko:", `CHF ${formatSwissPrice(data.deductiblePartial)}`);
  }
  addField("Bonusschutz:", data.bonusProtection ? "Ja" : "Nein");
  addField("Grobfahrlässigkeit:", data.grossNegligence ? "Ja" : "Nein");
  addField("Parkschaden:", data.parkingDamage ? "Ja" : "Nein");
  addField("Assistance:", data.assistance ? "Ja" : "Nein");

  currentY += 15;
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("Dieses Dokument wurde automatisch durch REMAlino MF-Offerten generiert.", 20, currentY);

  doc.save(`Fahrzeugdaten_${data.lastName}.pdf`);
};