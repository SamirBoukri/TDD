// Définition de l'interface Flashcard
export interface Flashcard {
  question: string;
  answer: string;
}

// Définition de l'interface Box
export interface Box {
  id: number;
  deck: Flashcard[];
  reviewFrequency: 'daily' | 'every3days' | 'weekly';
}

// Définition de l'interface App
export interface App {
  boxes: Box[];
  createFlashcard(question: string, answer: string): void;
  moveFlashcard(flashcard: Flashcard, correct: boolean): void;
}

// Implémentation de l'interface App dans la classe FlashcardApp
export class AppImpl implements App {
  boxes: Box[];

  constructor() {
    this.boxes = [
      { id: 1, deck: [], reviewFrequency: 'daily' },
      { id: 2, deck: [], reviewFrequency: 'every3days' },
      { id: 3, deck: [], reviewFrequency: 'weekly' }
    ];
  }

  createFlashcard(question: string, answer: string): void {
    this.boxes[0].deck.push({ question, answer });
  }

  moveFlashcard(flashcard: Flashcard, correct: boolean): void {
    let currentBox = this.boxes.find(box => box.deck.includes(flashcard));
    if (currentBox) {
      currentBox.deck = currentBox.deck.filter(card => card !== flashcard);
      
      const targetBox = correct ? Math.min(this.boxes.indexOf(currentBox) + 1, this.boxes.length - 1) : 0;
      this.boxes[targetBox].deck.push(flashcard);
    }
  }
}

// Point d'entrée principal pour exécuter l'application
const main = () => {
  const app = new AppImpl();

  // Créer des flashcards
  app.createFlashcard('Quelle est mon école ?', 'EFREI');
  app.createFlashcard('Quelle sera ma note à cet examen ?', '12');

  // Afficher l'état initial des boîtes
  console.log('Etat initial des boxes:');
  app.boxes.forEach(box => console.log(`Box ${box.id}: ${box.deck.map(card => `${card.question} - ${card.answer}`).join(', ')}`));

  // Réviser une flashcard correctement
  const flashcard = app.boxes[0].deck[0];
  app.moveFlashcard(flashcard, true);
  console.log('\nAprès réponse correct:');
  app.boxes.forEach(box => console.log(`Box ${box.id}: ${box.deck.map(card => `${card.question} - ${card.answer}`).join(', ')}`));

  // Réviser la même flashcard incorrectement
  app.moveFlashcard(flashcard, false);
  console.log('\nAprès réponse incorrect:');
  app.boxes.forEach(box => console.log(`Box ${box.id}: ${box.deck.map(card => `${card.question} - ${card.answer}`).join(', ')}`));
};

main();
