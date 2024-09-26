export type Author = {
  name: string;
  picture: string;
  bio?: string; // Добавляем свойство bio
  generatedArticles?: string[]; // Добавляем свойство для сгенерированных статей
};
