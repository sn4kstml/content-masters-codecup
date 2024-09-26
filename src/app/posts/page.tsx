"use client";

import { useEffect, useState } from "react";
import { Author } from "@/interfaces/author";

export default function Posts() {
    const [authors, setAuthors] = useState<Author[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);

    useEffect(() => {
        const fetchAuthors = async () => {
            try {
                const response = await fetch('/api/authors');
                if (!response.ok) {
                    throw new Error(`Ошибка сети: ${response.statusText}`);
                }
                const data = await response.json();
                setAuthors(data);
            } catch (error) {
                console.error("Ошибка при получении авторов:", error);
                setError(error instanceof Error ? error.message : "Неизвестная ошибка");
            }
        };

        fetchAuthors();
    }, []);

    return (
        <div>
            {error && <p className="text-red-500">Ошибка: {error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {authors.map((author, index) => (
                    <div key={`${author.name}-${index}`} className="border p-4 rounded-lg shadow-md cursor-pointer" onClick={() => setSelectedAuthor(author)}>
                        <h3 className="text-2xl font-semibold">{author.name}</h3>
                        <p className="text-gray-600">{author.bio || "Нет информации о биографии."}</p>
                    </div>
                ))}
            </div>
            {selectedAuthor && (
                <div className="mt-8">
                    <h2 className="text-3xl font-bold">{selectedAuthor.name}</h2>
                    <p className="text-gray-600">{selectedAuthor.bio || "Нет информации о биографии."}</p>
                    {selectedAuthor.generatedArticles && selectedAuthor.generatedArticles.length > 0 ? (
                        <div className="mt-4">
                            <h4 className="text-xl font-semibold">Сгенерированные статьи:</h4>
                            {selectedAuthor.generatedArticles.map((article, index) => (
                                <p key={`${selectedAuthor.name}-article-${index}`} className="text-gray-600 mt-2">{article}</p>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600 mt-4">Нет сгенерированных статей.</p>
                    )}
                </div>
            )}
        </div>
    );
}