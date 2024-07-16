import { describe, it, expect, beforeEach } from 'vitest';
import { AppImpl, Flashcard, Box } from '../src/index';

describe('Leitner System Tests', () => {
  let app: AppImpl;

  beforeEach(() => {
    app = new AppImpl();  // Reset l'application pour chaque test
  });

  it('Créer un flashcard dans Box 1', () => {
    const question = 'Quelle est mon école ?';
    const answer = 'EFREI';
    app.createFlashcard(question, answer);
    const result = app.boxes[0].deck.find(card => card.question === question && card.answer === answer);
    expect(result).toBeDefined();
  });

  it('Déplace une flashcard avec uen bonne réponse dans la prochaine Box', () => {
    const question = 'Quelle sera ma note à cet examen ?';
    const answer = '12';
    app.createFlashcard(question, answer);
    const flashcard = app.boxes[0].deck.find(card => card.question === question);
    app.moveFlashcard(flashcard, true);
    const inBox1 = app.boxes[0].deck.find(card => card.question === question);
    const inBox2 = app.boxes[1].deck.find(card => card.question === question);
    expect(inBox1).toBeUndefined();
    expect(inBox2).toBeDefined();
  });

  it('Renvoie une flashcard icorrect dans la Box 1', () => {
    const question = 'De quelle couleur est le cheval blanc d Henri IV ?';
    const answer = 'Blanc';
    app.createFlashcard(question, answer);
    let flashcard = app.boxes[0].deck.find(card => card.question === question);
    app.moveFlashcard(flashcard, true);  // Supposons qu'elle a été déplacée à Box 2
    flashcard = app.boxes[1].deck.find(card => card.question === question);
    app.moveFlashcard(flashcard, false); // Mauvaise réponse
    const inBox1 = app.boxes[0].deck.find(card => card.question === question);
    const inBox2 = app.boxes[1].deck.find(card => card.question === question);
    expect(inBox1).toBeDefined();
    expect(inBox2).toBeUndefined();
  });

  it('Ajoute et affiche tous les cas dans une Box', () => {
    const questions = [
      { question: 'De quelle couleur est le cheval blanc d Henri IV ?', answer: 'Blanc' },
      { question: 'Quelle est mon école ?', answer: 'EFREI' }
    ];
    questions.forEach(q => app.createFlashcard(q.question, q.answer));
    expect(app.boxes[0].deck.length).toBe(questions.length);
    questions.forEach(q => {
      expect(app.boxes[0].deck.some(card => card.question === q.question && card.answer === q.answer)).toBeTruthy();
    });
  });

  it('Créer et révise les flashcards', () => {
    app.createFlashcard('Quelle est mon école ?', 'EFREI');
    let card = app.boxes[0].deck[0];
    app.moveFlashcard(card, true); // Bonne réponse
    expect(app.boxes[1].deck).toContain(card); // Déplacement vers prochaine box
    app.moveFlashcard(card, false); // Mauvaise réponse
    expect(app.boxes[0].deck).toContain(card); // Reset à la première Box
  });
});
