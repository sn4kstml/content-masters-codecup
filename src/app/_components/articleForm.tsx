"use client"; // Помечаем компонент как клиентский
import { useState, useEffect } from "react";

const ArticleForm = () => {
  const [authorName, setAuthorName] = useState("");
  const [bio, setBio] = useState("");
  const [vocabulary, setVocabulary] = useState("");
  const [theme, setTheme] = useState("");
  const [tone, setTone] = useState("формальный");
  const [mode, setMode] = useState("вручную");
  const [generatedArticle, setGeneratedArticle] = useState("");
  const [articles, setArticles] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<string[]>([]);

  const buildRequestManual = (name: string, biography: string, phrases: string, theme: string, tone: string) => {
    const prompt = `===Instruction
    Твоя задача на основании контекста ты должен написать статью...

    ===Context
    Имя автора: ${name}
    Описание/биография: ${biography}
    Словарный запас: ${phrases}
    Тематика (специализация): ${theme}
    Тональность текста: ${tone}
    
    ===Output
    Response must be JSON only without additional text
    {
      "article": "Статья"
    }

    ===Response`;
    console.log(prompt);
    return {
      model: "gpt-4o-mini",
      messages: [
        {"role": "system", "content": "You are ChatGPT, a helpful assistant."},
        {"role": "user", "content": prompt}
      ],
      max_tokens: 1000,
      temperature: 0.7
    };
  };

  const buildRequestAuto = (name: string, theme: string) => {
    const prompt = `===Instruction
    Твоя задача на основании имени автора и темы написать статью от его имени...

    ===Context
    Имя автора: ${name}
    Тематика (специализация): ${theme}
    
    ===Output
    Response must be JSON only without additional text
    {
      "article": "Статья"
    }

    ===Response`;
    console.log(prompt);
    return {
      model: "gpt-4o-mini",
      messages: [
        {"role": "system", "content": "You are ChatGPT, a helpful assistant."},
        {"role": "user", content: prompt}
      ],
      max_tokens: 1000,
      temperature: 0.7
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const requestBody = mode === "вручную" 
      ? buildRequestManual(authorName, bio, vocabulary, theme, tone) 
      : buildRequestAuto(authorName, theme);
    
    const response = await fetch('https://api.proxyapi.ru/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk-8hMBBWM4X1IjBUIKT4pfXAtqYInRTF44'
      },
      body: JSON.stringify(requestBody),
    });
    const data = await response.json();
    const articleText = data.choices[0].message.content;
    const parsedData = JSON.parse(articleText);
    const article = parsedData.article;

    setGeneratedArticle(article);
    setArticles((prevArticles) => [...prevArticles, article]);
  };

  const handleSaveProfile = async () => {
    const authorData = {
      name: authorName,
      bio: bio,
      keywords: `{${vocabulary.split(',').map(keyword => keyword.trim()).join(',')}}`, // Форматируем массив как строку
      specialization: theme,
      tone: tone,
      generatedArticles: articles, // Добавляем сгенерированные статьи
    };

    try {
      const response = await fetch('/api/authors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(authorData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Неизвестная ошибка');
      }

      alert('Профиль успешно сохранен!');
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert('Ошибка при сохранении профиля: ' + error.message);
      } else {
        alert('Ошибка при сохранении профиля: Неизвестная ошибка');
      }
    }
  };

  const fetchSearchResults = async (authorName: string) => {
    try {
      const response = await fetch('/api/search?query=' + authorName, {
        method: 'GET',
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      });
      const xmlText = await response.text();
      console.log(response);
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "application/xml");
      const titles = Array.from(xmlDoc.querySelectorAll("group doc title"))
        .slice(4, 10)
        .map(title => title.textContent || "");
      console.log(titles);
      setSearchResults(titles);
    } catch (error) {
      console.error("Ошибка при получении результатов поиска:", error);
    }
  };

  const handleAuthorNameKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && mode === "авто") {
      e.preventDefault(); // Предотвращаем отправку формы
      fetchSearchResults(authorName);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md">
      <div className="mb-4">
        <label htmlFor="mode" className="block text-sm font-medium text-gray-700">Режим создания статьи:</label>
        <div className="flex items-center mt-2">
          <button 
            type="button" 
            onClick={() => setMode("вручную")} 
            className={`flex-1 p-2 rounded-l-md transition-all duration-300 ${mode === "вручную" ? "bg-gradient-to-r from-gray-400 to-gray-600 text-white transform scale-105" : "bg-gray-200"}`}
          >
            Вручную
          </button>
          <button 
            type="button" 
            onClick={() => setMode("авто")} 
            className={`flex-1 p-2 rounded-r-md transition-all duration-300 ${mode === "авто" ? "bg-gradient-to-r from-gray-400 to-gray-600 text-white transform scale-105" : "bg-gray-200"}`}
          >
            Авто
          </button>
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="authorName" className="block text-sm font-medium text-gray-700">Имя автора (нажмите Enter)</label>
        <input
          id="authorName"
          type="text"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          onKeyPress={handleAuthorNameKeyPress}
          required
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="theme" className="block text-sm font-medium text-gray-700">Тематика</label>
        {mode === "авто" ? (
          <select
            id="theme"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Выберите актуальную тематику</option>
            {searchResults.map((result, index) => (
              <option key={index} value={result}>{result}</option>
            ))}
          </select>
        ) : (
          <input
            id="theme"
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        )}
      </div>
      {mode === "вручную" && (
        <>
          <div className="mb-4">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Описание/биография</label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="vocabulary" className="block text-sm font-medium text-gray-700">Словарный запас</label>
            <input
              id="vocabulary"
              type="text"
              value={vocabulary}
              onChange={(e) => setVocabulary(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label>Тональность текста:</label>
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="формальный"
                  checked={tone === "формальный"}
                  onChange={() => setTone("формальный")}
                  className="mr-2"
                />
                Формальный
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="неформальный"
                  checked={tone === "неформальный"}
                  onChange={() => setTone("неформальный")}
                  className="mr-2"
                />
                Неформальный
              </label>
            </div>
          </div>
        </>
      )}
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">Создать статью</button>
      <button type="button" onClick={handleSaveProfile} className="w-full mt-2 bg-green-500 text-white p-2 rounded-md hover:bg-green-600">
        Сохранить профиль
      </button>
      {generatedArticle && (
        <div className="mt-4 p-4 border border-gray-300 rounded-md">
          <h3 className="font-medium">Сгенерированная статья:</h3>
          <p>{generatedArticle}</p>
        </div>
      )}
      {articles.length > 0 && (
        <div className="mt-4 p-4 border border-gray-300 rounded-md">
          <h3 className="font-medium">Сгенерированные статьи:</h3>
          {articles.map((article, index) => (
            <div key={index} className="mt-2 p-2 border border-gray-200 rounded-md">
              <p>{article}</p>
            </div>
          ))}
        </div>
      )}
    </form>
  );
};

export default ArticleForm;