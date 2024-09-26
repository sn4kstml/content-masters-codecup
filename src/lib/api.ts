import { Post } from "@/interfaces/post";
import { Author } from "@/interfaces/author"; // Импортируем тип Author
import fs from "fs";
import matter from "gray-matter";
import { join } from "path";
import { sql } from "@vercel/postgres"; // Импортируем sql для работы с базой данных

const postsDirectory = join(process.cwd(), "_posts");

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}

export function getPostBySlug(slug: string) {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return { ...data, slug: realSlug, content } as Post;
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}

// Новая функция для получения всех авторов
export async function getAllAuthors(): Promise<Author[]> {
  try {
    const { rows } = await sql`SELECT * FROM authors;`; // Запрос к базе данных
    return rows as Author[]; // Возвращаем массив авторов
  } catch (error) {
    console.error("Ошибка при получении авторов:", error);
    return []; // Возвращаем пустой массив в случае ошибки
  }
}
